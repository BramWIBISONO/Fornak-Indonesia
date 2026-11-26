import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Download, Maximize, Search } from 'lucide-react';
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from 'pdfjs-dist/legacy/build/pdf.mjs';
import worker from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url';
import { tr } from './language';

GlobalWorkerOptions.workerSrc = worker;

function Leaf({doc, number, zoom, title, ready, fail}:{
  doc:PDFDocumentProxy; number:number; zoom:number; title:string; ready:()=>void; fail:()=>void
}) {
  const ref=useRef<HTMLCanvasElement>(null);
  const events=useRef({ready,fail});
  events.current={ready,fail};
  useEffect(()=>{
    let active=true;
    if (ref.current) delete ref.current.dataset.ready;
    let task:ReturnType<Awaited<ReturnType<PDFDocumentProxy['getPage']>>['render']>|undefined;
    void doc.getPage(number).then(async pdf=>{
      const canvas=ref.current;
      if(!active || !canvas)return;
      const viewport=pdf.getViewport({scale:1.7*zoom});
      canvas.width=Math.ceil(viewport.width);
      canvas.height=Math.ceil(viewport.height);
      task=pdf.render({canvas,viewport});
      await task.promise;
      if(active){canvas.dataset.ready='true';events.current.ready();}
    }).catch(()=>{if(active)events.current.fail();});
    return ()=>{active=false;task?.cancel();};
  },[doc,number,zoom]);
  return <canvas ref={ref} data-folio={number} role="img" aria-label={title+' · '+number}/>;
}

type Turn={from:HTMLCanvasElement; stationary?:HTMLCanvasElement; direction:number; double:boolean};
function TurningLeaf({turn,back,finish}:{turn:Turn;back:HTMLCanvasElement|null;finish:()=>void}){
  const rect=useRef<HTMLDivElement>(null);
  const front=useRef<HTMLCanvasElement>(null);
  const reverse=useRef<HTMLCanvasElement>(null);
  const stationary=useRef<HTMLCanvasElement>(null);
  useLayoutEffect(()=>{
    for(const [target,src] of [[front.current,turn.from],[reverse.current,back],[stationary.current,turn.stationary]] as const){
      if(!target||!src)continue;
      target.width=src.width;target.height=src.height;
      target.getContext('2d')?.drawImage(src,0,0);
    }
    if(!back || !rect.current)return;
    const anim=rect.current.animate([{transform:'rotateY(0deg)'},{transform:'rotateY('+(-turn.direction*179.7)+'deg)'}],{duration:520,easing:'cubic-bezier(.33,.02,.22,1)',fill:'forwards'});
    anim.onfinish=finish;
    return ()=>{anim.onfinish=null;anim.cancel();};
  },[turn,back]); 
  return <>{turn.stationary && <canvas aria-hidden="true" ref={stationary} className={'resting-leaf '+(turn.direction>0?'left':'right')}/>}
    <div aria-hidden="true" ref={rect} className={'turning-leaf '+(turn.double?'half ':'')+(turn.direction>0?'forward':'backward')}><canvas ref={front}/><canvas className="reverse-leaf" ref={reverse}/></div></>;
}

export default function PdfReader({url,title}:{url:string;title:string}){
  const [doc,setDoc]=useState<PDFDocumentProxy|null>(null);
  const [texts,setTexts]=useState<string[]>([]);
  const [page,setPage]=useState(1);
  const [spread,setSpread]=useState(()=>matchMedia('(min-width:760px)').matches);
  const [zoom,setZoom]=useState(1);
  const [query,setQuery]=useState('');
  const [error,setError]=useState(false);
  const [attempt,setAttempt]=useState(0);
  const [turn,setTurn]=useState<Turn|null>(null);
  const [back,setBack]=useState<HTMLCanvasElement|null>(null);
  const view=useRef<HTMLDivElement>(null);
  const leaves=useRef<HTMLDivElement>(null);
  const touch=useRef<{x:number;y:number}|null>(null);
  const suppressClick=useRef(false);
  const [ready,setReady]=useState(false);
  useEffect(()=>{
    const media=matchMedia('(min-width:760px)');
    const fit=()=>{setSpread(media.matches);setPage(n=>media.matches && n>1 ? n-n%2 : n);setTurn(null);setBack(null);};
    media.addEventListener('change',fit);
    return ()=>media.removeEventListener('change',fit);
  },[]);
  useEffect(()=>{
    let active=true;
    setError(false);setDoc(null);setTexts([]);setReady(false);setTurn(null);
    const request=getDocument(url);
    void request.promise.then(async pdf=>{
      if(!active)return;
      setDoc(pdf);
      const content=await Promise.all(Array.from({length:pdf.numPages},async(_,i)=>{
        const p=await pdf.getPage(i+1);
        return (await p.getTextContent()).items.map(item=>'str' in item?item.str:'').join(' ');
      }));
      if(active)setTexts(content);
    }).catch(()=>{if(active)setError(true)});
    return ()=>{active=false;void request.destroy();};
  },[url,attempt]);
  const last=doc?.numPages??1;
  const two=spread && page>1 && page<last;
  const visible=two?[page,page+1]:[page];
  const hasNext=visible[visible.length-1]<last;
  function go(next:number,animated=true){
    if(!doc||turn||(animated&&!ready))return;
    const target=spread&&next>1?next-(next%2):next;
    if(target===page||next<1||next>last)return;
    const forward=target>page;
    const canvas=leaves.current?.querySelector<HTMLCanvasElement>(forward?'canvas:last-child':'canvas:first-child');
    if(animated && canvas?.dataset.ready && zoom===1 && !matchMedia('(prefers-reduced-motion:reduce)').matches){
      const stationary=two?leaves.current?.querySelector<HTMLCanvasElement>(forward?'canvas:first-child':'canvas:last-child'):undefined;
      // Folios have stable keys. React detaches the old canvases without overwriting their pixels.
      setBack(null);setTurn({from:canvas,stationary:stationary??undefined,direction:forward?1:-1,double:spread});
    }
    setReady(false);setPage(target);
  }
  const step=(direction:number)=>go(direction>0?page+visible.length:Math.max(1,page-(spread?2:1)));
  function onReady(){
    const rendered=Array.from(leaves.current?.querySelectorAll<HTMLCanvasElement>('canvas')??[]);
    if(!rendered.length||!rendered.every(c=>c.dataset.ready))return;
    setReady(true);
    if(turn)setBack(rendered[turn.direction>0?0:rendered.length-1]);
  }
  const term=query.trim().toLowerCase();
  const hits=term?texts.flatMap((s,i)=>s.toLowerCase().includes(term)?[i+1]:[]):[];
  return <div ref={view} className="pdf-reader flip-reader">
    <div className="pdf-toolbar"><div className="book-navigation">
      <button disabled={!ready||!!turn||page===1} aria-label={tr('Halaman sebelumnya')} onClick={()=>step(-1)}><ChevronLeft/></button>
      <span aria-live="polite">{tr('Hal.')} {page}{two?'–'+(page+1):''} / {doc?.numPages??'…'}</span>
      <button disabled={!ready||!!turn||!hasNext} aria-label={tr('Halaman berikutnya')} onClick={()=>step(1)}><ChevronRight/></button>
    </div><div className="book-tools"><button aria-pressed={spread} disabled={!!turn} onClick={()=>{setSpread(!spread);setPage(spread||page===1?page:page-page%2);}}><BookOpen size={16}/>{tr('Dua halaman')}</button>
      <select aria-label={tr('Perbesaran')} value={zoom} disabled={!!turn} onChange={e=>setZoom(Number(e.target.value))}>{[.75,1,1.25,1.5,2].map(v=><option key={v} value={v}>{v*100}%</option>)}</select>
      {document.fullscreenEnabled&&<button aria-label={tr('Layar penuh')} onClick={()=>{if(document.fullscreenElement)void document.exitFullscreen();else void view.current?.requestFullscreen().catch(()=>undefined);}}><Maximize size={16}/></button>}
      <a href={url} download aria-label={tr('Unduh PDF')}><Download size={16}/></a></div>
      <label className="book-search"><Search size={16}/><input type="search" aria-label={tr('Cari dalam PDF')} placeholder={tr('Cari dalam PDF')} value={query} onChange={e=>setQuery(e.target.value)}/></label>
    </div>
    {term&&<div className="pdf-results" role="status">{tr(!texts.length?'Memuat teks…':hits.length?'Ditemukan pada halaman':'Tidak ditemukan.')} {hits.map(n=><button key={n} onClick={()=>go(n,false)}>{n}</button>)}</div>}
    {error?<p role="alert">{tr('Dokumen belum dapat ditampilkan.')} <button onClick={()=>setAttempt(i=>i+1)}>{tr('Coba lagi')}</button> <a href={url}>{tr('Buka PDF asli')}</a></p>:!doc?<p role="status">{tr('Memuat dokumen…')}</p>:
    <div className="pdf-sheet book-desk" tabIndex={0} role="region" aria-label={tr('Halaman dokumen')}
      onKeyDown={e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();step(e.key==='ArrowRight'?1:-1);}}}
      onPointerDown={e=>{suppressClick.current=false;touch.current={x:e.clientX,y:e.clientY};}}
      onPointerCancel={()=>{touch.current=null;}}
      onPointerUp={e=>{const start=touch.current;touch.current=null;if(!start||zoom>1)return;const dx=e.clientX-start.x;if(Math.abs(dx)>48&&Math.abs(dx)>Math.abs(e.clientY-start.y)*1.4){suppressClick.current=true;step(dx<0?1:-1);}}}>
      <div className={'book-stage '+(spread?'spread':'single')+(spread&&!two?(page===1?' at-front':' at-end'):'')+(turn?.double?(turn.direction>0?' turning-forward':' turning-backward'):'')} style={{'--book-zoom':zoom} as React.CSSProperties}>
        <div ref={leaves} className={'pdf-leaves '+(two?'pair':spread?(page===1?'front-cover':'end-cover'):'solo')} onClick={e=>{
          if(suppressClick.current||zoom>1)return;
          const bounds=e.currentTarget.getBoundingClientRect();
          step(page===1?1:(e.clientX-bounds.left)<bounds.width/2?-1:1);
        }}>{visible.map(n=><Leaf key={n} doc={doc} number={n} title={title} zoom={zoom} ready={onReady} fail={()=>{setTurn(null);setError(true);}}/>)}</div>
        {turn&&<TurningLeaf turn={turn} back={back} finish={()=>{setTurn(null);setBack(null);}}/>}
      </div>
    </div>}
    {texts[page-1]&&<details><summary>{tr('Baca teks halaman')} {visible.join('–')}</summary>{visible.map(n=><p key={n}>{texts[n-1]}</p>)}</details>}
  </div>;
}
