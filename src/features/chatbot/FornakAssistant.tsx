import { ArrowUpRight, BookOpen, ChevronRight, MessageCircle, RefreshCw, Search, Send, X } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { organization } from '../../content/organization';
import { publications } from '../../content/publications';
import { localArticles } from '../journal/localArticles';
import { innOpinions } from '../journal/innIndex';
import { tr } from '../language';
import { sitePath } from '../../content/sitePath';
import './assistant.css';

type Topic = 'mission'|'find'|'books'|'contact'|'start'|'results';
type Resource={title:string;path:string;terms:string};
type Line={role:'assistant'|'user';text:string;items?:Resource[]};
const choices={mission:'Misi FORNAK',find:'Cari tulisan',books:'Publikasi',contact:'Hubungi admin'};
const initial='Shalom. Apa yang ingin Anda temukan di FORNAK?';
const shelf=publications.map(b=>({title:b.shortTitle,path:'/publikasi/'+b.slug,terms:[b.title,b.category,b.summary].join(' ')}));
const catalog=[...shelf,...localArticles.map(a=>({title:a.title,path:'/jurnal/'+a.slug,terms:[a.author,a.category,a.summary].join(' ')})),...innOpinions.map(a=>({title:a.title,path:'/jurnal/opini/'+a.slug,terms:a.author}))];

function search(text:string){
  const words=text.toLowerCase().split(/[\s,?!，。？]+/).filter(Boolean);
  return catalog.map(item=>{
    const title=(item.title+' '+tr(item.title)).toLowerCase();
    const info=item.terms.toLowerCase();
    return {item,score:words.reduce((n,w)=>n+(title.includes(w)?4:info.includes(w)?1:0),0)};
  }).filter(row=>row.score>0).sort((a,b)=>b.score-a.score).slice(0,4).map(row=>row.item);
}
export function FornakAssistant({navigate}:{navigate:(path:string)=>void}){
  const [open,setOpen]=useState(false);
  const [input,setInput]=useState('');
  const [topic,setTopic]=useState<Topic>('start');
  const [lines,setLines]=useState<Line[]>([{role:'assistant',text:initial}]);
  const field=useRef<HTMLInputElement>(null);
  const trigger=useRef<HTMLButtonElement>(null);
  const log=useRef<HTMLDivElement>(null);
  useEffect(()=>{if(open)field.current?.focus();},[open]);
  useEffect(()=>{if(open&&log.current)log.current.scrollTop=log.current.scrollHeight;},[lines,open]);
  function close(){setOpen(false);requestAnimationFrame(()=>trigger.current?.focus());}
  function respond(value:string,choice?:Topic){
    const prompt=value.trim();if(!prompt)return;
    let next=choice??'results';
    if(!choice){
      if(/kontak|contact|admin|whatsapp|联系|聯絡/i.test(prompt))next='contact';
      else if(/misi|mission|使命|about fornak|tentang fornak/i.test(prompt))next='mission';
      else if(/^(publikasi|books?|buku|出版物|出版品|书籍|書籍)$/i.test(prompt))next='books';
      else if(/^(hi|hello|halo|shalom|你好|您好)[!. ]*$/i.test(prompt))next='start';
    }
    const response:Line={role:'assistant',text:initial};
    if(next==='mission')response.text='FORNAK Indonesia menyatukan, menyuarakan, dan menggerakkan WNI Kristen untuk terlibat aktif dalam pembangunan bangsa berdasarkan Pancasila, UUD 1945, dan Bhinneka Tunggal Ika.';
    if(next==='find')response.text='Tulis judul, nama penulis, atau topik yang ingin Anda baca.';
    if(next==='books'){response.text='Pilih buku untuk membuka pembacanya.';response.items=shelf;}
    if(next==='contact'){response.text='Hubungi sekretariat untuk kegiatan, kemitraan, atau keanggotaan.';response.items=[{title:'WhatsApp +62 896-7333-5886',path:organization.adminWhatsApp,terms:''},{title:'Instagram @fornak.id',path:organization.instagram,terms:''}];}
    if(next==='results'){response.items=search(prompt);response.text=response.items.length?'Bacaan yang sesuai':'Belum ada hasil. Coba nama penulis atau satu kata dari judul.';}
    setLines(old=>[...old,{role:'user',text:prompt},response]);setTopic(next);setInput('');
  }
  function submit(e:FormEvent){e.preventDefault();respond(input);}
  return <div className={'fornak-assistant '+(open?'is-open':'')}>
    {open&&<section className="assistant-panel chat-window" role="dialog" aria-label={tr('Asisten FORNAK')} onKeyDown={e=>{if(e.key==='Escape')close();}}>
      <header><div className="chat-heading"><span className="chat-emblem"><MessageCircle size={20}/></span><div><strong>{tr('Asisten FORNAK')}</strong><small>{tr('Panduan bacaan dan organisasi')}</small></div></div>
        <button onClick={close} aria-label={tr('Tutup asisten')}><X size={18}/></button></header>
      <div className="assistant-messages" role="log" aria-live="polite" aria-label={tr('Percakapan asisten')} ref={log} tabIndex={0}>
        {lines.map((line,index)=><div key={index} className={'chat-turn '+line.role}><p>{tr(line.text)}</p>{line.items?.map(item=>{
          const local=item.path.startsWith('/');
          return <a key={item.path} href={local?sitePath(item.path):item.path} target={local?undefined:'_blank'} rel={local?undefined:'noreferrer'} onClick={e=>{if(local&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey){e.preventDefault();close();navigate(item.path);}}}>{local?<BookOpen size={15}/>:<ArrowUpRight size={15}/>}<span>{tr(item.title)}</span><ChevronRight size={14}/></a>;
        })}</div>)}
      </div>
      <div className="assistant-quick">{(Object.keys(choices) as (keyof typeof choices)[]).filter(k=>k!==topic).map(k=><button key={k} type="button" onClick={()=>respond(choices[k],k)}>{k==='find'&&<Search size={13}/>} {tr(choices[k])}</button>)}</div>
      <form onSubmit={submit}><input ref={field} value={input} onChange={e=>setInput(e.target.value)} autoComplete="off" maxLength={320} aria-label={tr('Tulis pertanyaan')} placeholder={tr('Tulis pertanyaan…')}/><button type="submit" aria-label={tr('Kirim')} disabled={!input.trim()}><Send size={18}/></button></form>
      {lines.length>1&&<button className="chat-reset" onClick={()=>{setLines([{role:'assistant',text:initial}]);setTopic('start');setInput('');field.current?.focus();}}><RefreshCw size={12}/>{tr('Mulai ulang')}</button>}
    </section>}
    <button type="button" className="assistant-toggle" ref={trigger} aria-expanded={open} aria-label={tr(open?'Tutup Asisten FORNAK':'Buka Asisten FORNAK')} onClick={()=>setOpen(!open)}><MessageCircle size={18}/><span>{tr('Tanya FORNAK')}</span></button>
  </div>;
}
