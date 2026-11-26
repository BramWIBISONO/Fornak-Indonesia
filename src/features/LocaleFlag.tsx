import { useId } from 'react';
export function LocaleFlag({ code }: { code: string }) {
  const clip = useId();
  const star = '0,-1 .224,-.31 .951,-.309 .363,.118 .588,.809 0,.382 -.588,.809 -.363,.118 -.951,-.309 -.224,-.31';
  return <svg className="locale-flag" viewBox="0 0 30 20" aria-hidden="true" focusable="false">
    {code==='id' ? <><path fill="#fff" d="M0 0h30v20H0z"/><path fill="#d71d32" d="M0 0h30v10H0z"/></> :
     code==='en' ? <><defs><clipPath id={clip}><path d="M0 0h30v20H0z"/></clipPath></defs><g clipPath={'url(#'+clip+')'}><path fill="#193565" d="M0 0h30v20H0z"/><path stroke="#fff" strokeWidth="4" d="m0 0 30 20m0-20L0 20"/><path stroke="#c42840" strokeWidth="1.5" d="M-1 .5 14 10m2 0L31 20M29 0 16 9M0 20l13-9"/><path stroke="white" strokeWidth="7" d="M15 0v20M0 10h30"/><path stroke="#c42840" strokeWidth="4" d="M15 0v20M0 10h30"/></g></> :
     code==='zh-CN' ? <><path fill="#db262d" d="M0 0h30v20H0z"/>{[[5,5,3,0],[10,2,1,25],[12,4,1,35],[12,7,1,0],[10,9,1,15]].map(([x,y,size,angle])=><polygon key={x+'-'+y} points={star} fill="#ffde41" transform={'translate('+x+' '+y+') rotate('+angle+') scale('+size+')'}/>)}</> :
     <><path fill="#e31c28" d="M0 0h30v20H0z"/><path fill="#19357b" d="M0 0h15v10H0z"/><g transform="translate(7.5 5)" fill="#fff">{Array.from({length:12},(_,i)=><path key={i} d="M0 -3.7 .65 -1.9h-1.3Z" transform={'rotate('+i*30+')'}/ >)}<circle r="1.83"/></g></>}
  </svg>;
}
