import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

import { pages, siteOrigin, structuredData } from './src/content/seo';
const escape = (s:string) => s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
export default defineConfig({
  plugins: [react(),{
    name:'fornak-page-metadata', enforce:'post',
    generateBundle(_,bundle){
      const html=bundle['index.html'];
      if(!html || html.type!=='asset')return;
      const template=String(html.source);
      for(const [path,meta] of Object.entries(pages)){
        const url=siteOrigin+path;
        const preload = path === '/' ? '<link rel="preload" as="image" href="/assets/images/arsip-perjumpaan.webp" fetchpriority="high">' : '';
        const source=template.replace('<head>', '<head>'+preload).replace(/<title>.*?<\/title>/,'<title>'+escape(meta.title)+'</title>')
          .replace(/(<meta\s+name="description"\s+content=")[^"]*/, '$1'+escape(meta.description))
          .replace(/(<meta\s+property="og:title"\s+content=")[^"]*/, '$1'+escape(meta.title))
          .replace(/(<meta\s+property="og:description"\s+content=")[^"]*/, '$1'+escape(meta.description))
          .replace('content="website"',path.startsWith('/jurnal/')?'content="article"':'content="website"')
          .replace('</head>','<link rel="canonical" href="'+url+'"><meta property="og:url" content="'+url+'"><script id="page-schema" type="application/ld+json">'+JSON.stringify(structuredData(path)).replaceAll('<','\\u003c')+'</script></head>');
        if(path==='/')html.source=source;else this.emitFile({type:'asset',fileName:path.slice(1)+'/index.html',source});
      }
      this.emitFile({type:'asset',fileName:'sitemap.xml',source:'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+Object.keys(pages).map(p=>'<url><loc>'+siteOrigin+p+'</loc></url>').join('')+'</urlset>'});
      this.emitFile({type:'asset',fileName:'robots.txt',source:'User-agent: *\nAllow: /\nSitemap: '+siteOrigin+'/sitemap.xml\n'});
    }
  }],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  },
});
