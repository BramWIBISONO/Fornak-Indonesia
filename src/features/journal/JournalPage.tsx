import { sitePath } from '../../content/sitePath';
import { ArrowUpRight, Clock3 } from 'lucide-react';
import { tr, useLocale } from '../language';
import { useEffect, useRef, useMemo, useState, type MouseEvent } from 'react';
import { innOpinions, innOpinionSource } from './innIndex';
import { getLocalArticle, localArticles } from './localArticles';
import type { LocalArticle } from './types';
import { EditorialCover } from './EditorialCover';
import './journal.css';

type Navigate = (path: string) => void;

const formatDate = (value?: string) => {
  if (!value) return 'Naskah FORNAK';
  return new Intl.DateTimeFormat(document.documentElement.lang, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`));
};

function InternalLink({
  to,
  navigate,
  children,
  className = '',
}: {
  to: string;
  navigate: Navigate;
  children: React.ReactNode;
  className?: string;
}) {
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(to);
  };
  return <a href={sitePath(to)} onClick={onClick} className={className}>{children}</a>;
}

export function JournalPage({ navigate }: { navigate: Navigate }) {
  const locale=useLocale();
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('Semua tahun');
  const [topic, setTopic] = useState(() => new URLSearchParams(location.search).get('topik') || '');
  const [term, setTerm] = useState(() => new URLSearchParams(location.search).get('q') || '');
  const [order, setOrder] = useState('new');
  useEffect(()=>{
    const url=new URL(location.href);
    for(const [key,value] of [['q',term],['topik',topic]]) {if(value)url.searchParams.set(key,value);else url.searchParams.delete(key)}
    history.replaceState(history.state,'',url);
  },[term,topic]);
  const articles = localArticles.filter(a => (!topic || a.category === topic) && [a.title,tr(a.title),a.author,a.category,tr(a.category),a.summary,tr(a.summary),a.subtitle].join(' ').toLowerCase().includes(term.trim().toLowerCase()));
  const [visible, setVisible] = useState(18);

  const years = useMemo(
    () => ['Semua tahun', ...Array.from(new Set(innOpinions.map((item) => item.date.slice(0, 4))))],
    [],
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('id-ID');
    return innOpinions.filter((article) => {
      const matchesYear = year === 'Semua tahun' || article.date.startsWith(year);
      const matchesQuery = !normalized || `${article.title} ${tr(article.title)} ${article.author}`.toLocaleLowerCase('id-ID').includes(normalized);
      return matchesYear && matchesQuery;
    }).sort((a,b) => order === 'title' ? tr(a.title).localeCompare(tr(b.title),locale) : order === 'old' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
  }, [query, year, order,locale]);

  return (
    <div className="journal-page">
      <header className="journal-hero" data-reveal>
        <div className="journal-shell journal-hero__grid">
          <div>
            <p className="minimal-kicker">{tr("Iman dan kehidupan publik")}</p><h1>{tr("Jurnal FORNAK")}</h1>
            <p className="journal-deck">{tr("Ruang untuk renungan kebangsaan, kajian publik, dan percakapan kritis yang mendorong gereja mengambil bagian dalam transformasi bangsa.")}</p>
            <a className="folio-button" href="#naskah-pilihan">{tr("Baca pilihan redaksi ↓")}</a> <a className="journal-archive-link" href="#indeks-opini">{tr("Arsip opini")}</a>
          </div>
          <InternalLink to={'/jurnal/'+localArticles[0].slug} navigate={navigate} className="journal-issue"><span>{tr("Jurnal FORNAK")}</span><EditorialCover category={localArticles[0].category} title={localArticles[0].title}/><strong>{tr(localArticles[0].title)}</strong><small>{localArticles[0].author} ↗</small></InternalLink>
        </div>
      </header>

      <section id="naskah-pilihan" className="journal-featured" data-reveal>
        <div className="journal-shell">
          <div className="journal-section-heading">
            <p className="minimal-kicker">{tr("Naskah pilihan")}</p>
            <h2>{tr("Tulisan pilihan")}</h2>
          </div>
          <div className="journal-filters"><label>{tr("Cari naskah")}<input type="search" value={term} onChange={e => setTerm(e.target.value)} placeholder={tr("Judul atau penulis")} /></label><label>{tr("Topik")}<select aria-label={tr("Topik")} value={topic} onChange={e => setTopic(e.target.value)}><option value="">{tr("Semua topik")}</option>{Array.from(new Set(localArticles.map(a => a.category))).map(c => <option key={c} value={c}>{tr(c)}</option>)}</select></label></div>
          <p role="status">{articles.length ? articles.length+' '+tr('tulisan') : tr('Tidak ada tulisan yang cocok.')}</p><div className="journal-featured__grid">
            {articles.map((article, index) => (
              <article key={article.slug} className={index === 0 ? 'journal-card journal-card--lead' : 'journal-card'}>
                <EditorialCover category={article.category} title={article.title}/><div className="journal-card__meta">
                  <span>{tr(article.category)}</span>
                  <span>{article.readingTime} {tr("menit baca")}</span>
                </div>
                <h3>
                  <InternalLink to={`/jurnal/${article.slug}`} navigate={navigate}>
                    {tr(article.title)}
                  </InternalLink>
                </h3>
                {article.subtitle && <p className="journal-card__subtitle">{tr(article.subtitle)}</p>}
                <p>{tr(article.summary)}</p>
                <div className="journal-card__footer">
                  <span>{article.author} · {formatDate(article.date)}</span>
                  <InternalLink to={`/jurnal/${article.slug}`} navigate={navigate}>{tr("Baca naskah")}</InternalLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="indeks-opini" className="journal-index" data-reveal>
        <div className="journal-shell">
          <div className="journal-index__header">
            <div>
              <p className="minimal-kicker">{tr("Indeks Opini")}</p>
              <h2>{tr("Opini INN Indonesia")}</h2>
              <p>{tr("Baca seluruh naskah opini di sini, dengan kredit penulis dan tautan ke sumber asli.")}</p>
            </div>
            <a href={innOpinionSource} target="_blank" rel="noreferrer" className="journal-source-link">{tr("Buka kanal sumber")}</a>
          </div>

          <div className="journal-tools" role="search">
            <label>
              <span>{tr("Cari judul atau penulis")}</span>
              <input
                type="search"
                value={query}
                onChange={(event) => { setQuery(event.target.value); setVisible(18); }}
                placeholder={tr("Contoh: demokrasi, gereja, Hanny")}
              />
            </label>
            <label>
              <span>{tr("Tahun terbit")}</span>
              <select value={year} onChange={(event) => { setYear(event.target.value); setVisible(18); }}>
                {years.map((item) => <option key={item} value={item}>{tr(item)}</option>)}
              </select>
            </label>
            <label><span>{tr("Urutkan")}</span><select value={order} onChange={e => {setOrder(e.target.value);setVisible(18);}}><option value="new">{tr("Terbaru")}</option><option value="old">{tr("Terlama")}</option><option value="title">{tr("Judul A–Z")}</option></select></label><p role="status">{filtered.length} {tr("artikel ditemukan")}</p>
          </div>

          {!filtered.length && <p role="status">{tr("Tidak ada tulisan yang cocok.")}</p>}<div className="journal-list">
            {filtered.slice(0, visible).map((article) => (
              <article key={article.slug} className="journal-list__item">
                <div className="opinion-date"><time dateTime={article.date}>{formatDate(article.date)}</time><span><Clock3 size={13}/>{article.minutes} {tr('menit baca')}</span></div>
                <h3><InternalLink to={'/jurnal/opini/'+article.slug} navigate={navigate}>{tr(article.title)}</InternalLink></h3>
                <div className="opinion-credit"><span>{article.author}</span><ArrowUpRight aria-hidden="true" size={18}/></div>
              </article>
            ))}
          </div>

          {visible < filtered.length && (
            <button type="button" className="journal-load" onClick={() => setVisible((count) => count + 18)}>{tr("Muat artikel berikutnya")}</button>
          )}
        </div>
      </section>
    </div>
  );
}

export function JournalArticlePage({ article, navigate }: { article: LocalArticle; navigate: Navigate }) {
  const locale=useLocale();
  const [showOriginal,setShowOriginal]=useState(false);
  const originalLanguage=article.language==='en'?'en':'id';
  const readingLanguage=showOriginal?originalLanguage:locale;
  const read=(text:string)=>showOriginal?text:tr(text);
  const sections=article.language==='bilingual'&&!showOriginal?article.sections.filter((_,i)=>locale==='en'?i===1:i===0):article.sections;
  const body = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLProgressElement>(null);
  useEffect(() => {
    const update = () => {
      if (!body.current || !bar.current) return;
      const rect = body.current.getBoundingClientRect();
      bar.current.value = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / rect.height));
    };
    update();
    window.addEventListener('scroll', update, {passive:true});
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [article.slug]);
  return (
    <article className="article-page"><progress className="read-progress" ref={bar} max="1" aria-label={tr("Progres membaca")} />
      <header className="article-hero" data-reveal>
        <div className="article-shell">
          <InternalLink to="/jurnal" navigate={navigate} className="article-back">{tr("Kembali ke Jurnal FORNAK")}</InternalLink>
          <p className="minimal-kicker">{tr(article.category)}</p>
          <h1 lang={readingLanguage}>{read(article.title)}</h1>
          {article.subtitle && <p className="article-hero__subtitle">{read(article.subtitle)}</p>}
          <div className="article-byline">
            <span>{article.author}</span>
            <span>{formatDate(article.date)}</span>
            <span>{article.readingTime} {tr("menit baca")}</span>
            {locale!==originalLanguage && <button className="original-toggle" aria-pressed={showOriginal} onClick={()=>setShowOriginal(!showOriginal)}>{tr(showOriginal?'Terjemahan artikel':'Naskah asli')}</button>}
          </div>
        </div>
      </header>
      <div className="article-shell article-layout">
        <aside>
          <p>{tr("Gagasan utama")}</p>
          <strong>{tr(article.summary)}</strong>
          {sections.filter(s => s.heading).length > 1 && <nav aria-label={tr("Daftar isi")}><p>{tr("Dalam tulisan ini")}</p>{sections.map((s,i) => s.heading && <a key={i} href={'#bagian-'+i}>{read(s.heading)}</a>)}</nav>}
          <a href={'https://wa.me/?text='+encodeURIComponent(article.title+' '+window.location.href.split('#')[0])} target="_blank" rel="noreferrer">{tr("Bagikan via WhatsApp")}</a>
          <a href="https://instagram.com/fornak.id" target="_blank" rel="noreferrer">{tr("Ikuti @fornak.id")}</a>
        </aside>
        <div className="article-body" lang={readingLanguage} ref={body}>
          {sections.map((section, index) => (
            <section id={`bagian-${index}`} key={`${article.slug}-${index}`} data-reveal>
              {section.heading && <h2>{read(section.heading)}</h2>}
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{read(paragraph)}</p>)}
              {section.quote && <blockquote>{read(section.quote)}</blockquote>}
            </section>
          ))}
          <footer className="article-endnote">
            <p>{tr("Baca juga")}</p>{localArticles.filter(a => a.slug !== article.slug).slice(0,2).map(a => <InternalLink key={a.slug} navigate={navigate} to={`/jurnal/${a.slug}`}>{tr(a.title)}</InternalLink>)}
            <span>{article.author} · {formatDate(article.date)}</span>
          </footer>
        </div>
      </div>
    </article>
  );
}

export { getLocalArticle };
