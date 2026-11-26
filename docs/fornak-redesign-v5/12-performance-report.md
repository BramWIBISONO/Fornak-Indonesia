# Performa produksi

Pengukuran menggunakan Lighthouse 13.6 pada Chrome Windows dengan simulasi seluler. Server Vite Preview menyajikan hasil build lokal. Angka ini menggambarkan satu sesi laboratorium.

| Halaman | Performa | Aksesibilitas | Praktik terbaik | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Beranda | 90 | 100 | 100 | 100 | 3,16 dtk | 0,0005 | 114 ms |
| Jurnal | 95 | 100 | 100 | 100 | 2,40 dtk | 0,0053 | 41 ms |
| Perpustakaan | 95 | 100 | 100 | 100 | 2,41 dtk | 0,0017 | 9 ms |

Halaman beranda memprioritaskan foto arsip pertamanya. Bahasa tambahan, naskah Opini dan pembaca PDF dimuat saat dibutuhkan. Vite memberi peringatan ukuran untuk modul PDF.js yang berukuran sekitar 520 kB sebelum kompresi. Pengunjung yang membaca dokumen juga mengunduh worker PDF. Waktu muat beranda 3,16 detik merupakan keterbatasan yang terlihat dalam simulasi ini. Data pengguna nyata dari layanan hosting belum diukur.

[Hasil Lighthouse](bukti/lighthouse.json) · [Pengukuran awal](bukti/lighthouse-avant.json)
