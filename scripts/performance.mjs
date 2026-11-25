import lighthouse from 'lighthouse';
import {launch} from 'chrome-launcher';
import {preview} from 'vite';
import fs from 'node:fs';
const server=await preview({preview:{port:0,host:'127.0.0.1'}});
const base='http://127.0.0.1:'+server.httpServer.address().port;
const chrome=await launch({chromePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',chromeFlags:['--headless','--disable-gpu','--no-first-run']});
try{
 const rows=[];
 for(const route of ['/','/jurnal','/publikasi']){
   const {lhr}=await lighthouse(base+route,{port:chrome.port,logLevel:'error',onlyCategories:['performance','accessibility','best-practices','seo']});
   rows.push({route,settings:lhr.configSettings.formFactor,browser:lhr.environment.hostUserAgent,version:lhr.lighthouseVersion,score:Object.fromEntries(Object.entries(lhr.categories).map(([k,v])=>[k,Math.round(v.score*100)])),lcp:lhr.audits['largest-contentful-paint'].numericValue,cls:lhr.audits['cumulative-layout-shift'].numericValue,tbt:lhr.audits['total-blocking-time'].numericValue,failed:Object.values(lhr.audits).filter(a=>a.score!==null && a.score<.9).map(a=>a.id)});
   fs.writeFileSync('docs/fornak-redesign-v5/bukti/lighthouse.json',JSON.stringify(rows,null,2));
 }
}finally{await chrome.kill();await new Promise(r=>server.httpServer.close(r))}

