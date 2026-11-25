export interface ThoughtArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  source: string;
  author: string;
  authorRole: string;
  readingTime: string;
  keyThesis: string;
  corePoints: {
    heading: string;
    description: string;
  }[];
  quote: string;
  practicalAction: string;
  pdfUrl?: string;
}

export const THOUGHT_STUDIES: ThoughtArticle[] = [
  {
    id: 'habakuk-teologi-publik',
    slug: 'posisi-teologis-habakuk',
    title: 'Posisi Teologis Habakuk dan Tanggung Jawab Gereja Membaca Bangsa',
    subtitle: 'Menara Pengintai: Menjaga Nurani Publik di Tengah Turbulensi Kebangsaan',
    category: 'Teologi Publik & Kenabian',
    source: 'Kajian PSPI (Pusat Studi Pentakosta Indonesia) - STT El-Bethel',
    author: 'Pdt. Dr. Hanny Setiawan',
    authorRole: 'Direktur PSPI, STT El-Bethel',
    readingTime: '8 menit baca',
    keyThesis:
      'Gereja tidak dipanggil untuk larut dalam perebutan kekuasaan praktis atau bersikap apatis menjauh dari realitas. Gereja harus berdiri di menara pengintai spiritual-intelektual untuk menyuarakan nurani kebenaran dan keadilan bagi bangsa.',
    corePoints: [
      {
        heading: '1. Ratapan Profetis ("Ad-Anah")',
        description:
          'Formula ratapan "Berapa lama lagi, TUHAN?" bukan keputusasaan pasif, melainkan tradisi liturgis kenabian yang membawa jeritan ketidakadilan rakyat langsung ke hadirat Allah yang berdaulat.',
      },
      {
        heading: '2. Postur Menara Pengintai',
        description:
          'Posisi epistemik dan spiritual yang jernih: melihat dinamika bangsa melampaui polarisasi politik partisan dan kepentingan kelompok, dengan mata yang diterangi Roh Hikmat.',
      },
      {
        heading: '3. Menghindari Dua Ekstrem Berbahaya',
        description:
          'Pertama: Terlalu dekat dengan kekuasaan sehingga kehilangan independensi profetisnya. Kedua: Terlalu menjauh dari persoalan rakyat sehingga kehilangan relevansi garam dan terang.',
      },
      {
        heading: '4. Empat Manifestasi Konkret Gereja',
        description:
          'Pendidikan teologi publik umat, pernyataan pastoral berbasis prinsip moral, keterlibatan aktif dalam masyarakat sipil (civil society), serta doa syafaat kenabian yang berakar pada empati.',
      },
    ],
    quote:
      '“Menara pengintai bukan sekadar postur intelektual. Ia adalah tempat di mana langit dan bumi bertemu—dan di sanalah suara kenabian dilahirkan.”',
    practicalAction:
      'Membekali umat Kristen di birokrasi, dunia usaha, dan masyarakat sipil agar bersikap independen, berintegritas moral, dan bersuara jernih.',
    pdfUrl: '/assets/documents/posisi-teologis-habakuk.pdf',
  },
  {
    id: 'bonhoeffer-persimpangan-kekuasaan',
    slug: 'gereja-di-persimpangan-kekuasaan',
    title: 'Gereja di Persimpangan Kekuasaan: Teologi Politik Bonhoeffer',
    subtitle: 'Tiga Tingkatan Respons Gereja Menghadapi Mandat Keadilan dan Tirani',
    category: 'Etika & Teologi Politik',
    source: 'Refleksi atas Karya Dietrich Bonhoeffer & Michael P. DeJonge',
    author: 'Refleksi FORNAK Indonesia',
    authorRole: 'Kajian Strategis Teologi Politik',
    readingTime: '8 menit baca',
    keyThesis:
      'Negara adalah tatanan pemeliharaan Allah untuk menjaga hukum dan keadilan. Ketika negara gagal atau menyalahgunakan kekuasaan, gereja memiliki mandat Injil untuk bertindak proporsional—mulai dari diakonia hingga merebut roda ketidakadilan.',
    corePoints: [
      {
        heading: '1. Tiga Agen Perlawanan Sosial',
        description:
          'Asosiasi kemanusiaan (berbicara dari moralitas universal), individu Kristen (menjalankan vokasi profesional di bidang hukum/politik), dan gereja institusional (berbicara dengan otoritas Injil).',
      },
      {
        heading: '2. Respons 1: Diakonia Terhadap Korban',
        description:
          'Gereja wajib membalut luka para korban ketidakadilan sosial tanpa memandang latar belakang primordial, suku, atau agama.',
      },
      {
        heading: '3. Respons 2: Kata Politis Tak Langsung',
        description:
          'Mengingatkan negara secara tegas akan batas mandat konstitusional dan ilahinya untuk menegakkan hukum dan melindungi kaum rentan.',
      },
      {
        heading: '4. Respons 3: Merebut Roda Ketidakadilan',
        description:
          'Bukan sekadar menolong korban di bawah roda tirani, melainkan keberanian etis untuk menghentikan laju roda sistemik yang meremukkan keadilan publik.',
      },
    ],
    quote:
      '“Tugas gereja bukan sekadar membalut luka korban yang tergilas di bawah roda kekuasaan, melainkan menyumbat ruji-ruji roda itu sendiri ketika roda tersebut berputar menghancurkan keadilan.”',
    practicalAction:
      'Mendorong keberanian etis para pemimpin rohani dan profesional Kristen untuk tidak membungkam kebenaran demi kompromi politis sesaat.',
    pdfUrl: '/assets/documents/gereja-di-persimpangan-kekuasaan.pdf',
  },
];

export const NATIONAL_ISSUES = [
  {
    number: '01',
    title: 'Erosi Integritas & Korupsi Struktural',
    impact: 'Melemahkan sendi keadilan dan merampas hak-hak dasar masyarakat rentan.',
    response: 'Mendorong transparansi moral dan keteladanan kepemimpinan bersih di segala sektor.',
  },
  {
    number: '02',
    title: 'Polarisasi & Politisasi Identitas',
    impact: 'Merusak tatanan kebinekaan dan mengaburkan agenda substansial kebangsaan.',
    response: 'Menjaga ruang dialog lintas iman dan memperkokoh konsensus Pancasila serta UUD 1945.',
  },
  {
    number: '03',
    title: 'Kelemahan Penegakan Hukum & Keadilan',
    impact: 'Hukum menjadi tumpul ke atas dan tajam ke bawah, mengikis rasa percaya publik.',
    response: 'Fungsi advokasi kenabian yang menyuarakan kebenaran tanpa rasa takut atau pamrih.',
  },
  {
    number: '04',
    title: 'Kesenjangan Sosial & Kesejahteraan',
    impact: 'Sebagian besar anak bangsa belum menikmati buah kemerdekaan secara merata.',
    response: 'Menggerakkan aksi diakonia transformatif dan pemberdayaan ekonomi masyarakat.',
  },
  {
    number: '05',
    title: 'Krisis Keteladanan Moral Pemimpin',
    impact: 'Generasi muda kehilangan kompas etika dalam berpolitik dan mengabdi pada bangsa.',
    response: 'Membangun ekosistem kaderisasi pemimpin berkarakter hamba dan berjiwa negarawan.',
  },
  {
    number: '06',
    title: 'Apatisme & Keengganan Terlibat Aktif',
    impact: 'Warga gereja merasa enggan atau takut berkontribusi di ranah kebijakan publik.',
    response: 'Edukasi kesadaran kewarganegaraan bahwa nasionalisme adalah wujud nyata tanggung jawab iman.',
  },
];

export const FORNAK_PILLARS_DATA = [
  {
    num: '01',
    title: 'Menyatukan',
    lead: 'Pandangan Kebangsaan WNI Kristen',
    desc: 'Menghubungkan berbagai aras gereja, denominasi, ormas, dan latar belakang suku untuk merumuskan satu visi persaudaraan yang kokoh di bawah naungan NKRI dan Bhinneka Tunggal Ika.',
    accent: '#dc2626',
    action: 'Membangun forum dialog lintas aras dan ruang silaturahmi kebangsaan berkala.',
  },
  {
    num: '02',
    title: 'Menyuarakan',
    lead: 'Suara Kebangsaan WNI Kristen',
    desc: 'Menjadi penyambung nurani publik yang menyuarakan kebenaran, membela kaum tertindas, serta memberikan sumbangsih pemikiran kritis dan konstruktif bagi para pengambil kebijakan negara.',
    accent: '#b91c1c',
    action: 'Menerbitkan manifesto, kajian kebijakan teologi publik, dan pernyataan moral kenabian.',
  },
  {
    num: '03',
    title: 'Menggerakkan',
    lead: 'Keterlibatan Aktif Pembangunan Bangsa',
    desc: 'Memperlengkapi dan mengutus para profesional, pemuda, dan cendekiawan Kristen untuk terjun langsung menjadi garam dan terang di dunia birokrasi, pendidikan, sosial, dan ekonomi.',
    accent: '#991b1b',
    action: 'Menginisiasi sekolah kepemimpinan negarawan, pelatihan vokasi, dan aksi nyata pengabdian.',
  },
];
