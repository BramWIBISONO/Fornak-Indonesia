import { tr } from '../language';
import { useId, useState } from 'react';
import { Eye, UsersRound, Megaphone, Flag } from 'lucide-react';
import { organization } from '../../content/organization';

export function MissionExplorer() {
  const [active, setActive] = useState<number | null>(0);
  const icons=[Eye, UsersRound, Megaphone, Flag];
  const id = useId();
  const entries = [{title:'Visi FORNAK', text:organization.vision+'.'}, ...organization.missions.map(m=>({title:m.title, text:m.title+' '+m.text+'.'}))];
  return <section className="mission-folio" aria-labelledby={id+'-title'}>
    <div className="folio-inner"><header><p className="folio-label">{tr("Visi & misi")}</p><h2 id={id+'-title'}>{tr("Arah gerakan")}<br/><em>FORNAK.</em></h2></header>
    <div className="mission-folds">{entries.map((entry,i)=>{const Icon=icons[i];return <section onPointerEnter={e=>{if(e.pointerType==="mouse")setActive(i)}} key={entry.title} className={active===i?'is-open':''}>
      <h3><button type="button" aria-expanded={active===i} aria-controls={id+i} onFocus={()=>setActive(i)} onClick={()=>setActive(i)}><span className="fold-mark">{i===0?'V':organization.missions[i-1].number}</span>{tr(entry.title)}<Icon aria-hidden="true"/></button></h3>
      <div id={id+i} hidden={active!==i}><p>{tr(entry.text)}</p></div>
    </section>})}</div></div>
  </section>;
}
