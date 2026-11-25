import { tr } from '../language';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { innOpinions } from './innIndex';

type Body = {slug:string; blocks:{type:'p'|'heading'|'li'|'quote';text:string}[]};
export function InnReader({slug,navigate}:{slug:string;navigate:(path:string)=>void}) {
  const article=innOpinions.find(a=>a.slug===slug);
  const [body,setBody]=useState<Body|null>(null);
  const [failed,setFailed]=useState(false);
  const [attempt,retry]=useState(0);
  const heading=useRef<HTMLHeadingElement>(null);
  useEffect(()=>{
    if(!article)return;
    const controller=new AbortController();
    setBody(null);setFailed(false);
    fetch('/assets/opini/'+article.slug+'.json',{signal:controller.signal}).then(async response=>{
      if(!response.ok)throw Error('Unavailable');
      const data:Body=await response.json();
      if(data.slug!==article.slug||!data.blocks?.length)throw Error('Invalid article');
      if(!controller.signal.aborted)setBody(data);
    }).catch(()=>{if(!controller.signal.aborted)setFailed(true)});
    return ()=>controller.abort();
  },[article,attempt]);
  if(!article)return null;
  return <article className="inn-reader"><header><a href="/jurnal#indeks-opini" onClick={e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();navigate('/jurnal');requestAnimationFrame(()=>document.getElementById('indeks-opini')?.scrollIntoView());}}><ArrowLeft size={16}/> {tr("Arsip opini")}</a>
    <p className="folio-label">{tr("Opini · INN Indonesia")}</p><h1 lang="id" ref={heading}>{article.title}</h1><p>{article.author} · <time dateTime={article.date}>{new Intl.DateTimeFormat(document.documentElement.lang,{dateStyle:'long'}).format(new Date(article.date+'T12:00:00'))}</time> · {article.minutes} {tr("menit baca")}</p></header>
    {failed?<p role="alert">{tr("Naskah belum termuat.")} <button onClick={()=>retry(x=>x+1)}>{tr("Coba lagi")}</button></p>:!body?<p role="status">{tr("Memuat naskah…")}</p>:<div className="inn-prose" lang="id">{body.blocks.map((block,i)=>block.type==='heading'?<h2 key={i}>{block.text}</h2>:block.type==='quote'?<blockquote key={i}>{block.text}</blockquote>:<p key={i}>{block.type==='li'?'• ':''}{block.text}</p>)}</div>}
    <footer><p>{tr("Diterbitkan pertama kali oleh INN Indonesia. Ditampilkan di FORNAK dengan izin terbit ulang.")}</p><a href={'https://innindonesia.com/'+article.slug} target="_blank" rel="noreferrer">{tr("Lihat sumber asli")} <ExternalLink size={14}/></a></footer>
  </article>;
}
