# Sistem Desain FORNAK Indonesia

## Konsep

**Modern Institutional Editorial** — sistem visual institusional yang tenang, berwibawa, dan berbasis isi. Arah ini mengambil prinsip hierarki editorial, ruang putih, serta komposisi asimetris dari situs organisasi dan lembaga riset internasional, lalu menurunkannya dari aset resmi FORNAK: merah-putih, biru gelap, emas, logo merpati, dan materi pernyataan.

## Token utama

| Token | Nilai | Penggunaan |
| --- | --- | --- |
| `--navy` | `#14243B` | Latar institusional, judul, footer |
| `--navy-deep` | `#0B1728` | Bagian gelap sekunder |
| `--red` | `#A32330` | Aksi utama dan aksen |
| `--gold` | `#D9A33A` | Penanda editorial pada latar gelap |
| `--ivory` | `#F5F2EB` | Permukaan editorial |
| `--paper` | `#FFFFFF` | Latar dasar |
| `--ink` | `#202124` | Teks utama |
| `--muted` | `#626975` | Teks sekunder |
| `--border` | `#DCDDD8` | Garis pemisah |

## Tipografi

- **Manrope**: judul, navigasi, tombol, dan label institusional.
- **Inter**: teks antarmuka dan paragraf ringkas.
- **Source Serif 4**: kutipan, pengantar editorial, dan penekanan naratif.
- Fallback sistem tersedia agar situs tetap terbaca ketika font web tidak dapat dimuat.

Skala judul menggunakan `clamp()` dan beradaptasi dari layar 360 px hingga desktop besar. Panjang baris isi dibatasi melalui lebar kolom, bukan ukuran teks yang terlalu kecil.

## Tata letak

- Lebar konten maksimal: `1320px`.
- Padding horizontal: `64px` desktop, `32px` tablet, `20px` mobile.
- Bagian utama: `64px–120px` menyesuaikan viewport.
- Grid editorial fleksibel; komposisi satu kolom khusus dirancang untuk mobile.
- Radius dibatasi pada `6px`; bayangan hanya dipakai untuk sampul dokumen atau elevasi penting.

## Komponen

- Header sticky dengan navigasi desktop dan menu mobile.
- Tombol utama solid merah; tautan sekunder memakai garis bawah editorial.
- Hero asimetris dengan pernyataan visual resmi.
- Kartu publikasi berbasis isi, tidak membungkus setiap elemen dalam kartu.
- Pembaca PDF tertanam dengan fallback tautan penuh.
- Galeri masonry dengan pencarian, lightbox, tombol sebelumnya/berikutnya, dan dukungan Escape.
- Footer institusional empat kolom dengan status informasi terverifikasi.

## Aksesibilitas dan motion

- Fokus keyboard terlihat jelas.
- Target sentuh minimum sekitar 44 px.
- Menu dan dialog memiliki label ARIA serta dukungan Escape.
- `prefers-reduced-motion` menonaktifkan transisi non-esensial.
- Satu `h1` per halaman dan urutan heading semantik.
- Kontras teks utama menggunakan kombinasi putih/navy dan navy/putih dengan aksen merah atau emas yang tidak dipakai sebagai satu-satunya penanda.

