# Pemeriksaan aksesibilitas

axe-core dijalankan pada delapan rute utama dalam viewport 390 dan 1440 px menggunakan aturan WCAG A/AA dari 2.0 hingga 2.2 yang tersedia dalam konfigurasi proyek. Sesi perjalanan pengunjung juga memeriksa keadaan dialog pencarian, artikel, pembaca PDF, lightbox, dan asisten.

Perbaikan meliputi kontras navigasi program, judul halaman dalam, metadata jurnal, keterangan foto, serta footer. Akordeon menggunakan tombol asli dengan aria-expanded dan aria-controls. Tab program menghubungkan label dengan panel dan mengelola fokus saat input panah. Teks dan aksi penting tetap tersedia dalam mode prefers-reduced-motion.

Uji keyboard meliputi pembukaan misi, perpindahan program, pemilihan dokumen, pencarian, galeri dan Escape. Ketiga PDF dapat dimuat, dibaca halaman demi halaman, diperbesar, dicari dan diunduh. Struktur tag aksesibilitas internal setiap PDF serta penggunaan pembaca layar oleh pengguna nyata belum diaudit. [Hasil axe per halaman](bukti/final/audit.json) · [Hasil dialog dan alur](bukti/interaksi/journeys.json)
