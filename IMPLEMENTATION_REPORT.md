# Laporan Implementasi FORNAK Indonesia

Tanggal implementasi: 24 November 2026

## Audit situs lama

Masalah utama yang ditemukan:

- Navigasi berbasis state, bukan URL; halaman internal tidak memiliki rute langsung yang stabil.
- Banyak statistik, berita, agenda, profil, koordinator, dan capaian tidak didukung aset sumber.
- Formulir keanggotaan dan newsletter mensimulasikan keberhasilan tanpa backend.
- Konten menggunakan banyak foto stok eksternal yang tidak merepresentasikan organisasi.
- Hierarki halaman terlalu padat, berulang, dan didominasi kartu serta dekorasi.
- PDF asli dan gambar lokal tidak terintegrasi.
- Komponen besar dengan data hardcoded menyulitkan pemeliharaan dan audit fakta.
- Tidak ada asset manifest atau catatan verifikasi editorial.

Checkpoint versi lama disimpan di folder saudara `fornak-indonesia-before-redesign-20261124` sebelum perubahan besar.

## Keputusan desain

- Arah **Modern Institutional Editorial** dengan navy, merah, ivory, dan emas yang diturunkan dari materi FORNAK.
- Komposisi asimetris, heading kuat, banyak ruang baca, serta garis pemisah menggantikan kartu dan efek dekoratif berlebihan.
- Hero memakai materi pernyataan resmi, karena tidak ada foto dokumenter terverifikasi.
- Halaman publikasi diposisikan sebagai pusat pengetahuan dengan sampul besar, ringkasan akurat, PDF tertanam, dan unduhan asli.
- Kekosongan data kontak dan dokumentasi dijelaskan secara transparan.

## Halaman dan rute

- `/` — Beranda editorial.
- `/tentang` — Identitas, misi, referensi badan hukum, dan arah program.
- `/pemikiran` — Pengantar jurnal teologi publik.
- `/publikasi` — Perpustakaan dua dokumen.
- `/publikasi/posisi-teologis-habakuk` — Detail dan pembaca PDF.
- `/publikasi/gereja-di-persimpangan-kekuasaan` — Detail dan pembaca PDF.
- `/kegiatan` — Dokumentasi materi komunikasi yang terverifikasi.
- `/galeri` — Galeri masonry, pencarian, dan lightbox.
- `/kontak` — Status verifikasi kontak tanpa formulir palsu.
- Fallback 404.

## Komponen dan arsitektur

- Header, navigasi desktop/mobile, wordmark, footer.
- Hero, section heading, misi, publikasi pilihan, kartu publikasi.
- Library entry, detail publikasi, breadcrumb, PDF reader.
- Galeri masonry, pencarian, lightbox keyboard-accessible.
- Konten dipisahkan ke `src/content/organization.ts`, `publications.ts`, dan `gallery.ts`.
- Routing History API mendukung back/forward dan akses langsung melalui fallback host (`public/_redirects`).

## Aset

- 27 gambar sumber diperiksa.
- 17 gambar unik diproses; 10 salinan ekstra teridentifikasi sebagai duplikat byte-identik.
- 39 salinan WebP responsif dibuat, termasuk sampul PDF dan logo hasil potong dari materi identitas.
- Dua PDF asli dipertahankan dan disalin ke `public/assets/documents`.
- Detail hash, dimensi, duplikat, deskripsi, dan keluaran tersedia di `ASSET_MANIFEST.json`.

## Pengujian

- TypeScript: `npm run lint` — lulus.
- Build produksi: `npm run build` — lulus.
- Build Vite: 1.82 kB HTML, 23.72 kB CSS, 263.45 kB JavaScript sebelum gzip; 79.82 kB JavaScript setelah gzip.
- Audit dependensi: 0 kerentanan yang dilaporkan npm.
- Browser nyata: beranda, tentang, publikasi, detail publikasi, dokumentasi, galeri, kontak, dan 404 dibuka dan diperiksa.
- Responsif: 390×844 dan 1440×900 diuji secara visual; tidak ada overflow horizontal.
- Navigasi mobile, back/forward URL, pencarian galeri, lightbox, tombol sebelumnya/berikutnya, dan tombol tutup diuji.
- Pembaca PDF hadir pada detail publikasi dan tautan file asli tersedia.
- Setiap halaman memiliki satu `h1`; menu, pencarian, dan dialog memiliki label yang dapat dibaca teknologi bantu.

## Batas verifikasi

- Lighthouse tidak dijalankan, sehingga target skor dan Core Web Vitals tidak diklaim tercapai.
- Canonical URL dan sitemap produksi belum dibuat karena domain resmi belum diketahui.
- Tanggal terbit publikasi, kontak, struktur pengurus, dan metadata kegiatan menunggu konfirmasi organisasi.

