export type GalleryItem = {
  slug: string;
  title: string;
  category: string;
  alt: string;
  src: string;
  srcSet: string;
};

const portrait = (slug: string) => ({
  src: `/Fornak-Indonesia/Fornak-Indonesia/assets/images/${slug}-1120.webp`,
  srcSet: `/Fornak-Indonesia/Fornak-Indonesia/assets/images/${slug}-640.webp 640w, /Fornak-Indonesia/Fornak-Indonesia/assets/images/${slug}-1120.webp 1120w`,
});

const landscape = (slug: string) => ({
  src: `/Fornak-Indonesia/Fornak-Indonesia/assets/images/${slug}-1440.webp`,
  srcSet: `/Fornak-Indonesia/Fornak-Indonesia/assets/images/${slug}-720.webp 720w, /Fornak-Indonesia/Fornak-Indonesia/assets/images/${slug}-1440.webp 1440w`,
});

export const gallery: GalleryItem[] = [
  {
    slug: 'manifesto-keberanian-moral',
    title: 'Manifesto Keberanian Moral untuk Indonesia',
    category: 'Manifesto',
    alt: 'Manifesto FORNAK tentang kebenaran, keadilan, integritas, dan masa depan Indonesia.',
    ...portrait('manifesto-keberanian-moral'),
  },
  {
    slug: 'identitas-resmi-fornak',
    title: 'Identitas FORNAK Indonesia',
    category: 'Identitas',
    alt: 'Identitas FORNAK Indonesia, logo, semboyan, dan nomor keputusan Menteri Hukum dan HAM.',
    ...landscape('identitas-resmi-fornak'),
  },
  {
    slug: 'gereja-independen-secara-moral',
    title: 'Gereja Independen Secara Moral',
    category: 'Pernyataan',
    alt: 'Pernyataan FORNAK tentang independensi moral gereja.',
    ...portrait('gereja-independen-secara-moral'),
  },
  {
    slug: 'profil-singkat-fornak',
    title: 'Profil Singkat FORNAK',
    category: 'Profil',
    alt: 'Penjelasan singkat tentang FORNAK Indonesia sebagai komunitas relawan Kerajaan Surga.',
    ...landscape('profil-singkat-fornak'),
  },
  {
    slug: 'indonesia-membutuhkan-keberanian-moral',
    title: 'Indonesia Membutuhkan Keberanian Moral',
    category: 'Pernyataan',
    alt: 'Pernyataan FORNAK: Indonesia membutuhkan keberanian moral.',
    ...portrait('indonesia-membutuhkan-keberanian-moral'),
  },
  {
    slug: 'misi-fornak',
    title: 'Misi FORNAK',
    category: 'Misi',
    alt: 'Tiga misi FORNAK: menyatukan, menyuarakan, dan menggerakkan WNI Kristen.',
    ...landscape('misi-fornak'),
  },
  {
    slug: 'enam-persoalan-bangsa',
    title: 'Enam Persoalan Bangsa',
    category: 'Infografik',
    alt: 'Enam persoalan bangsa yang dinilai perlu mendapat perhatian moral.',
    ...portrait('enam-persoalan-bangsa'),
  },
  {
    slug: 'nasionalisme-tanggung-jawab-iman',
    title: 'Nasionalisme dan Tanggung Jawab Iman',
    category: 'Pernyataan',
    alt: 'Pernyataan FORNAK bahwa nasionalisme adalah tanggung jawab iman.',
    ...portrait('nasionalisme-tanggung-jawab-iman'),
  },
  {
    slug: 'program-fornak',
    title: 'Program FORNAK',
    category: 'Program',
    alt: 'Daftar program FORNAK dalam bidang kebangsaan, dialog, kepemimpinan, kajian, dan jejaring.',
    ...landscape('program-fornak'),
  },
  {
    slug: 'mencintai-indonesia-kritis',
    title: 'Mencintai Indonesia dengan Sikap Kritis',
    category: 'Pernyataan',
    alt: 'Pernyataan FORNAK tentang cinta tanah air dan keberanian mengoreksi.',
    ...portrait('mencintai-indonesia-kritis'),
  },
  {
    slug: 'suara-moral-tindakan-nyata',
    title: 'Suara Moral Menjadi Tindakan Nyata',
    category: 'Infografik',
    alt: 'Enam bentuk tindakan nyata sebagai tanggung jawab moral dan kebangsaan.',
    ...portrait('suara-moral-tindakan-nyata'),
  },
  {
    slug: 'kebenaran-harus-disampaikan',
    title: 'Ketika Kebenaran Harus Disampaikan',
    category: 'Ajakan',
    alt: 'Ajakan FORNAK kepada berbagai unsur masyarakat untuk menyampaikan kebenaran.',
    ...portrait('kebenaran-harus-disampaikan'),
  },
  {
    slug: 'komitmen-membangun-indonesia',
    title: 'Komitmen Membangun Indonesia',
    category: 'Komitmen',
    alt: 'Komitmen FORNAK untuk berkontribusi membangun Indonesia yang lebih baik.',
    ...portrait('komitmen-membangun-indonesia'),
  },
  {
    slug: 'pernyataan-gereja-berani-bersuara',
    title: 'Gereja Harus Berani Bersuara',
    category: 'Pernyataan Resmi',
    alt: 'Pernyataan resmi FORNAK: gereja harus berani bersuara.',
    ...portrait('pernyataan-gereja-berani-bersuara'),
  },
  {
    slug: 'indonesia-tantangan-moral-etika',
    title: 'Indonesia dan Tantangan Moral-Etika',
    category: 'Infografik',
    alt: 'Infografik FORNAK tentang Indonesia dan tantangan moral-etika.',
    ...portrait('indonesia-tantangan-moral-etika'),
  },
  {
    slug: 'gereja-suara-kenabian',
    title: 'Gereja dan Suara Kenabian',
    category: 'Pernyataan',
    alt: 'Pernyataan FORNAK tentang suara kenabian gereja.',
    ...portrait('gereja-suara-kenabian'),
  },
  {
    slug: 'visual-kebinekaan-fornak',
    title: 'Visual Kebinekaan FORNAK',
    category: 'Materi Visual',
    alt: 'Ilustrasi kebinekaan dalam materi visual FORNAK Indonesia.',
    ...portrait('visual-kebinekaan-fornak'),
  },
];

