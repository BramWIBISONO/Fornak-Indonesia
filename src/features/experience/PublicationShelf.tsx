import { tr } from '../language';
import { useState, type MouseEvent } from 'react';
import { ArrowRight, Download } from 'lucide-react';
import { publications } from '../../content/publications';

export function PublicationShelf({navigate}:{navigate:(to:string)=>void}) {
  const [index,setIndex]=useState(0);
  const book=publications[index];
  function follow(e:MouseEvent<HTMLAnchorElement>) {
    if(e.button || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey)return;
    e.preventDefault();navigate(e.currentTarget.pathname);
  }
  return <section className="book-exhibition"><div className="shelf-inner">
    <header><p className="folio-label">{tr("Perpustakaan digital")}</p><h2>{tr("Publikasi")} <em>FORNAK.</em></h2><a href="/publikasi" onClick={follow}>{tr("Semua publikasi")} <ArrowRight size={17}/></a></header>
    <div className="book-display"><div className="book-object"><a href={'/publikasi/'+book.slug} onClick={follow} aria-label={'Baca '+book.title}><img width={480} height={book.coverHeightAt480} key={book.slug} src={book.cover} srcSet={book.coverSrcSet} sizes="(max-width: 760px) 48vw, 288px" loading="lazy" alt={'Sampul '+book.shortTitle}/></a></div>
    <div className="book-description" aria-live="polite"><p className="folio-label">{tr(book.category)} · {book.pages} {tr("halaman")}</p><h3>{book.title}</h3>{book.author && <strong>{book.author}</strong>}<p>{tr(book.highlights[0])}</p>
      <div className="book-actions"><a className="folio-button" href={'/publikasi/'+book.slug} onClick={follow}>{tr("Baca publikasi")} <ArrowRight size={17}/></a><a href={book.pdf} download><Download size={16}/> {tr("Unduh PDF")}</a></div>
    </div></div>
    <div className="book-picker" aria-label={tr("Pilih publikasi")}>{publications.map((b,i)=><button key={b.slug} aria-pressed={i===index} onClick={()=>setIndex(i)}><span>0{i+1}</span>{b.shortTitle}</button>)}</div>
  </div></section>;
}
