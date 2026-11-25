import { tr } from './language';
import { useEffect, useRef, useState } from 'react';
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy, type RenderTask } from 'pdfjs-dist/legacy/build/pdf.mjs';
import worker from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url';

GlobalWorkerOptions.workerSrc = worker;

export default function PdfReader({ url, title }: { url: string; title: string }) {
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [texts, setTexts] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const [attempt,setAttempt]=useState(0);
  const [spread,setSpread]=useState(false);
  const canvases=useRef<(HTMLCanvasElement|null)[]>([]);
  const viewer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let active = true;
    setError(false);setDoc(null);setTexts([]);
    const task = getDocument(url);
    task.promise.then(async pdf => {
      if (!active) return;
      setDoc(pdf);
      const pages = await Promise.all(Array.from({ length: pdf.numPages }, async (_, i) => {
        const p = await pdf.getPage(i + 1);
        const content = await p.getTextContent();
        return content.items.map(item => 'str' in item ? item.str : '').join(' ');
      }));
      if (active) setTexts(pages);
    }).catch(reason => { if (active) { console.error('PDF FORNAK', reason); setError(true); } });
    return () => { active = false; void task.destroy(); };
  }, [url,attempt]);
  useEffect(() => {
    if (!doc) return;
    let active = true;
    const tasks:RenderTask[]=[];
    const numbers=spread && page<doc.numPages ? [page,page+1] : [page];
    numbers.forEach((n,index)=>{
      void doc.getPage(n).then(async pdfPage=>{
        const canvas=canvases.current[index];
        if(!active || !canvas)return;
        const viewport=pdfPage.getViewport({scale:1.65*zoom});
        canvas.width=Math.ceil(viewport.width);
        canvas.height=Math.ceil(viewport.height);
        const task=pdfPage.render({canvas,viewport});
        tasks.push(task);
        await task.promise;
      }).catch(()=>{if(active)setError(true)});
    });
    return ()=>{active=false;tasks.forEach(task=>task.cancel())};
  },[doc,page,zoom,spread]);
  const term = query.trim().toLocaleLowerCase('id');
  const found = term ? texts.flatMap((t, i) => t.toLocaleLowerCase('id').includes(term) ? [i + 1] : []) : [];
  return <div className="pdf-reader" ref={viewer}>
    <div className="pdf-toolbar">
      <button disabled={!doc || page === 1} onClick={() => setPage(Math.max(1,page-(spread?2:1)))} aria-label={tr("Halaman sebelumnya")}>←</button>
      <span aria-live="polite">{tr("Hal.")} {page} / {doc?.numPages ?? '…'}</span>
      <button disabled={!doc || page+(spread?1:0) >= doc.numPages} onClick={() => setPage(page+(spread?2:1))} aria-label={tr("Halaman berikutnya")}>→</button>
      <button aria-pressed={spread} onClick={()=>setSpread(!spread)}>{tr("Dua halaman")}</button>
      <select aria-label={tr("Perbesaran")} value={zoom} onChange={e => setZoom(Number(e.target.value))}>{[0.75,1,1.25,1.5,2].map(v => <option key={v} value={v}>{v*100}%</option>)}</select>
      {document.fullscreenEnabled && <button onClick={() => { if (document.fullscreenElement) void document.exitFullscreen(); else void viewer.current?.requestFullscreen(); }}>{tr("Layar penuh")}</button>}
      <a href={url} download>{tr("Unduh PDF")}</a>
      <input type="search" aria-label={tr("Cari dalam PDF")} placeholder={tr("Cari dalam PDF")} value={query} onChange={e => setQuery(e.target.value)} />
    </div>
    {term && <div className="pdf-results" role="status">{!texts.length ? tr('Memuat teks…') : !found.length ? tr('Tidak ditemukan.') : tr('Ditemukan pada halaman')+' '}{found.map(n => <button key={n} onClick={() => setPage(n)}>{n}</button>)}</div>}
    {error ? <p role="alert">{tr("Dokumen belum dapat ditampilkan.")} <button onClick={()=>setAttempt(n=>n+1)}>{tr("Coba lagi")}</button> <a href={url}>{tr("Buka PDF asli")}</a></p> :
      <div className="pdf-sheet" role="region" tabIndex={0} aria-label={tr("Halaman dokumen")}><div className="pdf-leaves" style={{width:(zoom*100)+'%'}}>{(spread && doc && page<doc.numPages?[page,page+1]:[page]).map((n,i)=><canvas key={i} ref={el=>{canvases.current[i]=el}} role="img" aria-label={title+', halaman '+n}/>)}</div></div>}
    {!doc && !error && <p role="status">{tr("Memuat dokumen…")}</p>}
    {texts.length>0 && texts.every(t=>!t.trim()) && <p>{tr("Halaman dokumen ini berupa gambar. Teks tidak tersedia untuk pencarian.")}</p>}
    {texts[page-1] && <details><summary>{tr("Baca teks halaman")} {page}</summary><p>{texts[page-1]}</p></details>}
  </div>;
}
