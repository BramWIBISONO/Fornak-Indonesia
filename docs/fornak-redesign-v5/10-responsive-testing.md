# Pengujian responsif

Delapan rute utama diperiksa di Chrome dengan sepuluh viewport, meliputi 320×740, 360×800, 390×844, 430×932, 768×1024, 1024×768, 1280×800, 1440×900, 1920×1080 dan 2560×1440. Apertur CSS menggunakan zoom standar. Setiap halaman menunggu gambar dan font sebelum pengukuran lebar serta pemeriksaan gambar.

Pada ponsel, judul dan tombol mendahului foto, menu masuk ke navigasi seluler, program menjadi dua kolom pilihan, dan buku tampil di atas deskripsinya. Peluncur asisten menjadi tombol lingkaran agar tidak menutupi tautan cepat dengan label panjang. Pemenggalan *Iman yang bekerja* dikoreksi setelah tangkapan ponsel pertama.

Hasil 80 kombinasi tersedia per rute dan lebar. Tangkapan lengkap untuk 390 dan 1440 px ada di folder final. Ini merupakan pengujian viewport Chrome pada Windows. Perilaku perangkat fisik dan Safari iOS masih memerlukan verifikasi tersendiri. [Data pengujian](bukti/final/audit.json)

Tiga bagian yang ditandai juga diperiksa langsung pada alamat pratinjau lokal dengan lebar 320, 390, 839 dan 1440 px. Pada lebar 390 px, foto Tentang berukuran 346 × 167 px. Sampul dalam kartu terkait mempertahankan proporsi 66 × 93 px.
