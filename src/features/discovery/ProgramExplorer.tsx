import { tr } from '../language';
import { useId, useState, type KeyboardEvent } from 'react';
import { ArrowLeft, ArrowRight, MessagesSquare, Landmark, BookOpen, Network, Flag, UsersRound } from 'lucide-react';
import { organization } from '../../content/organization';

const programs = [
  {name:'Ruang kebangsaan',icon:UsersRound}, {name:'Dialog lintas iman',icon:MessagesSquare},
  {name:'Kepemimpinan',icon:Landmark}, {name:'Kajian bangsa',icon:BookOpen},
  {name:'Jejaring kelembagaan',icon:Network}, {name:'Pancasila',icon:Flag},
];
export function ProgramExplorer() {
  const [active,setActive] = useState(0);
  const id = useId();
  const select = (index:number) => setActive((index+programs.length)%programs.length);
  const onKeyDown = (event:KeyboardEvent<HTMLButtonElement>,index:number) => {
    const keys:Record<string,number>={ArrowRight:index+1,ArrowDown:index+1,ArrowLeft:index-1,ArrowUp:index-1,Home:0,End:programs.length-1};
    if(!(event.key in keys)) return;
    event.preventDefault();
    const next=(keys[event.key]+programs.length)%programs.length;
    select(next);
    document.getElementById(id+'-tab-'+next)?.focus();
  };
  const Icon=programs[active].icon;
  return <div className="work-explorer">
    <div className="work-index" role="tablist" aria-label={tr("Pilih program")}>{programs.map((item,i)=><button type="button" role="tab" id={id+'-tab-'+i} key={item.name} aria-selected={active===i} aria-controls={id+'-panel'} tabIndex={active===i?0:-1} onKeyDown={e=>onKeyDown(e,i)} onClick={()=>select(i)}><span>0{i+1}</span>{tr(item.name)}<ArrowRight size={16}/></button>)}</div>
    <div className="work-feature" id={id+'-panel'} role="tabpanel" tabIndex={0} aria-labelledby={id+'-tab-'+active}>
      <div className="work-symbol" aria-hidden="true"><Icon strokeWidth={0.85}/></div>
      <div key={active} aria-live="polite"><small>{tr("Program FORNAK · 0")}{active+1} / 06</small><h3>{tr(programs[active].name)}</h3><p>{tr(organization.programs[active])}</p></div>
      <div className="work-controls"><button aria-label={tr("Program sebelumnya")} onClick={()=>select(active-1)}><ArrowLeft/></button><button aria-label={tr("Program berikutnya")} onClick={()=>select(active+1)}><ArrowRight/></button></div>
    </div>
  </div>;
}
