import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
import {preview} from 'vite';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const server=await preview({preview:{port:0,host:'127.0.0.1'}});
const base='http://127.0.0.1:'+server.httpServer.address().port;
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
const results=[], errors=[], audits={};
const directory='docs/fornak-redesign-v5/bukti/interaksi';
fs.mkdirSync(directory,{recursive:true});
const visit=async path=>{await page.goto(base+path);await page.locator('h1').first().waitFor()};
const capture=async name=>{
 await page.screenshot({path:directory+'/'+name+'.jpg',quality:75});
 await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
 audits[name]=await page.evaluate(async()=> (await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)})));
};
const run=async(label,fn)=>{try{await fn();results.push({label,pass:true})}catch(e){results.push({label,pass:false,error:e.message})}};
page.setDefaultTimeout(5500);
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400)errors.push(r.url()+' '+r.status())});
try {
await run('Sitemap, seluruh rute dan tautan internal',async()=>{
 const xml=await(await page.request.get(base+'/sitemap.xml')).text();
 const paths=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
 assert.equal(paths.length,110);
 const urls=new Set();
 for(const p of paths){await visit(p);assert.notEqual(await page.locator('h1').first().innerText(),'Halaman tidak ditemukan.');const links=await page.locator('a[href^="/"]').evaluateAll(a=>a.map(e=>new URL(e.href).pathname));links.forEach(l=>urls.add(l))}
 for(const u of urls){assert.ok(paths.includes(u)||u.startsWith('/assets/'),u);const r=await page.request.get(base+u);assert.ok(r.ok(),u)}
});
await run('Menu papan ketik, pencarian global dan pilihan program',async()=>{
 await visit('/');await page.getByRole('button',{name:'Perpustakaan'}).click();await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Cari di situs'}).click();await page.getByRole('searchbox').fill('Habakuk');await capture('pencarian');await page.locator('dialog li a').first().click();assert.match(page.url(),/publikasi/);
 await visit('/');await page.getByRole('tab',{name:/Dialog lintas iman/}).click();assert.match(await page.getByRole('tabpanel').innerText(),/lintas denominasi/);
});
await run('Foto, panel misi dan rak publikasi dengan keyboard',async()=>{
 await visit('/');
 const photo=page.locator('.photo-stage img');
 const first=await photo.getAttribute('src');
 await page.getByRole('button',{name:'Foto berikutnya'}).click();
 assert.notEqual(await photo.getAttribute('src'),first);
 await page.getByRole('button',{name:'Foto sebelumnya'}).click();
 assert.equal(await photo.getAttribute('src'),first);
 const mission=page.getByRole('button',{name:/02 Menyuarakan/});
 await mission.focus();await page.keyboard.press('Enter');
 assert.equal(await mission.getAttribute('aria-expanded'),'true');
 assert.ok(await page.locator('.mission-folds p:visible').count());
 await page.getByRole('tab',{name:/Dialog lintas iman/}).focus();await page.keyboard.press('End');
 assert.match(await page.getByRole('tabpanel').innerText(),/Pancasila/);
 await page.getByRole('button',{name:/03 Silaturahmi/}).click();
 assert.match(await page.locator('.book-actions a[download]').getAttribute('href'),/silaturahmi/);
});
await run('Jurnal, filter topik, status kosong, artikel, navigasi kembali',async()=>{
 await visit('/jurnal');await page.getByLabel('Cari naskah').fill('xxxxxx');assert.equal(await page.locator('.journal-card').count(),0);
 await page.getByLabel('Cari naskah').fill('Amazing');await page.getByLabel('Topik',{exact:true}).selectOption('Sejarah & Transformasi');
 await page.getByRole('link',{name:'Baca naskah',exact:true}).click();await capture('artikel');
 await page.goBack();await page.getByLabel('Cari naskah').waitFor();assert.equal(await page.getByLabel('Cari naskah').inputValue(),'Amazing');
});
await run('Tiga PDF, unduhan asli, halaman, zoom dan pencarian',async()=>{
 await visit('/publikasi');const links=await page.getByRole('link',{name:'Baca publikasi',exact:true}).evaluateAll(a=>a.map(e=>e.pathname));
 assert.equal(links.length,3);
 for(const link of links){await visit(link);const next=page.getByRole('button',{name:'Halaman berikutnya'});await next.click();await page.getByText('Hal. 2 / 8').waitFor();await page.waitForFunction(()=>document.querySelector('.pdf-sheet canvas')?.width>300);await page.getByLabel('Perbesaran').selectOption('1.25');const href=await page.locator('.pdf-toolbar a[download]').getAttribute('href');const pdf=await(await page.request.get(base+href)).body();assert.equal(pdf.subarray(0,5).toString(),'%PDF-');await page.getByLabel('Cari dalam PDF').fill('Indonesia');await page.locator('.pdf-results').waitFor()}
 await page.locator('.pdf-reader').scrollIntoViewIfNeeded();await capture('pembaca');
});
await run('Filter galeri, lightbox, zoom, panah dan Escape',async()=>{
 await visit('/galeri');await page.getByRole('button',{name:'Manifesto',exact:true}).click();await page.locator('.gallery-tile').first().click();await page.getByRole('button',{name:'Perbesar gambar'}).click();await page.keyboard.press('ArrowRight');await capture('lightbox');await page.keyboard.press('Escape');assert.equal(await page.locator('dialog[open]').count(),0);
});
await run('Menu ponsel, chatbot, WhatsApp dan Instagram',async()=>{
 await page.setViewportSize({width:390,height:844});await visit('/');
 await page.getByLabel('Buka menu',{exact:true}).tap({timeout:1000}).catch(()=>page.getByLabel('Buka menu',{exact:true}).click());
 await page.locator('#mobile-navigation a[href="/kontak"]').click();await page.locator('h1').waitFor();
 assert.ok(await page.locator('main a[href^="https://wa.me/6289673335886"]').count());assert.ok(await page.locator('main a[href*="instagram.com/fornak.id"]').count());
 await page.getByRole('button',{name:'Buka Asisten FORNAK'}).click();await page.getByRole('button',{name:'Misi FORNAK'}).click();assert.match(await page.locator('.assistant-messages').innerText(),/Pancasila/);await capture('asisten');await page.keyboard.press('Escape');
});
await run('Opini lengkap, sumber asli dan bahasa antarmuka',async()=>{
 await visit('/jurnal');
 await page.locator('.journal-list__item h3 a').first().click();
 await page.locator('.inn-prose p').first().waitFor();
 assert.ok((await page.locator('.inn-prose').innerText()).length>500);
 assert.match(page.url(),/jurnal\/opini\//);
 await capture('opini');
 await visit('/publikasi');
 const language=page.locator('.locale-control select');
 for(const [code,heading] of [['en','Digital library'],['zh-CN','数字图书馆'],['zh-TW','數位圖書館']]){
  await language.selectOption(code);
  await page.waitForFunction(code=>document.documentElement.lang===code,code);
  assert.equal(await page.locator('html').getAttribute('lang'),code);
  assert.equal((await page.locator('h1').innerText()).toLowerCase(),heading.toLowerCase());
 }
 await page.reload();assert.equal(await language.inputValue(),'zh-TW');await language.selectOption('id');
});
await run('Formulir minat, ukuran foto arsip dan bentang buku',async()=>{
 await visit('/');
 await page.locator('.opening-actions a[href="#bergabung"]').click();
 await page.locator('#bergabung input').fill('Pengunjung');
 await page.locator('#bergabung select').selectOption({index:2});await page.locator('#bergabung textarea').fill('Usulan kegiatan');
 await page.evaluate(()=>{window.open=(url)=>{window.testDraft=url;return null}});
 await page.locator('#bergabung button').click();
 const draft=new URL(await page.evaluate(()=>window.testDraft));
 assert.equal(draft.pathname,'/6289673335886');assert.match(draft.searchParams.get('text'),/Pengunjung/);
 for(let i=0;i<3;i++){
  await page.getByRole('button',{name:'Foto berikutnya'}).click();
  const photo=page.locator('.photo-stage img');await photo.evaluate(el=>el.decode());
  assert.ok(await photo.evaluate(el=>el.clientWidth<=el.naturalWidth));
 }
 await visit('/publikasi');await page.evaluate(async()=>{await Promise.all([...document.querySelectorAll('.catalog-volume img')].map(i=>i.decode()))});
 assert.ok(await page.locator('.catalog-volume figure').evaluateAll(figures=>figures.every(f=>f.querySelector('img').getBoundingClientRect().bottom<=f.getBoundingClientRect().bottom)));
 await page.locator('.catalog-volume figure a').first().click();
 await page.getByRole('button',{name:'Dua halaman'}).click();
 await page.waitForFunction(()=>[...document.querySelectorAll('.pdf-sheet canvas')].filter(c=>c.width>300).length===2);
});
}finally{fs.writeFileSync(directory+'/journeys.json',JSON.stringify({results,errors,audits},null,2));console.log(results.map(r=>r.label+' '+r.pass+(r.error?' '+r.error.slice(0,150):'')).join('\n'));await browser.close();await new Promise(r=>server.httpServer.close(r))}
if(results.some(r=>!r.pass)||errors.length)process.exitCode=1;

