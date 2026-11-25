import { tr } from '../language';
import { useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { localArticles } from '../journal/localArticles';
import { innOpinions } from '../journal/innIndex';
import { publications } from '../../content/publications';

type Entry = { title:string; path:string; group:string; terms:string };
const index: Entry[] = [
  ...[['Beranda','/'],['Tentang FORNAK','/tentang'],['Jurnal FORNAK','/jurnal'],['Pemikiran dan kajian','/pemikiran'],['Perpustakaan digital','/publikasi'],['Dokumentasi','/kegiatan'],['Galeri','/galeri'],['Kontak sekretariat','/kontak']].map(([title,path])=>({title,path,group:'Halaman',terms:''})),
  ...localArticles.map(a=>({title:a.title,path:'/jurnal/'+a.slug,group:'Jurnal FORNAK',terms:[a.category,a.author,a.summary].join(' ')})),
  ...publications.map(p=>({title:p.title,path:'/publikasi/'+p.slug,group:'Publikasi',terms:[p.category,p.author,p.summary].join(' ')})),
  ...innOpinions.map(a=>({title:a.title,path:'/jurnal/opini/'+a.slug,group:'Opini INN Indonesia',terms:a.author})),
];

export function SiteSearch({navigate}:{navigate:(path:string)=>void}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState('');
  const [limit,setLimit] = useState(12);
  const term = query.trim().toLocaleLowerCase('id');
  const results = term ? index.filter(i=>[i.title,tr(i.title),i.terms,i.group,tr(i.group)].join(' ').toLocaleLowerCase('id').includes(term)) : index.slice(0,8);
  return <>
    <button type="button" className="site-search-trigger" aria-label={tr("Cari di situs")} onClick={()=>{setQuery('');setLimit(12);dialog.current?.showModal()}}><Search size={20}/></button>
    <dialog ref={dialog} className="site-search-dialog" aria-labelledby="search-title" onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close()}}>
      <div><header><h2 id="search-title">{tr("Cari di FORNAK")}</h2><button type="button" aria-label={tr("Tutup pencarian")} onClick={()=>dialog.current?.close()}><X/></button></header>
      <input autoFocus aria-label={tr("Cari halaman, topik, atau penulis")} type="search" placeholder={tr("Cari halaman, topik, atau penulis")} value={query} onChange={e=>{setQuery(e.target.value);setLimit(12)}}/>
      <p role="status">{term ? results.length+' '+tr('hasil pencarian') : tr('Jelajahi halaman')}</p>
      <ul>{results.slice(0,limit).map(i=><li key={i.path}><a href={i.path} onClick={e=>{
        if(i.path.startsWith('/') && !e.metaKey && !e.ctrlKey && !e.shiftKey) {e.preventDefault();dialog.current?.close();navigate(i.path)}
      }}><strong>{tr(i.title)}</strong><small>{tr(i.group)}</small></a></li>)}</ul>
      {results.length>limit && <button onClick={()=>setLimit(limit+12)}>{tr("Tampilkan lainnya")}</button>}</div>
    </dialog>
  </>;
}
