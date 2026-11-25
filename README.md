# FORNAK Indonesia

Website institusional dan editorial untuk Forum Nasionalisme Kristen Indonesia. Implementasi menggunakan React 19, TypeScript, dan Vite dengan aset lokal yang telah dioptimalkan.

## Menjalankan secara lokal

Persyaratan: Node.js 20 atau lebih baru.

```powershell
npm install
npm run dev
```

Vite akan menampilkan URL lokal, biasanya `http://localhost:3000`. Jika port tersebut terpakai, Vite memilih port berikutnya.

## Pemeriksaan dan build

```powershell
npm run lint
npm run build
npm run preview
```

Hasil produksi berada di folder `dist`.

## Struktur penting

- `src/App.tsx` — routing, halaman, dan komponen presentasi.
- `src/content/organization.ts` — identitas, misi, dan program terverifikasi.
- `src/content/publications.ts` — metadata dan ringkasan tiga publikasi.
- `src/content/gallery.ts` — arsip visual dan teks alternatif.
- `src/index.css` — design tokens dan sistem layout responsif.
- `public/assets/images` — salinan WebP responsif.
- `public/assets/documents` — PDF asli untuk pembaca dan unduhan.
- `ASSET_MANIFEST.json` — hash, dimensi, duplikat, dan keluaran aset.
- `CONTENT_VERIFICATION.md` — status fakta dan kebutuhan editorial.
- `DESIGN_SYSTEM.md` — arah visual, token, dan komponen.
- `IMPLEMENTATION_REPORT.md` — audit, keputusan, rute, dan hasil QA.

## Catatan produksi

- Tambahkan domain resmi sebelum membuat canonical URL dan sitemap final.
- Lengkapi kanal kontak hanya setelah dikonfirmasi organisasi.
- Hosting statis harus meneruskan semua rute ke `index.html`; file `public/_redirects` sudah disediakan untuk host yang mendukung format tersebut.

