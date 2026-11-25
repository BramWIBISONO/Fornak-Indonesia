import { useState, type FormEvent } from 'react';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { organization } from '../../content/organization';
import { tr } from '../language';

const topics=['Dialog kebangsaan','Kajian dan tulisan','Kerja sama lembaga'];
export function JoinForum(){
  const [topic,setTopic]=useState(topics[0]);
  const submit=(e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    const form=new FormData(e.currentTarget);
    const message=[tr('Shalom, saya ingin terhubung dengan FORNAK.'),tr('Nama')+': '+String(form.get('name')).trim(),tr('Minat')+': '+tr(topic),String(form.get('message')||'').trim()].filter(Boolean).join('\n');
    window.open(organization.adminWhatsApp+'?text='+encodeURIComponent(message),'_blank','noopener,noreferrer');
  };
  return <section className="join-forum" id="bergabung"><div className="join-inner"><div className="join-invite"><p className="folio-label">{tr('Terhubung dengan FORNAK')}</p><h2>{tr('Apa yang ingin Anda kerjakan untuk Indonesia?')}</h2><p>{tr('Bawa pertanyaan, gagasan, atau pengalaman komunitas Anda. Mulai percakapan dengan tim FORNAK tentang langkah yang bisa dikerjakan bersama.')}</p><a href={organization.instagram} target="_blank" rel="noreferrer">@fornak.id <ArrowUpRight size={16}/></a></div>
    <form onSubmit={submit}><h3>{tr('Mulai percakapan')}</h3><label>{tr('Nama Anda')}<input required name="name" autoComplete="name" maxLength={100} pattern={'.*\\S.*'}/></label>
      <label>{tr('Saya tertarik pada')}<select value={topic} onChange={e=>setTopic(e.target.value)}>{topics.map(v=><option key={v} value={v}>{tr(v)}</option>)}</select></label>
      <label>{tr('Apa yang ingin Anda sampaikan?')}<textarea name="message" rows={2} maxLength={800}/></label><button className="folio-button" type="submit"><MessageCircle size={18}/>{tr('Lanjutkan ke WhatsApp')}</button><small>{tr('Pesan terbuka sebagai draf. Anda dapat memeriksa dan mengirimnya ke admin FORNAK.')}</small></form></div></section>;
}
