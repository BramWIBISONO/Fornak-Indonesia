import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';
import { preview } from 'vite';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const cycle = process.argv[2] || 'final';
const directory = path.join('docs/fornak-redesign-v5/bukti', cycle);
fs.mkdirSync(directory,{recursive:true});
const routes = ['/', '/tentang','/jurnal','/pemikiran','/publikasi','/kegiatan','/galeri','/kontak'];
const sizes = [[1440,900],[390,844],...[...(cycle === 'final' ? [[320,740],[360,800],[430,932],[768,1024],[1024,768],[1280,800],[1920,1080],[2560,1440]] : [])]];
const server = await preview({preview:{host:'127.0.0.1',port:0}});
const base = 'http://127.0.0.1:'+server.httpServer.address().port;
const browser = await chromium.launch({executablePath:process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const records = [], errors = [];
try {
  const page = await browser.newPage({reducedMotion:'reduce'});
  page.on('pageerror',e => errors.push(e.message));
  page.on('response',r => {if(r.status()>=400) errors.push(r.status()+' '+r.url())});
  for (const [width,height] of sizes) {
    await page.setViewportSize({width,height});
    for (const route of routes) {
      await page.goto(base+route);
      await page.locator('h1').first().waitFor();
      await page.evaluate(async()=>{await document.fonts.ready;await Promise.all(Array.from(document.images,async i=>{i.loading='eager';try{await i.decode()}catch{}}))});
      const layout = await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,broken:Array.from(document.images).filter(i=>!i.naturalWidth).map(i=>i.src)}));
      let violations=[];
      if(width===1440 || width===390) {
        await page.screenshot({path:path.join(directory,(route.slice(1)||'beranda')+'-'+width+'.jpg'),type:'jpeg',quality:65,fullPage:true});
        await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
        const report=await page.evaluate(async()=>await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));
        violations=report.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,reason:n.failureSummary}))}));
      }
      records.push({route,width,...layout,violations});
      fs.writeFileSync(path.join(directory,'audit.json'),JSON.stringify({records,errors},null,2));
    }
  }
  console.log(cycle,records.length,'checks',errors.length,'errors');
} finally {await browser.close();await new Promise(resolve=>server.httpServer.close(resolve))}

