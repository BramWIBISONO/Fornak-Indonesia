import { sitePath, routePath } from './content/sitePath';
import { LanguagePicker, useLocale, tr } from './features/language';
import { JoinForum } from './features/experience/JoinForum';
import { InnReader } from './features/journal/InnReader';
import { innOpinions } from './features/journal/innIndex';
import {
  ArrowRight,
  BookOpen,
  Check,
  Download,
  ExternalLink,
  Eye,
  FileCheck2,
  FileText,
  Globe2,
  Layers,
  Menu,
  Phone,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import {
  type MouseEvent,
  type ReactNode,
  type RefObject,
  Suspense,
  lazy,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { gallery, type GalleryItem } from './content/gallery';
import { organization } from './content/organization';
import {
  getPublication,
  publications,
  type Publication,
} from './content/publications';
import {
  THOUGHT_STUDIES,
} from './content/thoughtStudies';
import { SiteSearch } from './features/discovery/SiteSearch';
import { ProgramExplorer } from './features/discovery/ProgramExplorer';
import { EditorialCover } from './features/journal/EditorialCover';
import { ImpactNumber } from './features/experience/ImpactNumber';
import { MissionExplorer } from './features/experience/MissionExplorer';
import { PublicationShelf } from './features/experience/PublicationShelf';
import { ArchiveSpread } from './features/experience/ArchiveSpread';
import { localArticles } from './features/journal/localArticles';
import { FornakAssistant } from './features/chatbot/FornakAssistant';
import { useScrollReveal } from './features/experience/useScrollReveal';
import {
  getLocalArticle,
  JournalArticlePage,
  JournalPage,
} from './features/journal/JournalPage';

type Navigate = (path: string) => void;

const PdfReader = lazy(() => import('./features/PdfReader'));


const navItems = [
  { label: 'Beranda', path: '/' },
  { label: 'Tentang', path: '/tentang' },
  { label: 'Pemikiran', path: '/pemikiran' },
  { label: 'Jurnal FORNAK', path: '/jurnal' },
  { label: 'Publikasi', path: '/publikasi' },
  { label: 'Dokumentasi', path: '/kegiatan' },
  { label: 'Galeri', path: '/galeri' },
  { label: 'Kontak', path: '/kontak' },
];

import { structuredData, siteOrigin, pages } from './content/seo';


function Link({
  to,
  navigate,
  children,
  className = '',
  onClick,
}: {
  to: string;
  navigate: Navigate;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    onClick?.();
    navigate(to);
  };

  return (
    <a href={sitePath(to)} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}

function Wordmark({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className={`wordmark ${inverse ? 'wordmark--inverse' : ''}`}>
      <img
        src={sitePath("/assets/images/logo-fornak-144.webp")}
        width="52"
        height="52"
        alt=""
      />
      <span className="wordmark__text">
        <strong>FORNAK</strong>
        <small>Indonesia</small>
      </span>
    </span>
  );
}

function Header({ path, navigate }: { path: string; navigate: Navigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [group, setGroup] = useState('');
  const [compact,setCompact] = useState(false);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  useEffect(()=>{const update=()=>setCompact(window.scrollY>80);update();window.addEventListener('scroll',update,{passive:true});return ()=>window.removeEventListener('scroll',update)},[]);
  const closeGroup = () => setGroup('');
  const desktopMenus = [
    {label:'Beranda', items:[navItems[0]]}, {label:'Tentang', items:[navItems[1]]},
    {label:'Jurnal FORNAK', items:[navItems[3]]}, {label:'Perpustakaan', items:[navItems[2],navItems[4]]},
    {label:'Arsip', items:[navItems[5],navItems[6]]}, {label:'Kontak', items:[navItems[7]]},
  ];
  const current = (route: string) => route === path || path.startsWith(route + '/');

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {setMenuOpen(false);menuTrigger.current?.focus();}
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  return (
    <header className={compact ? "site-header compact" : "site-header"}>
      <div className="header-inner">
        <Link to="/" navigate={navigate} className="brand-link">
          <Wordmark />
          <span className="sr-only">{tr("Beranda FORNAK Indonesia")}</span>
        </Link>
        <nav className="desktop-nav" aria-label={tr("Navigasi utama")} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) closeGroup(); }} onKeyDown={event => { if (event.key === 'Escape') { event.currentTarget.querySelector<HTMLButtonElement>('button[aria-expanded="true"]')?.focus(); closeGroup(); } }}>
          {desktopMenus.map(({label,items}) => items.length === 1
            ? <Link key={label} to={items[0].path} navigate={navigate} onClick={closeGroup} className={current(items[0].path) ? 'active' : ''}>{tr(label)}</Link>
            : <div className="nav-group" key={label}><button type="button" className={items.some(i => current(i.path)) ? 'active' : ''} aria-expanded={group === label} onClick={() => setGroup(group === label ? '' : label)}>{tr(label)} <span aria-hidden="true">⌄</span></button>
                {group === label && <div className="nav-popover">{items.map(i => <Link key={i.path} to={i.path} navigate={navigate} onClick={closeGroup}>{tr(i.label)}</Link>)}</div>}</div>)}
        </nav>
        <LanguagePicker/><SiteSearch navigate={navigate}/>
        <button ref={menuTrigger}
          type="button"
          className="menu-button"
          aria-label={tr(menuOpen ? 'Tutup menu' : 'Buka menu')}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      {menuOpen && (
        <nav id="mobile-navigation" className="mobile-nav" aria-label={tr("Navigasi seluler")}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              navigate={navigate}
              className={path === item.path ? 'active' : ''}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

function Footer({ navigate }: { navigate: Navigate }) {
  return (
    <footer className="site-footer">
      <div className="footer-main container">
        <div className="footer-identity">
          <Wordmark inverse />
          <p>{tr(organization.statement)}</p>
        </div>
        <div>
          <h2>{tr("Organisasi")}</h2>
          <Link to="/tentang" navigate={navigate}>{tr("Tentang FORNAK")}</Link>
          <Link to="/kegiatan" navigate={navigate}>{tr("Dokumentasi")}</Link>
          <Link to="/kontak" navigate={navigate}>{tr("Kontak")}</Link>
        </div>
        <div>
          <h2>{tr("Pengetahuan")}</h2>
          <Link to="/pemikiran" navigate={navigate}>{tr("Pemikiran & Kajian")}</Link>
          <Link to="/jurnal" navigate={navigate}>{tr("Jurnal FORNAK")}</Link>
          <Link to="/publikasi" navigate={navigate}>{tr("Publikasi")}</Link>
          <Link to="/galeri" navigate={navigate}>{tr("Galeri")}</Link>
        </div>
        <div>
          <h2>{tr("Sekretariat Resmi")}</h2>
          <p className="footer-contact-item"><strong>{tr("Alamat:")}</strong> {organization.address}</p>
          <a href={`mailto:${organization.email}`}>{organization.email}</a>
          <a href={organization.adminWhatsApp}>WhatsApp {organization.adminPhone}</a>
          <a href={organization.instagram} target="_blank" rel="noreferrer">Instagram {organization.instagramHandle}</a>
          
        </div>
      </div>
      <div className="footer-bottom container">
        <span>© 2026 FORNAK Indonesia</span><span className="footer-registration">AHU-0001708.AH.01.07.Tahun 2024</span>
        <span>{tr("Bagi Tuhan, Bagi Indonesia")}</span>
      </div>
    </footer>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

function MissionGlyph({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg className="mission-icon" viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="10" cy="24" r="5"/><circle cx="38" cy="24" r="5"/>
        <circle cx="24" cy="9" r="5"/><circle cx="24" cy="39" r="5"/>
        <path d="M15 24h18M24 14v20M13 21l8-9M35 21l-8-9M13 27l8 9M35 27l-8 9"/>
        <circle cx="24" cy="24" r="4" fill="currentColor"/>
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg className="mission-icon" viewBox="0 0 48 48" aria-hidden="true">
        <path d="M24 8v32M24 8c9 7 9 25 0 32M24 8C15 15 15 33 24 40M10 24h28"/>
        <circle cx="24" cy="24" r="15" fill="none"/><path d="M24 18v12M18 24h12"/>
      </svg>
    );
  }
  return (
    <svg className="mission-icon" viewBox="0 0 48 48" aria-hidden="true">
      <path d="M7 36l11-10 7 5 15-17"/><path d="M31 14h9v9"/>
      <path d="M8 40h32M12 29l6-6 7 5 11-12" opacity=".45"/>
    </svg>
  );
}

function SectionHeading({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className="section-heading">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2>{title}</h2>
      {intro && <p>{intro}</p>}
    </header>
  );
}

function MinimalHome({ navigate }: { navigate: Navigate }) {
  return (
    <div className="minimal-home">
      <section className="immersive-opening" aria-labelledby="opening-title">
        <div className="opening-copy">
          <p className="opening-kicker">Forum Nasionalisme Kristen Indonesia</p>
          <h1 id="opening-title">{tr("Iman yang")} <br/>{tr("bekerja untuk")} <br/><em>{tr("Indonesia.")}</em></h1>
          <p className="opening-lead">{tr("Kami mempertemukan warga Kristen dari berbagai latar untuk berdialog, menyuarakan keadilan, dan mengambil bagian dalam kehidupan bangsa.")}</p>
          <div className="opening-actions"><a href="#bergabung" className="folio-button">{tr("Bergabung dengan FORNAK")} <ArrowRight size={17}/></a><Link to="/jurnal" navigate={navigate}>{tr("Jelajahi Jurnal")} <ArrowRight size={16}/></Link></div>
        </div>
        <ArchiveSpread/>
      </section>

      <nav className="home-desk" aria-label={tr("Jelajahi FORNAK")}><div className="minimal-container home-desk__grid">
        <Link to="/jurnal" navigate={navigate}><BookOpen aria-hidden="true" /><span><strong>{tr("Jurnal FORNAK")}</strong><small>{tr("Esai dan renungan")}</small></span><ArrowRight aria-hidden="true" /></Link>
        <Link to="/publikasi" navigate={navigate}><FileText aria-hidden="true" /><span><strong>{tr("Perpustakaan")}</strong><small>{tr("Kajian dan dokumen PDF")}</small></span><ArrowRight aria-hidden="true" /></Link>
        <Link to="/kegiatan" navigate={navigate}><Layers aria-hidden="true" /><span><strong>{tr("Dokumentasi")}</strong><small>{tr("Foto dan pernyataan organisasi")}</small></span><ArrowRight aria-hidden="true" /></Link>
      </div></nav>
      <section className="identity-intro"><div className="identity-title"><p className="folio-label">{tr("Tentang FORNAK")}</p><h2>{tr("Bagi Tuhan,")}<br/><em>{tr("bagi Indonesia.")}</em></h2></div><div><p>{tr(organization.statement)}</p><Link to="/tentang" navigate={navigate}>{tr("Kenali organisasi kami")} <ArrowRight size={17}/></Link></div></section>
      <MissionExplorer/>

      <section id="program-kerja" className="minimal-programs minimal-section" aria-labelledby="program-title" data-reveal>
        <div className="minimal-container minimal-programs__grid">
          <header className="minimal-section-heading">
            <p className="minimal-kicker">{tr("Program")}</p>
            <h2 id="program-title">{tr("Program kerja FORNAK.")}</h2>
          </header>
          <ProgramExplorer/>
        </div>
      </section>

      <section className="minimal-impact minimal-section" aria-labelledby="impact-title" data-reveal>
        <div className="minimal-container">
          <figure className="report-panorama"><img src={sitePath("/assets/images/peserta-laporan-2023.webp")} width="1250" height="605" alt="Peserta duduk berderet dalam dokumentasi Silaturahmi Kebangsaan." loading="lazy"/><figcaption>{tr("Silaturahmi Kebangsaan Umat Kristen se-Jawa Tengah · Laporan 2023")}</figcaption></figure>
          <header className="minimal-impact__header">
            <div>
              <p className="minimal-kicker">{tr("Jejak kerja 2023")}</p>
              <h2 id="impact-title">{tr("Silaturahmi Kebangsaan Umat Kristen se-Jawa Tengah")}</h2>
            </div>
            <p>{tr("Progress Report 2023 mencatat kehadiran hamba Tuhan, pelajar, dan mahasiswa dalam silaturahmi ini.")}</p>
          </header>
          <dl className="minimal-impact__grid">
            <div><dt><ImpactNumber value="185" /></dt><dd>{tr("Hamba Tuhan terlibat")}</dd></div>
            <div><dt><ImpactNumber value="50+" /></dt><dd>{tr("Gereja dan organisasi Kristen")}</dd></div>
            <div><dt><ImpactNumber value="2.500+" /></dt><dd>{tr("Siswa SMP/SMA/SMK se-Jawa Tengah")}</dd></div>
            <div><dt><ImpactNumber value="200+" /></dt><dd>{tr("Mahasiswa dari Semarang, Yogyakarta, dan Jawa Tengah")}</dd></div>
          </dl>
          <p className="minimal-impact__source"><Link to="/publikasi/silaturahmi-kebangsaan-jawa-tengah-2023" navigate={navigate} className="impact-source-link">{tr("Baca laporan kegiatan 2023 →")}</Link></p>
        </div>
      </section>

      <section className="minimal-archive-callout" data-reveal>
        <div className="minimal-container minimal-archive-callout__inner">
          <div>
            <p className="minimal-kicker">{tr("Arsip FORNAK")}</p>
            <h2>{tr("Pernyataan dan jejak organisasi.")}</h2>
          </div>
          <div className="minimal-archive-callout__links">
            <Link to="/kegiatan" navigate={navigate} className="minimal-text-link">{tr("Dokumentasi")}</Link>
            <Link to="/galeri" navigate={navigate} className="minimal-text-link">{tr("Galeri")}</Link>
          </div>
        </div>
      </section>
      <section className="home-insights minimal-section"><div className="minimal-container">
        <div className="section-line"><div><p className="minimal-kicker">{tr("Jurnal FORNAK")}</p><h2>{tr("Pilihan redaksi")}</h2></div><Link to="/jurnal" navigate={navigate}>{tr("Semua tulisan →")}</Link></div>
        <div className="insight-grid">{localArticles.slice(0,3).map(article => <article key={article.slug}><EditorialCover category={tr(article.category)} title={article.title}/><p className="minimal-meta">{tr(article.category)}</p><h3><Link to={'/jurnal/'+article.slug} navigate={navigate}>{tr(article.title)}</Link></h3><p>{tr(article.summary)}</p><small>{article.author} · {article.readingTime} {tr("menit baca")}</small></article>)}</div>
      </div></section>
      <PublicationShelf navigate={navigate}/>
      <JoinForum/>
    </div>
  );
}

function PublicationCard({
  publication,
  navigate,
}: {
  publication: Publication;
  navigate: Navigate;
}) {
  return (
    <article className="related-volume">
      <Link to={'/publikasi/'+publication.slug} navigate={navigate} className="related-book-link">
        <div className="related-book-art"><img src={publication.cover} srcSet={publication.coverSrcSet}
          sizes="(max-width: 540px) 88px, 132px" width={480} height={publication.coverHeightAt480} alt="" loading="lazy"/></div>
        <div className="related-book-copy">
          <p className="metadata">{tr(publication.category)} · {publication.pages} {tr('halaman')}</p>
          <h3>{publication.shortTitle}</h3><p>{tr(publication.highlights[0])}</p>
          <span>{tr('Baca publikasi')} <ArrowRight size={16} aria-hidden="true"/></span>
        </div>
      </Link>
    </article>
  );
}

function PageHero({ eyebrow, title, intro, artwork }: { eyebrow: string; title: string; intro: string; artwork?: ReactNode }) {
  return (
    <section className={artwork ? "page-hero section-dark with-art" : "page-hero section-dark"}>
      <div className="container page-hero__inner">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1>{title}</h1>
        <p>{intro}</p>
        {artwork && <div className="page-hero-art" aria-hidden="true">{artwork}</div>}
      </div>
    </section>
  );
}

function AboutPage({ navigate }: { navigate: Navigate }) {
  return (
    <>
      <header className="profile-intro"><div className="profile-intro-inner">
        <div className="profile-intro-copy"><p className="folio-label">{tr('Tentang FORNAK')}</p>
          <h1>{tr('Iman dan kebangsaan.')}</h1>
          <p>{tr('Kenali komunitas relawan Kristen yang membangun ruang dialog dan pelayanan bagi Indonesia.')}</p>
          <a href="#identitas-fornak">{tr('Kenali organisasi kami')} <ArrowRight size={17}/></a>
        </div>
        <figure><img src={sitePath('/assets/images/peserta-laporan-2023.webp')} width={1250} height={605} alt={tr('Peserta Silaturahmi Kebangsaan di Jawa Tengah')}/>
          <figcaption>{tr('Silaturahmi Kebangsaan Umat Kristen se-Jawa Tengah · Laporan 2023')}</figcaption>
        </figure>
      </div></header>
      <section id="identitas-fornak" className="about-lead section-space">
        <div className="container about-lead__grid">
          <div>
            <Eyebrow>{tr("Siapakah kami?")}</Eyebrow>
            <h2>{organization.fullName}</h2>
          </div>
          <div>
            <blockquote>“{tr(organization.statement)}”</blockquote>
            <p className="source-note">{tr("Sumber: materi profil resmi FORNAK Indonesia.")}</p>
          </div>
        </div>
      </section>

      <section className="about-identity section-space--compact section-ivory">
        <div className="container identity-grid">
          <figure className="official-seal"><img src={sitePath("/assets/images/fornak-logo-mark.webp")} width="200" height="200" loading="lazy" alt="Lambang resmi Forum Nasionalisme Kristen"/></figure>
          <div>
            <Eyebrow>{tr("Identitas dan legalitas")}</Eyebrow>
            <h2>{tr(organization.tagline)}</h2>
            <p>{organization.legalReference}</p>
            <Link to="/galeri" navigate={navigate} className="minimal-text-link">{tr("Lihat arsip identitas resmi")}</Link>
          </div>
        </div>
      </section>

      <MissionExplorer/>
      <section className="minimal-programs minimal-section"><div className="minimal-container"><p className="folio-label">{tr("Program kerja")}</p><h2>{tr("Enam ruang kerja FORNAK.")}</h2><ProgramExplorer/></div></section>
      <section className="journey section-space--compact"><div className="container"><h2>{tr("Jejak organisasi")}</h2><details open><summary>{tr("2023 · Kegiatan komunitas")}</summary><p>{tr("Progress Report FORNAK 2023 mencatat keterlibatan 185 hamba Tuhan dan lebih dari 50 gereja dan organisasi Kristen.")}</p></details><details><summary>{tr("2024 · Legalitas perkumpulan")}</summary><p>{organization.legalReference}</p></details></div></section>
      <section className="next-reading section-space--compact">
        <div className="container next-reading__inner">
          <h2>{tr("Dialog dan kerja sama dengan FORNAK.")}</h2>
          <Link to="/kontak" navigate={navigate} className="button">{tr("Hubungi sekretariat")}</Link>
        </div>
      </section>
    </>
  );
}

function ThoughtPage({ navigate }: { navigate: Navigate }) {
  return <><PageHero eyebrow={tr("Pemikiran & kajian")} artwork={<EditorialCover category="Sejarah & Transformasi"/>} title={tr("Gereja dalam kehidupan publik")} intro={tr("Dua kajian tentang suara kenabian, kekuasaan, dan tanggung jawab gereja bagi bangsa.")} />
    <section className="section-space container study-topics">{THOUGHT_STUDIES.map(study => <article key={study.slug}><p className="minimal-meta">{study.category}</p><h2>{study.title}</h2><p>{study.keyThesis}</p><details><summary>{tr("Pokok pembahasan")}</summary>{study.corePoints.map(point => <section key={point.heading}><h3>{point.heading}</h3><p>{point.description}</p></section>)}</details><Link to={'/publikasi/'+study.slug} navigate={navigate}>{tr("Baca publikasi lengkap →")}</Link></article>)}</section></>;
}

function PublicationsPage({ navigate }: { navigate: Navigate }) {
  const [query, setQuery] = useState('');
  const matches = publications.filter(p => [p.title, p.category, p.author].join(' ').toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <>
      <header className="library-front"><div className="library-front-inner"><div>
        <p className="folio-label">{tr("Publikasi FORNAK")}</p><h1>{tr("Perpustakaan digital")}</h1>
        <p>{tr("Baca dan unduh kajian FORNAK tentang gereja, kekuasaan, dan kehidupan berbangsa.")}</p>
        <a className="folio-button" href="#koleksi">{tr("Telusuri koleksi")} <ArrowRight size={17}/></a>
      </div><div className="front-shelf" aria-label={tr("Rak buku FORNAK")}>{publications.map(p=><Link key={p.slug} navigate={navigate} to={'/publikasi/'+p.slug}><img src={p.coverSrcSet.split(' ')[0]} width={480} height={p.coverHeightAt480} alt={p.shortTitle}/></Link>)}</div></div></header>
      <section id="koleksi" className="library section-space">
        <div className="container">
          <label className="catalog-search">{tr("Cari publikasi")}<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={tr("Judul, topik, atau penulis")} /></label><div className="library-topline">
            <span role="status">{matches.length} {tr("publikasi")}</span>
            <span>{tr("PDF asli · Akses terbuka")}</span>
          </div>
          {matches.length === 0 && <p>{tr("Belum ada publikasi yang cocok. Coba kata lain.")}</p>}<div className="catalog-books">
            {matches.map((publication, index) => (
              <article key={publication.slug} className="catalog-volume">

                <figure><Link navigate={navigate} to={"/publikasi/"+publication.slug}>
                  <img
                    src={publication.cover}
                    srcSet={publication.coverSrcSet}
                    width={480} height={publication.coverHeightAt480}
                    sizes="(max-width: 760px) 48vw, 24vw"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    alt={`Sampul ${publication.title}`}
                  />
                </Link></figure>
                <div className="catalog-copy">
                  <p className="metadata">{tr(publication.category)} · {publication.pages} {tr("halaman ·")} {publication.fileSize}</p>
                  <h2>{publication.title}</h2>
                  {publication.author && <p className="publication-byline">{publication.author}</p>}
                  <p>{tr(publication.summary)}</p>
                  <div className="button-row">
                    <Link to={`/publikasi/${publication.slug}`} navigate={navigate} className="button">{tr("Baca publikasi")}</Link>
                    <a href={publication.pdf} className="download-link" download>
                      <Download aria-hidden="true" /> {tr("Unduh PDF")}</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function PublicationDetail({ publication, navigate }: { publication: Publication; navigate: Navigate }) {
  return (
    <>
      <section className="publication-hero section-ivory">
        <div className="container breadcrumb" aria-label="Breadcrumb">
          <Link to="/" navigate={navigate}>{tr("Beranda")}</Link>
          <span aria-hidden="true">/</span>
          <Link to="/publikasi" navigate={navigate}>{tr("Publikasi")}</Link>
          <span aria-hidden="true">/</span>
          <span>{publication.shortTitle}</span>
        </div>
        <div className="container publication-hero__grid">
          <figure>
            <img
              src={publication.cover}
              srcSet={publication.coverSrcSet}
              sizes="(max-width: 760px) 76vw, 32vw"
              alt={`Sampul ${publication.title}`}
            />
          </figure>
          <div>
            <Eyebrow>{tr(publication.category)}</Eyebrow>
            <h1>{publication.title}</h1>
            {publication.author ? (
              <p className="publication-author">
                <strong>{publication.author}</strong>
                {publication.affiliation && <span>{publication.affiliation}</span>}
              </p>
            ) : (
              <p className="publication-author"><span>{tr("Penulis tidak dicantumkan pada naskah.")}</span></p>
            )}
            <div className="document-facts">
              <span><FileText aria-hidden="true" /> {publication.pages} {tr("halaman")}</span>
              <span>PDF · {publication.fileSize}</span>
            </div>
            <div className="button-row">
              <a className="button" href="#pembaca-dokumen">{tr("Baca dokumen")}</a>
              <a className="download-link" href={publication.pdf} download>
                <Download aria-hidden="true" /> {tr("Unduh PDF asli")}</a>
            </div>
          </div>
        </div>
      </section>

      <section className="publication-summary section-space--compact">
        <div className="container publication-summary__grid">
          <div>
            <Eyebrow>{tr("Ringkasan editorial")}</Eyebrow>
            <h2>{tr("Gagasan utama")}</h2>
          </div>
          <div>
            <p className="lead-paragraph">{tr(publication.summary)}</p>
            <ul className="highlight-list">
              {publication.highlights.map((highlight) => (
                <li key={highlight}>{tr(highlight)}</li>
              ))}
            </ul>

          </div>
        </div>
      </section>

      <section id="pembaca-dokumen" className="reader-section section-space--compact section-dark">
        <div className="container reader-heading">
          <div>
            <Eyebrow>{tr("Pembaca dokumen")}</Eyebrow>
            <h2>{publication.shortTitle}</h2>
          </div>
          <a href={publication.pdf} target="_blank" rel="noreferrer" className="text-link text-link--light">
            <ExternalLink aria-hidden="true" /> {tr("Buka PDF asli")}</a>
        </div>
        <div className="container reader-frame">
          <Suspense fallback={<p>{tr("Memuat pembaca PDF…")}</p>}><PdfReader key={publication.slug} url={publication.pdf} title={publication.shortTitle} /></Suspense>
        </div>
      </section>

      <section className="related-reading" id="bacaan-terkait">
        <div className="container">
          <header><h2>{tr("Bacaan terkait")}</h2><Link to="/publikasi" navigate={navigate}>{tr("Semua publikasi")} <ArrowRight size={16}/></Link></header>
          <div className="related-reading-grid">
            {publications
              .filter((item) => item.slug !== publication.slug)
              .map((item) => (
                <PublicationCard key={item.slug} publication={item} navigate={navigate} />
              ))}
          </div>
        </div>
      </section>
    </>
  );
}

function DocumentationPage({ navigate }: { navigate: Navigate }) {
  return (
    <>
      <PageHero
        eyebrow={tr("Kegiatan & dokumentasi")}
        title={tr("Arsip organisasi")}
        intro={tr("Telusuri foto arsip, pernyataan sikap, dan gagasan yang menyertai perjalanan FORNAK.")}
      />
      <section className="container report-entry report-feature" aria-labelledby="report-2023-title"><div>
        <p className="minimal-kicker">{tr("Laporan kegiatan · 2023")}</p>
        <h2 id="report-2023-title">{tr("Silaturahmi Kebangsaan Umat Kristen se-Jawa Tengah")}</h2>
        <p>{tr("Menurut laporan kegiatan 2023, sebanyak 185 hamba Tuhan dari 50+ gereja dan organisasi Kristen hadir bersama 2.500+ siswa SMP/SMA/SMK se-Jawa Tengah dan 200+ mahasiswa.")}</p>
        <Link to="/publikasi/silaturahmi-kebangsaan-jawa-tengah-2023" navigate={navigate} className="minimal-text-link">{tr("Baca laporan lengkap")} <ArrowRight aria-hidden="true" /></Link></div><img src={publications[2].cover} alt="Sampul laporan Silaturahmi Kebangsaan Jawa Tengah 2023" loading="lazy"/>
      </section>
      <div className="container archive-photo"><figure><img src={sitePath("/assets/images/peserta-laporan-2023.webp")} width="1250" height="605" alt="Peserta duduk bersama dalam dokumentasi kegiatan Jawa Tengah." /><figcaption>{tr("Dokumentasi dari laporan Silaturahmi Kebangsaan Umat Kristen se-Jawa Tengah 2023, halaman 4.")}</figcaption></figure></div><section className="documentation-feature section-space">
        <div className="container documentation-feature__grid">
          <figure>
            <img
              src={sitePath("/assets/images/komitmen-membangun-indonesia-1120.webp")}
              srcSet={[sitePath("/assets/images/komitmen-membangun-indonesia-640.webp 640w"), sitePath("/assets/images/komitmen-membangun-indonesia-1120.webp 1120w")].join(", ")}
              sizes="(max-width: 760px) 80vw, 36vw"
              alt="Komitmen FORNAK untuk berkontribusi membangun Indonesia yang lebih baik."
            />
          </figure>
          <div>
            <Eyebrow>{tr("Pernyataan FORNAK")}</Eyebrow>
            <h2>{tr("Komitmen membangun Indonesia yang lebih baik.")}</h2>
            <p>{tr("Materi ini menempatkan peran gereja, dialog lintas unsur bangsa, kepemimpinan berintegritas, sikap kritis, dan Indonesia sebagai rumah bersama sebagai bagian dari komitmen FORNAK.")}</p>
            
            <Link to="/galeri" navigate={navigate} className="button">{tr("Lihat seluruh arsip")}</Link>
          </div>
        </div>
      </section>
      <section className="archive-strip section-space--compact section-ivory">
        <div className="container">
          <SectionHeading
            eyebrow={tr("Pilihan arsip")}
            title={tr("Pernyataan, manifesto, dan infografik.")}
          />
          <div className="archive-grid">
            {gallery.slice(4, 10).map((item) => (
              <figure key={item.slug}>
                <img src={item.src} srcSet={item.srcSet} loading="lazy" alt={item.alt} />
                <figcaption><span>{tr(item.category)}</span>{item.title}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function GalleryPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const tileRef = useRef<HTMLButtonElement>(null);
  useEffect(()=>{if(activeIndex===null)tileRef.current?.focus({preventScroll:true})},[activeIndex]);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(gallery.map((g) => g.category)));
    return ['Semua', ...cats];
  }, []);

  const filtered = useMemo(() => {
    let list = gallery;
    if (selectedCategory !== 'Semua') {
      list = list.filter((item) => item.category === selectedCategory);
    }
    const value = query.trim().toLocaleLowerCase('id');
    if (!value) return list;
    return list.filter((item) =>
      `${item.title} ${item.category}`.toLocaleLowerCase('id').includes(value),
    );
  }, [query, selectedCategory]);

  useEffect(() => {
    if (activeIndex === null) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveIndex(null);
      if (event.key === 'ArrowRight') {
        setActiveIndex((index) => (index === null ? null : (index + 1) % filtered.length));
      }
      if (event.key === 'ArrowLeft') {
        setActiveIndex((index) =>
          index === null ? null : (index - 1 + filtered.length) % filtered.length,
        );
      }
    };
    document.body.classList.add('modal-open');
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', handleKey);
    };
  }, [activeIndex, filtered.length]);

  const active = activeIndex === null ? null : filtered[activeIndex];

  return (
    <>
      <PageHero
        eyebrow={tr("Galeri & Arsip Visual")}
        title={tr("Dokumentasi Visual & Pernyataan Publik")}
        intro={tr("Telusuri manifesto, pernyataan sikap, dan materi visual FORNAK menurut topik.")}
      />
      <section className="gallery-section section-space">
        <div className="container">
          <div className="gallery-toolbar">
            <label className="gallery-search">
              <Search aria-hidden="true" />
              <span className="sr-only">{tr("Cari arsip visual")}</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={tr("Cari berdasarkan judul atau topik...")}
              />
            </label>
            <div className="category-chips" role="group" aria-label={tr("Filter kategori arsip")}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  aria-pressed={selectedCategory === cat}
                  type="button"
                  className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="gallery-meta-bar">
            <p className="gallery-count" aria-live="polite">{tr("Menampilkan")} <strong>{filtered.length}</strong> {tr("arsip visual")}</p>
          </div>

          <div className="masonry-grid">
            {filtered.map((item, index) => (
              <button
                type="button"
                className="gallery-tile"
                key={item.slug}
                onClick={event => {tileRef.current=event.currentTarget;setActiveIndex(index)}}
                aria-label={`Buka ${item.title}`}
              >
                <div className="gallery-tile__img-wrap">
                  <img src={item.src} srcSet={item.srcSet} loading="lazy" alt="" />
                  <span className="gallery-tile__overlay">
                    <Eye size={20} /> {tr("Perbesar")}</span>
                </div>
                <div className="gallery-tile__content">
                  <small>{tr(item.category)}</small>
                  <h3>{item.title}</h3>
                </div>
              </button>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="empty-state">
              <Search size={32} />
              <p>{tr("Tidak ada arsip yang cocok dengan kata kunci atau filter saat ini.")}</p>
              <button
                type="button"
                className="button button--light"
                onClick={() => {
                  setQuery('');
                  setSelectedCategory('Semua');
                }}
              >{tr("Reset Filter")}</button>
            </div>
          )}
        </div>
      </section>
      {active && (
        <Lightbox
          item={active}
          index={activeIndex ?? 0}
          total={filtered.length}
          closeRef={closeButtonRef}
          onClose={() => setActiveIndex(null)}
          onPrevious={() =>
            setActiveIndex((index) =>
              index === null ? null : (index - 1 + filtered.length) % filtered.length,
            )
          }
          onNext={() =>
            setActiveIndex((index) => (index === null ? null : (index + 1) % filtered.length))
          }
        />
      )}
    </>
  );
}

function Lightbox({
  item,
  index,
  total,
  closeRef,
  onClose,
  onPrevious,
  onNext,
}: {
  item: GalleryItem;
  index: number;
  total: number;
  closeRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const touchStart=useRef<{x:number;y:number}|null>(null);
  const dialogRef=useRef<HTMLDialogElement>(null);
  const [zoomed,setZoomed]=useState(false);
  useEffect(()=>{const el=dialogRef.current;el?.showModal();return ()=>el?.close()},[]);
  useEffect(()=>setZoomed(false),[item.slug]);
  return (
    <dialog ref={dialogRef} onCancel={e=>{e.preventDefault();onClose()}} className="lightbox"  aria-labelledby="lightbox-title">
      <div className="lightbox__top">
        <span>{index + 1} / {total}</span>
        <button ref={closeRef} type="button" onClick={onClose} aria-label={tr("Tutup galeri")}>
          <X aria-hidden="true" />
        </button>
      </div>
      <div className="lightbox__body">
        <div tabIndex={0} role="region" aria-label={tr("Gambar arsip")} className={zoomed ? "lightbox-image zoomed" : "lightbox-image"} onTouchStart={e=>{touchStart.current={x:e.touches[0].clientX,y:e.touches[0].clientY}}} onTouchEnd={e=>{const start=touchStart.current;if(!start||zoomed)return;const dx=e.changedTouches[0].clientX-start.x;if(Math.abs(dx)>55 && Math.abs(dx)>Math.abs(e.changedTouches[0].clientY-start.y)) {if(dx>0)onPrevious();else onNext()}touchStart.current=null}}> <img src={item.src} srcSet={item.srcSet} alt={item.alt} /></div>
        <div className="lightbox__caption">
          <p>{tr(item.category)}</p>
          <h2 id="lightbox-title">{item.title}</h2>
          <div className="lightbox__controls"><a className="archive-download" href={item.src} download>{tr("Unduh gambar")}</a>
            <button type="button" aria-pressed={zoomed} onClick={()=>setZoomed(!zoomed)}>{tr("Perbesar gambar")}</button><button type="button" onClick={onPrevious}>{tr("Sebelumnya")}</button>
            <button type="button" onClick={onNext}>{tr("Berikutnya")}</button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow={tr("Kontak & Kesekretariatan")}
        title={tr("Hubungi FORNAK")}
        intro={tr("Hubungi admin FORNAK untuk informasi organisasi, kerja sama, publikasi, dan korespondensi kelembagaan.")}
      />
      <section className="contact-section section-space">
        <div className="container contact-grid">
          <div>
            <Eyebrow>{tr("Sekretariat FORNAK")}</Eyebrow>
            <h2>{tr("Hubungi kami")}</h2>
            <p>{tr("FORNAK Indonesia mengutamakan integritas dan kejelasan informasi publik. Gunakan kanal di bawah ini agar pertanyaan dan usulan kolaborasi diterima oleh pihak yang tepat.")}</p>
            <div className="contact-features">
              <div className="feature-item">
                <Phone size={20} className="feature-icon" />
                <div>
                  <strong>{tr("Admin FORNAK")}</strong>
                  <p><a href={organization.adminWhatsApp} target="_blank" rel="noreferrer">{organization.adminPhone}</a></p>
                </div>
              </div>
              <div className="feature-item">
                <Globe2 size={20} className="feature-icon" />
                <div>
                  <strong>Instagram</strong>
                  <p><a href={organization.instagram} target="_blank" rel="noreferrer">{organization.instagramHandle}</a></p>
                </div>
              </div>
              <div className="feature-item">
                <ShieldCheck size={20} className="feature-icon" />
                <div>
                  <strong>{tr("Terdaftar di Kemenkumham RI")}</strong>
                  <p>{tr("Badan hukum sah dengan nomor AHU resmi.")}</p>
                </div>
              </div>
              <div className="feature-item">
                <FileCheck2 size={20} className="feature-icon" />
                <div>
                  <strong>{tr("Dokumen & Publikasi Terverifikasi")}</strong>
                  <p>{tr("Kajian dan manifesto diterbitkan dengan integritas editorial.")}</p>
                </div>
              </div>
            </div>
          </div>
          <aside className="verification-panel">
            
            <h2>{tr("Identitas Resmi Organisasi")}</h2>
            <dl>
              <div><dt>{tr("Nama Lengkap")}</dt><dd>{organization.fullName}</dd></div>
              <div><dt>{tr("Singkatan")}</dt><dd>{organization.name}</dd></div>
              <div><dt>{tr("Semboyan")}</dt><dd><em>"{organization.tagline}"</em></dd></div>
              <div><dt>{tr("Status Badan Hukum")}</dt><dd>{organization.legalReference}</dd></div>
              <div><dt>Email</dt><dd><a href={`mailto:${organization.email}`}>{organization.email}</a></dd></div>
              <div><dt>{tr("Admin WhatsApp")}</dt><dd><a href={organization.adminWhatsApp} target="_blank" rel="noreferrer">{organization.adminPhone}</a></dd></div>
            </dl>
          </aside>
        </div>
      </section>
      <JoinForum/>

    </>
  );
}

function NotFound({ navigate }: { navigate: Navigate }) {
  return (
    <section className="not-found section-space">
      <div className="container">
        <Eyebrow>404</Eyebrow>
        <h1>{tr("Halaman tidak ditemukan.")}</h1>
        <p>{tr("Alamat yang Anda buka tidak tersedia dalam struktur situs FORNAK.")}</p>
        <Link to="/" navigate={navigate} className="button">{tr("Kembali ke beranda")}</Link>
      </div>
    </section>
  );
}

function RouteView({ path, navigate }: { path: string; navigate: Navigate }) {
  if (path === '/') return <MinimalHome navigate={navigate} />;
  if (path === '/tentang') return <AboutPage navigate={navigate} />;
  if (path === '/pemikiran') return <ThoughtPage navigate={navigate} />;
  if (path === '/jurnal') return <JournalPage navigate={navigate} />;
  if (path === '/publikasi') return <PublicationsPage navigate={navigate} />;
  if (path === '/kegiatan') return <DocumentationPage navigate={navigate} />;
  if (path === '/galeri') return <GalleryPage />;
  if (path === '/kontak') return <ContactPage />;
  if (path.startsWith('/publikasi/')) {
    const publication = getPublication(path.split('/').filter(Boolean).at(-1) ?? '');
    if (publication) return <PublicationDetail publication={publication} navigate={navigate} />;
  }
  if (path.startsWith('/jurnal/opini/')) {
    const slug=path.slice('/jurnal/opini/'.length);
    return innOpinions.some(a=>a.slug===slug) ? <InnReader key={slug} slug={slug} navigate={navigate}/> : <NotFound navigate={navigate}/>;
  }
  if (path.startsWith('/jurnal/')) {
    const article = getLocalArticle(path.split('/').filter(Boolean).at(-1) ?? '');
    if (article) return <JournalArticlePage article={article} navigate={navigate} />;
  }
  return <NotFound navigate={navigate} />;
}

export default function App() {
  useLocale();
  const [path, setPath] = useState(() => routePath(window.location.pathname));
  useScrollReveal(path);

  useEffect(() => {
    const onPopState = () => setPath(routePath(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const meta = pages[path] ?? {title:'FORNAK Indonesia', description:organization.statement};
    document.title = meta.title;
    const canonical=document.querySelector('link[rel="canonical"]');
    canonical?.setAttribute('href',siteOrigin+path);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content',siteOrigin+path);
    document.querySelector('meta[property="og:type"]')?.setAttribute('content',path.startsWith('/jurnal/')?'article':'website');
    const schema=document.getElementById('page-schema');
    if(schema)schema.textContent=JSON.stringify(structuredData(path));
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', meta.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', meta.description);
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
  }, [path]);

  const navigate: Navigate = (nextPath) => {
    if (nextPath === path) {
      window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      return;
    }
    window.history.pushState({}, '', sitePath(nextPath));
    setPath(nextPath);
    requestAnimationFrame(()=>document.getElementById('main-content')?.focus({preventScroll:true}));
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <>
      <a className="skip-link" href="#main-content">{tr("Lewati ke konten utama")}</a>
      <Header path={path} navigate={navigate} />
      <main id="main-content" tabIndex={-1}>
        <RouteView path={path} navigate={navigate} />
      </main>
      <Footer navigate={navigate} />
      <FornakAssistant navigate={navigate} />
    </>
  );
}
