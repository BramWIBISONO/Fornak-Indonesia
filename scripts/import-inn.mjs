import fs from 'node:fs/promises';
import { chromium } from 'playwright-core';
import ts from 'typescript';

const index = await fs.readFile('src/features/journal/innIndex.ts','utf8');
const compiled = ts.transpileModule(index,{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
const {innOpinions} = await import('data:text/javascript;base64,'+Buffer.from(compiled).toString('base64'));
const directory='public/assets/opini';
await fs.mkdir(directory,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try {
  const pages = await Promise.all([browser.newPage(),browser.newPage()]);
  const queue=[...innOpinions];
  await Promise.all(pages.map(async page=>{
    for(let row=queue.shift();row;row=queue.shift()){
      const dest=directory+'/'+row.slug+'.json';
      const existing=await fs.readFile(dest,'utf8').catch(()=>'');
      if(existing && JSON.parse(existing).slug===row.slug && JSON.parse(existing).blocks?.length)continue;
      const source='https://innindonesia.com/'+row.slug;
      const response=await fetch('https://innindonesia.com/api/method/finto_newsroom.public_api.get_article?slug='+encodeURIComponent(row.slug),{signal:AbortSignal.timeout(30000)});
      if(!response.ok)throw Error(row.slug+' '+response.status);
      const {message:article}=await response.json();
      if(row.slug!==article.slug)throw Error('Unexpected article for '+row.slug);
      const blocks=await page.evaluate(html=>{
        const doc=new DOMParser().parseFromString(html,'text/html');
        doc.querySelectorAll('style,script,iframe,noscript').forEach(el=>el.remove());
        const result=[];let parts=[];
        function flush(type){const text=parts.join('').replace(/\s+/g,' ').trim();if(text)result.push({type,text});parts=[];}
        function walk(node,type='p'){
          if(node.nodeType===3){parts.push(node.textContent);return;}
          const tag=node.nodeName.toLowerCase();
          const boundary=/^(p|div|li|h[1-6]|blockquote|br|tr|section|article)$/.test(tag);
          const role=/^h[1-6]$/.test(tag)?'heading':tag==='li'?'li':tag==='blockquote'?'quote':type;
          if(boundary)flush(type);
          for(const child of node.childNodes)walk(child,role);
          if(boundary)flush(role);
          if(tag==='td')parts.push(' ');
        }
        walk(doc.body);flush('p');return result;
      },article.content);
      if(!blocks.length)throw Error('Empty article '+row.slug);
      await fs.writeFile(dest+'.tmp',JSON.stringify({slug:row.slug,source,blocks}));await fs.rename(dest+'.tmp',dest);
    }
  }));
  console.log('Verified',innOpinions.length,'archive entries.');
}finally {await browser.close();}
