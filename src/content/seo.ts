import { innOpinions } from '../features/journal/innIndex';
import { pageMeta } from './pageMeta';
import { publications } from './publications';
import { localArticles } from '../features/journal/localArticles';

export const siteOrigin = (import.meta.env?.VITE_SITE_ORIGIN || 'https://fornakindonesia.org').replace(/\/$/,'');
export const pages = {
  ...pageMeta,
  ...Object.fromEntries(innOpinions.map(a=>['/jurnal/opini/'+a.slug,{title:a.title+' | Opini INN · FORNAK',description:a.title+' — '+a.author}])),
  ...Object.fromEntries(publications.map(p=>['/publikasi/'+p.slug,{title:p.shortTitle+' | FORNAK Indonesia',description:p.summary}])),
  ...Object.fromEntries(localArticles.map(a=>['/jurnal/'+a.slug,{title:a.title+' | Jurnal FORNAK',description:a.summary}])),
};
export function structuredData(path:string){
  const meta=pages[path];
  if(!meta) return [];
  const url=siteOrigin+path;
  const article=localArticles.find(a=>'/jurnal/'+a.slug===path);
  const crumbs=[{name:'Beranda',item:siteOrigin+'/'}];
  if(path.split('/').length>2) {const parent='/'+path.split('/')[1];crumbs.push({name:parent==='/jurnal'?'Jurnal FORNAK':'Publikasi',item:siteOrigin+parent})}
  if(path!=='/')crumbs.push({name:meta.title.split('|')[0].trim(),item:url});
  return [
    {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:crumbs.map((c,i)=>({'@type':'ListItem',position:i+1,...c}))},
    ...(article?[{'@context':'https://schema.org','@type':'Article',headline:article.title,description:article.summary,mainEntityOfPage:url,author:{'@type':article.author.startsWith('Redaksi')?'Organization':'Person',name:article.author},datePublished:article.date}]:[])
  ];
}
