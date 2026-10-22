# Implementasi Basehunt

Catatan ini mendokumentasikan implementasi halaman Basehunt saat ini agar
perubahan berikutnya dapat mengikuti alur dan batasan yang sudah ada.

## Struktur

- `page.tsx` — route App Router `/basehunt`, metadata halaman, navbar,
  komponen pencarian, dan footer.
- `../../components/BasehuntSearch.tsx` — UI client untuk upload,
  preview, pencarian, error/loading, dan hasil Top 5.
- `../../components/FeatureTutorialVideo.tsx` — container tutorial video yang
  konsisten untuk Search, Clan Search, Live War, Live CWL, dan Basehunt; video
  autoplay tanpa kontrol native.
- `../api/basehunt/route.ts` — endpoint server-side `POST /api/basehunt`.
- `../../components/BrowserVideo.tsx` — memilih aset video berdasarkan browser.
- `../../../public/Basehunt.webm` — video untuk browser selain Safari.
- `../../../public/Basehunt_Safari.mov` — video untuk Safari.
- `../../../public/basehunt.webp` — gambar Basehunt di menu Features navbar.

## Alur pencarian

1. Pengguna memilih atau menarik gambar ke area upload. UI menerima JPEG,
   PNG, WebP, BMP, GIF, HEIC, HEIF, dan AVIF dengan batas 10 MiB.
2. Browser menampilkan preview lokal menggunakan object URL. URL tersebut
   dilepas ketika file diganti atau komponen dibersihkan.
3. Tombol **Scan base** mengirim `FormData` dengan field `image` ke
   `/api/basehunt`. Browser tidak menetapkan header `Content-Type` sendiri.
4. Route handler membatasi ukuran body request, memeriksa file dan MIME type,
   kemudian meneruskan file ke endpoint `/match` Hugging Face melalui HTTPS.
   `BASEHUNT_API_KEY` hanya dibaca di server dan dikirim sebagai `X-API-Key`.
   Request upstream tidak di-cache, tidak mengikuti redirect, dan memiliki
   timeout 60 detik.
5. Route handler memvalidasi bentuk `matches` dari API, lalu mengambil metadata
   layout aktif dari Turso dengan parameter ID yang dibind. Komentar yang
   dihitung hanya komentar visible. Client Turso ditutup setelah lookup.
6. Metadata disusun ulang mengikuti ranking API. ID yang tidak ditemukan atau
   tidak lagi aktif tidak ditampilkan.
7. Browser menerima `{ matches, layouts }`, menampilkan kartu `LayoutCard`
   berurutan, dan menggulir ke hasil setelah pencarian berhasil. Skor hasil
   ditampilkan sebagai persen similarity relatif, bukan probabilitas.

Kode aplikasi tidak menyimpan screenshot sebagai aset atau data persisten.
Request multipart dapat diproses/dibuffer oleh runtime server dan API; jangan
menganggap batas file berarti tidak ada pemakaian memori atau temporary spool.

## Environment server

Nama environment yang diperlukan di runtime server Next.js:

| Variable | Fungsi |
| --- | --- |
| `BASEHUNT_API_KEY` | Secret bersama untuk autentikasi ke FastAPI. |
| `TURSO_DATABASE_URL` | URL database untuk lookup metadata layout. |
| `TURSO_AUTH_TOKEN` | Token Turso server-side. |
| `BASEHUNT_API_URL` | Opsional; URL Space. Jika tidak diisi, route memakai URL default di source. |

Jangan gunakan prefix `NEXT_PUBLIC_` untuk API key atau kredensial Turso.
Nilai secret harus disetel melalui secret manager hosting, tidak ditulis ke
source, dokumentasi, log, atau bundle browser. API key yang pernah dibagikan
harus dirotasi sebelum production jika belum dilakukan.

## Workflow keep-alive Hugging Face

`.github/workflows/basehunt-keepalive.yml` mengirim
`public/CronJob_keepalive.jpg` ke `POST /match` sekali sehari melalui GitHub
Actions, dan bisa dijalankan manual dengan
**Actions → Keep Basehunt Space Awake → Run workflow**. Workflow ini
memerlukan secret repository `BASEHUNT_API_KEY`. URL Space memakai default
`https://agunghari2-llm111.hf.space`; untuk menggantinya, atur repository
variable `BASEHUNT_API_URL`.

Request inference ini dapat membangunkan Space yang sedang sleep, tetapi
penjadwalan GitHub Actions tidak dijamin tepat waktu dan bukan jaminan Space
selalu hidup. Pada hardware berbayar, request juga dapat menimbulkan biaya
karena inference dijalankan. Untuk ketersediaan tanpa sleep, gunakan pengaturan
paid hardware Hugging Face.

## Batas upload dan kegagalan

- Batas file: 10 MiB.
- Batas seluruh body multipart: ukuran file maksimum ditambah 64 KiB; diperiksa
  lewat `Content-Length` bila ada dan juga saat membaca stream.
- MIME type diperiksa di browser dan route handler. Pemeriksaan MIME bukan
  validasi isi file; API FastAPI tetap bertanggung jawab untuk decode/validasi
  gambar sebenarnya.
- Input/format tidak valid: `400`; terlalu besar: `413`.
- Layanan inference gagal atau responsnya tidak valid: `502`.
- Environment/server database tidak siap: `503`.
- Pesan internal, kredensial, exception upstream, dan detail token tidak
  dikirimkan ke browser.

## UI dan video

- Video tutorial memakai `BrowserVideo`: `/Basehunt.webm` untuk Chrome/browser
  lain dan `/Basehunt_Safari.mov` untuk Safari. Video autoplay dalam keadaan
  mute, loop, inline, menyediakan kontrol pemutaran, dan memakai `object-cover`
  agar memenuhi frame.
- Upload/reset dinonaktifkan selama request berlangsung.
- State UI meliputi preview, validasi lokal, loading, pesan error, hasil kosong,
  hasil Top 5, dan reset.
- Hasil memakai ulang `LayoutCard`; kartu menuju `/layout/{id}`.
- Navbar memiliki tautan Basehunt pada menu Features dan memakai
  `/basehunt.webp`.

## Catatan operasional dan pemeriksaan

- Route `/api/basehunt` dapat dipanggil publik; autentikasi API key hanya
  melindungi panggilan server-ke-server ke Hugging Face. Rate limit
  terdistribusi belum diterapkan. Pertimbangkan rate limit di hosting atau
  storage bersama jika trafik atau penyalahgunaan menjadi perhatian.
- Hugging Face Space gratis dapat sleep setelah periode tidak aktif; request
  pertama setelah tidur mungkin memerlukan waktu lebih lama.
- Jangan mengirim gambar pengguna ke layanan eksternal untuk tes tanpa izin.
- Pemeriksaan terakhir yang tercatat: `npm run build`, `npx tsc --noEmit`, dan
  `git diff --check` berhasil. Build tidak membuktikan koneksi live ke Hugging
  Face atau Turso; lakukan satu tes end-to-end yang diizinkan setelah secrets
  production dikonfigurasi.
