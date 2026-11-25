export type Publication = {
  slug: string;
  title: string;
  shortTitle: string;
  category: string;
  author: string | null;
  affiliation?: string;
  pages: number;
  fileSize: string;
  pdf: string;
  cover: string;
  coverHeightAt480: number;
  coverSrcSet: string;
  summary: string;
  highlights: string[];
  verificationNote?: string;
};

export const publications: Publication[] = [
  {
    slug: 'posisi-teologis-habakuk',
    title: 'Posisi Teologis Habakuk dan Tanggung Jawab Gereja Membaca Bangsa',
    shortTitle: 'Posisi Teologis Habakuk',
    category: 'Teologi Publik',
    author: 'Pdt. Dr. Hanny Setiawan',
    affiliation: 'Direktur PSPI (Pusat Studi Pentakosta Indonesia), STT El-Bethel',
    pages: 8,
    fileSize: '468 KB',
    pdf: '/Fornak-Indonesia/assets/documents/posisi-teologis-habakuk.pdf',
    coverHeightAt480: 622,
    cover: '/Fornak-Indonesia/assets/images/sampul-posisi-teologis-habakuk-900.jpg',
    coverSrcSet:
      '/Fornak-Indonesia/assets/images/sampul-posisi-teologis-habakuk-480.jpg 480w, /Fornak-Indonesia/assets/images/sampul-posisi-teologis-habakuk-900.jpg 900w',
    summary:
      'Kajian ini membaca Habakuk sebagai model posisi profetik: tidak berada di pusat kekuasaan atau larut dalam kerumunan, melainkan berdiri di menara pengintaian untuk membawa kegelisahan bangsa kepada Allah. Naskah menghubungkan posisi tersebut dengan peran gereja Indonesia sebagai penjaga nurani publik yang independen, reflektif, dan konstruktif.',
    highlights: [
      'Habakuk sebagai nabi yang membawa pergumulan bangsa kepada Allah.',
      'Menara pengintaian sebagai posisi epistemik dan spiritual.',
      'Tanggung jawab gereja di antara kedekatan pada kekuasaan dan apatisme publik.',
      'Pendidikan teologi publik, pernyataan pastoral, civil society, dan doa syafaat profetik.',
    ],
    verificationNote:
      'Nama penulis dan afiliasi tercantum di dalam naskah. Tanggal terbit tidak dicantumkan pada halaman publikasi.',
  },
  {
    slug: 'gereja-di-persimpangan-kekuasaan',
    title:
      'Gereja di Persimpangan Kekuasaan: Teologi Politik Bonhoeffer dan Problem Politik Hari Ini',
    shortTitle: 'Gereja di Persimpangan Kekuasaan',
    category: 'Refleksi Teologis-Politis',
    author: null,
    pages: 8,
    fileSize: '237 KB',
    pdf: '/Fornak-Indonesia/assets/documents/gereja-di-persimpangan-kekuasaan.pdf',
    coverHeightAt480: 679,
    cover: '/Fornak-Indonesia/assets/images/sampul-digital-bonhoeffer.svg',
    coverSrcSet:
      '/Fornak-Indonesia/assets/images/sampul-digital-bonhoeffer.svg 480w',
    summary:
      'Refleksi ini membaca ulang teologi politik Dietrich Bonhoeffer untuk membedakan peran negara, individu Kristen, asosiasi kemanusiaan, dan gereja sebagai institusi. Naskah menawarkan kerangka untuk menilai kapan gereja perlu berbicara, bagaimana merespons ketidakadilan, serta bahaya menjadi terlalu pasif atau terlalu melebur dengan politik praktis.',
    highlights: [
      'Negara sebagai tatanan pemeliharaan yang bertanggung jawab pada hukum dan keadilan.',
      'Pembedaan agen perlawanan: asosiasi kemanusiaan, individu Kristen, dan gereja.',
      'Tiga bentuk respons gereja: diakonia, kata politis tak langsung, dan kata politis langsung.',
      'Relevansi bagi populisme, krisis kepemimpinan, politisasi agama, dan kelompok rentan.',
    ],
    verificationNote:
      'Naskah tidak mencantumkan nama penulis personal atau tanggal terbit pada halaman publikasi; karena itu keduanya tidak ditampilkan sebagai fakta resmi.',
  },
  {
    slug: 'silaturahmi-kebangsaan-jawa-tengah-2023',
    title: 'Silaturahmi Kebangsaan Umat Kristen Jawa Tengah',
    shortTitle: 'Silaturahmi Kebangsaan Jawa Tengah',
    category: 'Laporan Kegiatan · 2023',
    author: 'Forum Nasionalisme Kristen',
    pages: 8,
    fileSize: '1,9 MB',
    pdf: '/Fornak-Indonesia/assets/documents/silaturahmi-kebangsaan-jawa-tengah-2023.pdf',
    coverHeightAt480: 679,
    cover: '/Fornak-Indonesia/assets/images/sampul-silaturahmi-kebangsaan-jawa-tengah-2023-900.jpg',
    coverSrcSet: '/Fornak-Indonesia/assets/images/sampul-silaturahmi-kebangsaan-jawa-tengah-2023-480.jpg 480w, /Fornak-Indonesia/assets/images/sampul-silaturahmi-kebangsaan-jawa-tengah-2023-900.jpg 900w',
    summary: 'Laporan FORNAK tentang silaturahmi umat Kristen di Jawa Tengah pada 2023. Buku ini memuat sambutan ketua umum, rangkaian kegiatan, data kehadiran, serta laporan keuangan.',
    highlights: [
      'Sambutan Hanny Setiawan dan catatan silaturahmi bersama pelajar dan mahasiswa.',
      'Pertemuan para hamba Tuhan dengan Gubernur Jawa Tengah saat itu, Ganjar Pranowo.',
      'Rekap kehadiran peserta serta rincian pemasukan dan pengeluaran kegiatan.',
    ],
  },
];

export const getPublication = (slug: string) =>
  publications.find((publication) => publication.slug === slug);

