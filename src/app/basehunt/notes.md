# Catatan perjalanan pencarian base Clash of Clans

Dokumen ini merangkum perjalanan eksperimen dari pipeline embedding awal sampai
pengujian edge-map terbaru. Tujuannya supaya konteks dan hasil penting tidak
hilang saat pindah chat.

## Tujuan proyek

Status terkini (21 Oktober 2026): FastAPI Basehunt di Hugging Face Space
berhasil menjalankan `POST /match` end-to-end. Startup memuat YOLO26s, request
menerima gambar, membuat embedding, membaca vector aktif dari Turso, dan
mengembalikan lima ranking dengan HTTP 200. Tahap yang tersisa adalah integrasi
server-side ke Next.js production `3agang.pro/basehunt`.

Mencari base Clash of Clans yang paling mirip dengan screenshot input dengan
cara:

1. Mengubah gambar base menjadi embedding menggunakan model klasifikasi YOLO.
2. Membandingkan embedding input dengan embedding gambar yang sudah tersimpan.
3. Mengurutkan hasil berdasarkan cosine similarity.

Model `yolo26n-cls.pt` menghasilkan embedding 256 dimensi. Skor cosine
similarity adalah ukuran kemiripan arah vector, **bukan probabilitas** bahwa
dua base pasti sama.

## Perjalanan eksperimen

### 1. Pipeline awal tanpa preprocessing

Proyek bermula dari panduan pipeline yang dibagikan pengguna dari Gemini.
Pipeline awal memakai koleksi gambar base dan file Excel untuk membuat database
embedding lokal, lalu mengubah screenshot input menjadi embedding dan
mengurutkan hasil dengan cosine similarity.

Pengguna sudah menjalankan langkah awal pembuatan vector, tetapi ingin mencoba
dan memahami hasilnya sendiri sebelum melanjutkan langkah berikutnya. Prinsip
ini tetap berlaku: jangan jalankan pipeline atau langkah lanjutan tanpa
permintaan eksplisit.

### 2. Migrasi data Cloudinary/Turso

Alur kemudian dikembangkan agar dapat menggunakan data layout dari Turso dan
gambar di Cloudinary:

- **Pipeline 1** mengambil daftar layout dari Turso atau export CSV, lalu
  mengunduh gambar JPG lokal dengan nama file berupa ID.
- **Pipeline 2** membuat embedding gambar dan menyimpannya ke CSV.
- **Pipeline 3** mengunggah vector ke kolom `vector` di Turso. Secara default
  pipeline ini dry-run; perubahan database membutuhkan `--apply`.
- **Pipeline 4** mencocokkan input dengan vector Turso secara baca-saja.

Export yang digunakan memiliki 206 baris: 204 layout aktif dan 2 draft. Ada
205 URL Cloudinary dan satu URL halaman Reddit untuk ID 94, yang bukan file
gambar langsung. Pipeline mengunduh 205 JPG dan melewati ID 94.

Pada Windows, glob `*.jpg` dapat mencakup file `.JPG` juga. Pipeline ekstraksi
diperbaiki agar tidak memproses file yang sama dua kali.

Pengguna menambahkan kolom `vector TEXT` di Turso, menjalankan dry-run, lalu
mengunggah vector baseline. Log yang dibagikan pengguna mengonfirmasi **205
baris berhasil diperbarui dan 0 dilewati**.

Kredensial database dimuat dari `.env.local`, yang diabaikan Git. Jangan
menyalin atau menampilkan nilai kredensial dalam catatan, chat, atau source code.

### 3. Baseline memperlihatkan bias scenery

Pengujian matcher baseline menunjukkan bahwa scenery/latar dapat sangat
mempengaruhi ranking. Pada salah satu input, Pipeline 4 menampilkan ID 508,
442, dan 484 sebagai Top 3. Pengguna kemudian membandingkan hasil dengan base
yang diketahui benar dan melihat bahwa base dengan scenery serupa dapat
mendapat skor tinggi meskipun pola base bukan yang paling tepat.

Temuan ini memunculkan ide preprocessing: mengurangi informasi warna atau
mengubah gambar menjadi garis agar bentuk base lebih berpengaruh.

### 4. Eksperimen grayscale

Eksperimen grayscale dibuat di folder `grayscale/` tanpa mengubah baseline atau
vector di Turso. Semua 205 gambar lokal diproses menjadi embedding 256 dimensi
dan disimpan di workbook terpisah.

Transformasinya:

1. Gambar diubah menjadi grayscale.
2. Hasil dikonversi kembali ke RGB untuk diberikan ke YOLO.

Grayscale menghilangkan warna, tetapi masih mempertahankan banyak tekstur dan
pola scenery. Pada pengujian yang base benarnya ID 496, ID 496 mendapat skor
sekitar 89.76%, sedangkan ID 524 sekitar 97.73%. Matcher grayscale pada
pengujian lain menampilkan ID 441, 474, dan 242 di Top 3, bukan ID 496.

Kesimpulan sementara: grayscale saja belum cukup mengatasi pengaruh scenery.

### 5. Eksperimen edge-map

Atas permintaan pengguna, eksperimen baru dibuat di folder `edges/`, tetap
terpisah dari baseline, grayscale, dan Turso.

Preprocessing yang dipakai:

1. Konversi ke grayscale.
2. Gaussian blur dengan kernel 5x5.
3. Canny edge detection dengan threshold rendah 50 dan tinggi 150.
4. Konversi edge map menjadi RGB untuk YOLO.

Implementasi transformasi bersama ada di `edges/edge_preprocessing.py`.
Generator dan matcher memakai preprocessing yang sama. Generator menyimpan
205 vector 256 dimensi dalam `edges/database_vektor_edges.xlsx`. Matcher
membandingkan input dengan workbook lokal dan secara default hanya mencetak
Top 3. Edge map mencakup tepi wall, bangunan, scenery, dan UI; jadi ini bukan
detektor wall khusus.

Hasil uji yang tercatat:

| Kasus uji | Base benar | Hasil edge-map | Catatan |
|---|---:|---|---|
| Screenshot dengan posisi/scenery berbeda | 496 | Peringkat 161, skor 94.10%; Top 3: 441, 450, 523 | Edge belum membantu kasus ini. |
| Screenshot uji sebelumnya | 508 | Peringkat 3, skor 98.82%; di belakang ID 282 (98.93%) dan ID 452 (98.91%) | Hasil menjanjikan untuk screenshot itu. |
| Screenshot uji berikutnya | 437 | Peringkat 7 dari 205, skor 98.39%; ID 524 di peringkat 1 (98.77%), ID 508 di peringkat 2 (98.66%), ID 333 di peringkat 3 (98.66%) | Gambar input saat itu adalah `test_user_input.jpg`. |

Saat menjalankan matcher terakhir, perintah `python` biasa gagal karena
environment tersebut tidak memiliki pandas. Matcher berhasil dijalankan
menggunakan Python virtual environment proyek:

```powershell
.\.venv\Scripts\python.exe .\edges\pipeline_edges_match.py
```

Untuk mengetahui peringkat ID di luar Top 3, seluruh 205 skor harus diurutkan
atau matcher perlu menerima opsi jumlah hasil yang lebih banyak. Pada pengujian
ID 437, perhitungan dilakukan terhadap seluruh workbook dan ID 437 ada di
peringkat 7.

### 6. Pipeline crop awal

Pengguna meminta preview pipeline crop area base isometrik. Dibuat
`edges/pipeline_edges_crop.py` untuk memotong screenshot input ke bounding box
persegi panjang yang membingkai area base. Default menggunakan
`test_user_input.jpg` dan rasio ROI `(0.128125, 0.0, 0.871875, 1.0)`.
Koordinat dapat dituning dengan argumen `--roi LEFT TOP RIGHT BOTTOM`, sebagai
rasio ukuran gambar. Output default:
`edges/cropped_images/test_user_input_crop.jpg`.

Crop ini masih perkiraan manual khusus screenshot tersebut; belum ada deteksi
otomatis dan belum digunakan untuk embedding atau matching. Workbook edge,
grayscale, baseline, dan Turso tidak berubah. Gambar hasil crop perlu ditinjau
dan batasnya mungkin perlu disesuaikan agar tidak memotong bagian base.

### 7. Eksperimen edge-cropping

Atas permintaan pengguna dibuat folder terpisah `edge_cropping/` untuk
menggabungkan bounding-box crop, edge Canny, dan mask diamond. Alurnya:

1. Crop persegi panjang memakai ROI relatif terhadap ukuran screenshot.
2. Konversi crop ke grayscale, Gaussian blur 5x5, lalu Canny 50/150.
3. Setelah Canny, piksel di luar polygon diamond diubah menjadi hitam sehingga
   tepi mask tidak dimasukkan sebagai garis buatan.
4. Embedding YOLO disimpan ke workbook baru dan dicocokkan oleh matcher baru.

File pipeline: `edge_cropping/edge_cropping_preprocessing.py`,
`edge_cropping/preview_edge_cropping.py`,
`edge_cropping/pipeline_edge_cropping_embed.py`, dan
`edge_cropping/pipeline_edge_cropping_match.py`. Default ROI/diamond adalah
perkiraan berdasarkan `test_user_input.jpg`, bukan deteksi otomatis. Generator
dan matcher harus dijalankan dengan parameter geometri yang sama; metadata
workbook memvalidasi kecocokan itu.

Workbook default `edge_cropping/database_vektor_edge_cropping.xlsx` terpisah
dari edge biasa, grayscale, baseline, dan Turso. Jangan mengganti atau
mengunggah vector di luar folder eksperimen tanpa permintaan eksplisit.

### 8. Eksperimen YOLO26s

Pengguna meminta percobaan `yolo26s-cls.pt` dalam folder mandiri
`edge_cropping_yolo26s/`. Model belum tersedia saat mulai, lalu berhasil
diunduh Ultralytics ke root project. Dataset lokal berisi 205 gambar. Model s
menghasilkan embedding 512 dimensi, berbeda dari 256 dimensi model n. Karena
embedding berbeda antar model, gunakan generator YOLO26s untuk membuat
workbook referensinya; jangan membandingkan vector YOLO26s dengan workbook
YOLO26n.

- `edge_cropping_yolo26s/pipeline_edge_cropping_yolo26s_embed.py`: generator
  vector YOLO26s.
- `edge_cropping_yolo26s/pipeline_edge_cropping_yolo26s_match.py`: matcher
  YOLO26s.
- Output terisolasi:
  `edge_cropping_yolo26s/database_vektor_edge_cropping_yolo26s.xlsx`.

Keduanya memakai preprocessing bersama dari
`edge_cropping/edge_cropping_preprocessing.py` dan memvalidasi model serta
konfigurasi crop/mask di workbook. Cara mencoba: jalankan generator tanpa
`--limit`, lalu matcher. Workbook lengkap terverifikasi berisi 205 ID unik
dengan vector 512 dimensi. Pada `test_user_input.jpg`, ID 508 mendapat
peringkat 2 dari 205 (96.97% cosine similarity); Top 3 adalah ID 276
(97.93%), ID 508 (96.97%), dan ID 495 (96.75%). Ini hanya hasil screenshot
tersebut, bukan klaim peningkatan akurasi umum. Workbook edge-cropping
YOLO26n dan Turso tidak diubah.

**Penting:** file `test_user_input.jpg` dapat diganti saat pengguna mencoba
screenshot baru. Ranking hanya berlaku untuk isi file pada saat matcher
dijalankan. Jangan menganggap hasil lama masih cocok dengan gambar input yang
sekarang.

## Kesimpulan saat ini

Pengguna mencoba screenshot langsung dari dalam game dan sengaja memilih
scenery yang berbeda. Dalam dua pengujian terakhir yang diketahui, base benar
masuk peringkat 3 dan peringkat 7. Ini merupakan sinyal yang menjanjikan bahwa
edge-map membantu menemukan base yang cocok di tengah perbedaan scenery.

Hipotesis pengguna tentang pengaruh fitur—scenery, bentuk wall, dan posisi
bangunan—masih perlu diuji lebih lanjut. Dari ranking cosine saja kita belum
bisa memastikan urutan faktor atau seberapa besar bobot masing-masing. Edge
map juga masih menyertakan garis scenery, bangunan, dan UI. Kesimpulan paling
aman saat ini: **edge-map tampak membantu pada beberapa screenshot lintas
scenery, tetapi belum terbukti konsisten untuk semua kasus**. Kasus ID 496
yang berada di peringkat 161 adalah bukti bahwa pendekatan ini belum
menyelesaikan semua variasi.

Pengujian lanjutan yang berguna adalah mencatat setiap screenshot beserta ID
ground truth, scenery, dan ranking base benar. Bandingkan beberapa kasus
“base sama, scenery berbeda” dan “base berbeda, scenery sama”. Jangan
menyimpulkan akurasi umum dari dua contoh.

## Struktur eksperimen dan file penting

- `no preprocessing/`: pipeline baseline dan Turso.
- `grayscale/`: generator, matcher, dan workbook grayscale lokal.
- `edges/`: preprocessing edge, generator, matcher, preview, dan workbook edge
  lokal.
- `edges/edge_preprocessing.py`: sumber transformasi edge Canny bersama.
- `edges/pipeline_edges_embed.py`: membuat workbook vector edge lokal.
- `edges/pipeline_edges_match.py`: mencocokkan input dengan workbook edge.
- `edges/database_vektor_edges.xlsx`: workbook edge 205 base; jangan timpa
  kecuali pengguna memang meminta regenerasi.
- `grayscale/database_vektor_grayscale.xlsx`: workbook pembanding grayscale.
- `tutorial_migration.md`: panduan pipeline migrasi dan eksperimen.

Workbook grayscale dan edge tetap eksperimen lokal. Setelah proses
replacement yang dicatat di bagian 11, vector `layouts.vector` Turso berisi
embedding edge-cropping YOLO26s untuk 205 ID.

### 9. UI lokal untuk uji berulang

Pengguna meminta UI input gambar di folder `input_match/` untuk mencoba
pipeline edge-cropping YOLO26s berulang kali. UI dibuat dengan Tkinter bawaan
Python agar tidak perlu menambah dependency. File: `input_match/app.py`.

Jalankan dengan:

```powershell
.\.venv\Scripts\python.exe .\input_match\app.py
```

UI menyediakan pemilih gambar, tombol Cari Top 5, thumbnail input, lima hasil
dengan ID/skor/thumbnail gambar referensi lokal, status proses, dan tombol
Reset untuk membersihkan gambar dan hasil. Inferensi berjalan di thread
latar agar window tetap responsif. Model dan workbook dimuat saat pencarian
pertama lalu dipakai ulang. Workbook yang dipakai adalah
`edge_cropping_yolo26s/database_vektor_edge_cropping_yolo26s.xlsx`. Skor yang
ditampilkan adalah cosine similarity, bukan probabilitas.

#### UI kedua: kartu hasil dari Turso

`input_match/app2.py` dibuat untuk mencoba pencarian langsung ke Turso tanpa
mengubah database. Berbeda dari `app.py`, app2 memuat vector dan metadata
layout aktif dari Turso, membuat embedding input dengan preprocessing
edge-cropping + YOLO26s, lalu merender Top 5 sebagai kartu. Kartu menampilkan
ID/ranking, Town Hall, base tag, judul dari deskripsi, skor similarity,
engagement, thumbnail, serta tombol detail, import, dan sumber bila tersedia.
Metadata dan perilaku kartu mengikuti field yang dipakai frontend Next.js.

Query app2 hanya `SELECT`; ia tidak menulis atau mengganti data Turso. Reset
mengosongkan input/hasil UI. Model dan kumpulan vector dicache selama sesi
agar pencarian berulang tidak selalu mengunduh model atau membaca database
lagi. Unduh thumbnail dilakukan di worker; objek gambar Tk dibuat di thread
UI.

Jalankan UI dengan:

```powershell
.\.venv\Scripts\python.exe .\input_match\app2.py
```

Untuk kontrak FastAPI `basehunt`, lima ID terurut sudah cukup bila frontend
akan mengambil metadata layout berdasarkan ID. Contoh respons minimal:
`{"ids":[508,524,470,437,495]}`. Field skor similarity opsional dan berguna
untuk debugging atau menampilkan urutan/kekuatan relatif, tetapi bukan
probabilitas. Implementasi FastAPI live kini menggunakan bentuk yang lebih
informatif `{"matches":[{"id":508,"score":0.9746}, ...]}`, bersama field
model, count, dan format input.

#### Hasil uji pengguna dan kelemahan yang ditemukan

Pengguna telah menguji sekitar 10 gambar dengan UI/pipeline edge-cropping
YOLO26s. Menurut laporan pengguna, **8 dari 10 gambar menempatkan base benar
di Top 5; 2 gambar gagal masuk Top 5**. Ini hasil uji awal pengguna, bukan
benchmark terkontrol atau klaim akurasi umum; belum ada daftar gambar, ID
ground truth, dan ranking per gambar yang dicatat di sini.

Pengguna mengamati tiga kondisi yang dapat menurunkan ranking:

- Center base bergeser jauh dari posisi yang umum.
- Aspect ratio layar/screenshot berbeda.
- Base pada screenshot diputar.

Catat hal-hal ini sebagai kelemahan pipeline crop + mask + embedding YOLO26s
saat ini, bukan sebagai bukti bahwa YOLO sendiri adalah satu-satunya sumber
masalah. ROI/diamond crop yang tetap juga dapat berkontribusi terhadap
pergeseran posisi dan aspect ratio, sedangkan embedding mungkin sensitif
terhadap rotasi. Untuk mengukur perubahan, simpan contoh yang berhasil dan
gagal beserta ID ground truth, kondisi scenery/posisi/aspect ratio/rotasi, dan
ranking target. Jangan menala parameter hanya pada satu screenshot.

### 10. Rencana integrasi production (belum dikerjakan)

Pengguna sudah memiliki project production di `3agang.pro` dan sedang
mengembangkan fitur `3agang.pro/basehunt`. Alur produk yang direncanakan:

1. User mengirim screenshot base.
2. Backend mencari lima kandidat paling mirip.
3. User menerima lima ID/slug base untuk dipilih berdasarkan kemiripan vector.

Rencananya pipeline pencarian akan dideploy sebagai API menggunakan FastAPI di
Hugging Face Space berbasis Docker yang sudah disiapkan pengguna. API diharapkan
mengikuti pola `no preprocessing/pipeline_4_match_turso.py`: menerima gambar,
membuat embedding, membaca vector dari Turso, menghitung cosine similarity,
dan mengembalikan Top 5 ID. Preprocessing dan model yang direncanakan adalah
**crop + edge Canny + mask isometrik + YOLO26s**. Vector Turso sudah diganti
dengan vector pipeline tersebut (lihat bagian 11).

API FastAPI awal tersedia di `basehunt-api/` dan sudah dideploy ke HF Docker
Space pengguna. Integrasi Next.js ke `3agang.pro/basehunt` belum dilakukan.
Vector YOLO26s sudah diunggah ke Turso dan API sudah diverifikasi dengan model
nyata serta query Turso read-only (lihat bagian 12).

Panduan langkah end-to-end dari FastAPI sampai deployment Docker Space dan
integrasi server-side Next.js telah disiapkan di `huggingfacedeployment.md`.
Implementasi awal service FastAPI dan Docker build context sekarang ada di
`basehunt-api/`, termasuk normalisasi input ke JPEG sebelum preprocessing,
endpoint read-only Turso, autentikasi API key, serta unit/integration tests
berautentikasi. Lima belas tes lokal berhasil, termasuk PNG→JPEG,
preprocessing setelah normalisasi, validasi vector, ranking, endpoint auth,
request size limit, serta pemilihan bobot lokal. Helper preprocessing di
folder API dibandingkan byte-for-byte dengan helper proyek utama. Tes nyata
dengan bobot YOLO/Turso dan deployment Space kemudian dijalankan oleh pengguna
dan berhasil. Docker build lokal tetap belum diuji karena Docker CLI tidak
tersedia di environment ini.

Log startup HF pertama menunjukkan model tidak ada di image, sehingga
Ultralytics mencoba download dan gagal menulis file `.part` karena working
directory runtime tidak writable untuk user non-root. Dockerfile
`basehunt-api/` kini secara eksplisit membuat `/home/appuser/app` dan
memberikannya kepada `appuser`, menyalin seluruh build context, sementara
`.dockerignore` mengecualikan file model secara umum tetapi mengizinkan
`yolo26s-cls.pt`. Setelah perubahan ini pengguna perlu push isi folder API ke
root repository Space dan menjalankan rebuild. Jika model diunggah ke root
Space, API otomatis memilihnya; jika tidak, auto-download dapat menulis ke
working directory yang sekarang writable. Docker build tetap perlu diverifikasi
di Hugging Face karena Docker CLI lokal tidak tersedia.

Tes `/match` dari Swagger lolos tahap upload dan embedding tetapi merespons
503 dengan log `Turso vector query failed (ValueError)`. Ini menunjukkan
kegagalan berada di client initialization atau SELECT Turso; parsing vector
memiliki jalur log terpisah. Logging API kemudian diperbaiki agar membedakan
client initialization, SELECT, close, dan invalid vector tanpa mencetak URL,
token, atau exception mentah. Screenshot Swagger awal pengguna menampilkan API key, sehingga key tersebut
harus dicabut/dirotasi di HF Space dan hosting Next.js. Token Turso juga
sempat tampil utuh dalam pesan IDE; token yang terekspos harus dicabut dan
diganti. Jangan menyimpan atau mengulang nilai kredensial di catatan.

### 12. Deployment dan tes live FastAPI di HF Space

Pengguna men-deploy API dari isi folder `basehunt-api/` ke HF Docker Space
`https://agunghari2-llm111.hf.space`. Endpoint langsung:

- Swagger UI: `https://agunghari2-llm111.hf.space/docs`
- Health check: `https://agunghari2-llm111.hf.space/health`
- Match: `POST https://agunghari2-llm111.hf.space/match`

Pada percobaan pertama, model berhasil diunduh tetapi
proses tidak dapat menulis file sementara `.yolo26s-cls.pt.*.part` karena
working directory tidak writable oleh user non-root. Dockerfile kemudian
diperbaiki untuk membuat dan memberi kepemilikan `/home/appuser/app` kepada
`appuser`; auto-download YOLO26s berikutnya berhasil, dan aplikasi memulai
Uvicorn di port 7860.

Verifikasi operasional yang dibagikan pengguna:

- `GET /health` mengembalikan HTTP 200 dan `{"status":"ok"}`. Ini memastikan
  proses/model siap, tetapi sendiri tidak mengecek Turso.
- Request awal `POST /match` mengembalikan 503 pada SELECT Turso. Query yang
  sama kemudian berhasil dari environment lokal, menemukan 204 layout aktif
  dengan vector string 512 dimensi. Setelah secret Turso di HF diperbaiki/
  diperbarui, pengguna mencoba kembali.
- Request `POST /match` berikutnya berhasil dengan HTTP 200. Ini memverifikasi
  upload gambar, normalisasi input ke JPEG, preprocessing, embedding YOLO26s,
  pembacaan vector Turso, dan ranking dalam jalur live.
- Hasil yang dilaporkan untuk input `test_user_input.jpg`:

  | Rank | ID | Cosine similarity |
  |---:|---:|---:|
  | 1 | 524 | 0.971287 |
  | 2 | 508 | 0.971120 |
  | 3 | 470 | 0.970718 |
  | 4 | 437 | 0.967740 |
  | 5 | 488 | 0.964331 |

- Response menyatakan `model: yolo26s-cls.pt`, `count: 5`,
  `input_format: JPEG`, dan `normalized_format: JPEG`.
- Nilai skor adalah cosine similarity, bukan probabilitas. Ranking hanya
  berlaku untuk gambar yang dikirim pada tes itu.

Catatan kredensial: screenshot Swagger memperlihatkan `X-API-Key` dan sebuah
pesan IDE memperlihatkan `TURSO_AUTH_TOKEN`. Rotasi/revocation harus
dikonfirmasi: cabut key/token yang terpapar, buat nilai baru, lalu set ulang
di HF Space (dan `BASEHUNT_API_KEY` juga di hosting Next.js). Jangan tempel
secret di chat, screenshot, curl yang dibagikan, README, atau Git. Gunakan
token Turso read-only bila tersedia.

**Langkah proyek berikutnya:** implementasikan `3agang.pro/basehunt` di
Next.js. Browser sebaiknya mengirim gambar ke Next.js Route Handler;
Route Handler memvalidasi file dan meneruskan ke HF API dengan
`BASEHUNT_API_KEY` server-side, kemudian mengambil metadata kartu dari Turso
berdasarkan ID dan mengurutkannya sesuai urutan Top 5. Jangan mengirim API key
HF atau kredensial Turso ke browser. Panduan API dan integrasi ada di
`huggingfacedeployment.md`; bagian integrasi Next.js masih berupa panduan dan
belum diterapkan pada repository production.

Panduan dan kode API menetapkan topik berikut:

- Kontrak API upload gambar dan respons berisi lima ID/slug serta skor
  similarity.
- Reuse preprocessing dan model YOLO26s yang sama persis dengan generator
  vector database.
- Query Turso baca-saja untuk kandidat; jangan memasukkan kredensial ke source
  code dan gunakan konfigurasi environment/secret deployment.
- Uji kecocokan dimensi, metadata model/preprocessing, error input, dan ranking
  terhadap workbook lokal sebelum mengaktifkan pembacaan vector production.
- Anggap skor cosine sebagai skor kemiripan, bukan probabilitas.

### 11. Penggantian vector Turso untuk YOLO26s

Pengguna meminta folder `fastapi_preparation_turso/` untuk menyiapkan proses
membuat ulang dan mengganti vector baseline existing di Turso dengan vector
**edge-cropping + YOLO26s** untuk API Basehunt.

File:

- `fastapi_preparation_turso/pipeline_1_extract_edge_cropping_yolo26s.py`:
  membaca gambar dari `downloaded_images/`, memakai preprocessing bersama
  `edge_cropping/edge_cropping_preprocessing.py`, membuat embedding
  `yolo26s-cls.pt` (512 dimensi), dan menulis CSV lokal.
- `fastapi_preparation_turso/pipeline_2_upload_edge_cropping_yolo26s.py`:
  validasi CSV, dry-run lokal default, opsional preflight Turso baca-saja,
  dan upload eksplisit ke kolom `layouts.vector`.

Perlindungan uploader:

- Hanya menerima metadata model/preprocessing yang tepat, vector 512 dimensi,
  ID unik, vector finite, dan hasil ekstraksi lengkap. CSV yang dibuat dengan
  `--limit` ditandai parsial dan ditolak.
- `--check-turso` hanya membaca ID/vector dan memverifikasi semua target ID
  tersedia.
- Tidak menulis kecuali menerima `--apply --overwrite`.
- Sebelum upload membuat backup vector existing untuk seluruh ID target ke
  `fastapi_preparation_turso/backups/`; sesudah update, baca ulang dan
  verifikasi hasil. Replacement berhenti jika ada vector target lama yang
  kosong agar backup dapat mengembalikan semua nilai sebelumnya.
- Jika terjadi kegagalan parsial, backup ditampilkan agar dapat dipakai untuk
  pemulihan melalui uploader baseline
  `no preprocessing/pipeline_3_upload.py --apply --overwrite`.

Perintah ekstraksi penuh:

```powershell
.\.venv\Scripts\python.exe .\fastapi_preparation_turso\pipeline_1_extract_edge_cropping_yolo26s.py
```

Dry-run lokal:

```powershell
.\.venv\Scripts\python.exe .\fastapi_preparation_turso\pipeline_2_upload_edge_cropping_yolo26s.py
```

Preflight Turso baca-saja memakai `--check-turso`; replacement production
membutuhkan `--apply --overwrite`. Ekstraksi lokal lengkap menghasilkan CSV
205 baris unik, seluruhnya vector 512 dimensi dengan metadata YOLO26s dan
preprocessing konsisten. Vector CSV cocok persis dengan workbook eksperimen
YOLO26s; dry-run uploader lokal berhasil. Preflight Turso juga berhasil:
205 target ID ditemukan dan 205 vector lama terisi.

Pembaruan setelahnya: pengguna sendiri menjalankan preflight Turso, yang
menemukan 205 target ID dan 205 vector existing terisi, lalu menjalankan
`--apply --overwrite`. Log yang dibagikan pengguna menunjukkan backup dibuat
di
`fastapi_preparation_turso/backups/layouts_vector_before_yolo26s_20261020T213449286279Z.csv`,
semua 205 ID berhasil diperbarui, dan read-back berhasil memverifikasi vector
baru. Dengan demikian, menurut output tersebut, `layouts.vector` di Turso
sekarang berisi vector edge-cropping YOLO26s untuk 205 ID. Tidak ada indikasi
kolom lain diubah.

Replacement production selesai dan terverifikasi oleh uploader berdasarkan
log yang dibagikan pengguna.

## Pesan untuk asisten di chat berikutnya

Jika pengguna memulai chat baru, baca `catatan.md` ini sebelum melanjutkan.
Konteks paling baru: API FastAPI Basehunt sudah berhasil berjalan di HF Space
dan satu request live `POST /match` sukses membaca Turso serta menghasilkan
Top 5. Berikutnya implementasikan integrasi server-side ke project production
Next.js `3agang.pro/basehunt`; lihat `huggingfacedeployment.md`. API memakai
preprocessing edge + crop + mask isometrik + YOLO26s dan membaca vector
Turso. Build Space awal gagal menulis file download model karena izin
directory; Dockerfile diperbaiki dan pengguna mengonfirmasi startup sukses.
Pengguna telah menjalankan replacement vector Turso untuk 205 ID; output
uploader mengonfirmasi semua
update dan read-back berhasil. Vector `layouts.vector` sekarang seharusnya
memakai edge-cropping YOLO26s. Backup lama tersimpan di
`fastapi_preparation_turso/backups/layouts_vector_before_yolo26s_20261020T213449286279Z.csv`.

Pengguna telah menguji sekitar 10 gambar dengan UI YOLO26s edge-cropping; 8
base benar masuk Top 5 dan 2 gagal. Pengguna mengamati hasil memburuk bila
center bergeser jauh, aspect ratio layar berbeda, atau base diputar. Ini
observasi awal yang kemungkinan dipengaruhi gabungan crop/ROI/mask serta
embedding; catat kasus uji dan ranking ground truth sebelum menarik
kesimpulan.

- Pengguna ingin menguji gambar sendiri. Jangan menjalankan pipeline atau
  langkah berikutnya kecuali diminta secara eksplisit.
- Saat diminta menghitung ranking, pastikan gambar input yang dipakai dan ID
  base yang benar. Sebutkan bahwa hasil terikat pada isi gambar saat itu.
- Matcher edge default hanya mencetak Top 3. Untuk ID di luar Top 3, hitung
  ranking seluruh workbook, bukan menebak dari output Top 3.
- Jalankan Python proyek dengan
  `.\.venv\Scripts\python.exe`; Python sistem mungkin tidak memiliki
  dependensi proyek.
- Pertahankan eksperimen edge terpisah. Jangan mengganti workbook edge,
  vector grayscale/baseline, atau mengunggah vector ke Turso tanpa permintaan
  eksplisit.
- Gunakan konfigurasi edge yang konsisten: grayscale -> Gaussian blur 5x5 ->
  Canny 50/150 -> RGB. Database dan query harus memakai preprocessing yang
  sama.
- Jelaskan cosine similarity sebagai skor kemiripan embedding, bukan
  probabilitas.
- Bedakan observasi dari hipotesis. Jangan menyatakan urutan pengaruh scenery,
  wall, dan posisi bangunan sudah terbukti.
- Jangan tampilkan atau menyalin kredensial. `.env.local` bersifat privat.
