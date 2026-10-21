# Panduan Basehunt: FastAPI di Hugging Face Spaces dan integrasi Next.js

Panduan ini mendokumentasikan API Basehunt yang sudah dideploy ke HF Docker
Space dan langkah integrasi berikutnya ke `3agang.pro/basehunt`. Pengguna
telah menjalankan tes live `POST /match` dengan sukses. Implementasi Next.js
production masih perlu dibuat. Panduan tidak melakukan perubahan Turso.

## Status saat ini dan keputusan penting

- Vector untuk 205 layout sudah diunggah ke `layouts.vector` di Turso memakai
  edge-cropping + YOLO26s (512 dimensi). Menurut log pengguna, upload dan
  read-back verification berhasil.
- Pipeline ekstraksi dan uploader migration tetap di
  `fastapi_preparation_turso/`. Keduanya untuk migrasi vector, **bukan** untuk
  dijalankan sebagai bagian dari request API.
- Matcher Turso lokal ada di `input_match/app2.py`. Ia menggunakan
  `edge_cropping/edge_cropping_preprocessing.py`, model YOLO26s, dan query
  `layouts.vector` untuk menghitung Top 5.
- API ada di `basehunt-api/`, sudah dideploy ke HF Docker Space, dan telah
  lulus satu tes live `POST /match` melalui Swagger dengan HTTP 200.
- Base URL aktif: `https://agunghari2-llm111.hf.space`
  - Swagger UI: `https://agunghari2-llm111.hf.space/docs`
  - Health check: `https://agunghari2-llm111.hf.space/health`
  - Match: `POST https://agunghari2-llm111.hf.space/match`
- UI basehunt di Next.js tetap belum dibuat.
- Jangan jalankan ulang uploader dengan `--apply --overwrite` untuk
  membangun API. Request API hanya membaca vector Turso.

### Rekomendasi kontrak API

Respons mencantumkan ID terurut beserta cosine similarity:

```json
{
  "matches": [
    { "id": 508, "score": 0.9746 },
    { "id": 524, "score": 0.9720 }
  ],
  "model": "yolo26s-cls.pt",
  "count": 2
}
```

Contoh dipersingkat menjadi dua kandidat; endpoint production mengembalikan
maksimal lima. ID cukup untuk mencari kartu di Turso, sementara `score`
berguna untuk debugging atau menjelaskan urutan. Skor bukan probabilitas.
Frontend Next.js sebaiknya mengambil metadata kartu dari Turso sendiri, bukan
mempercayai metadata yang dikirim API pencarian.

### Tes live yang berhasil

Pada 21 Oktober 2026, pengguna mengirim `test_user_input.jpg` melalui Swagger
ke `POST /match`. API mengembalikan HTTP 200 setelah berhasil memuat YOLO26s
dan membaca vector Turso. Top 5 dari response tersebut:

| Rank | ID | Cosine similarity |
|---:|---:|---:|
| 1 | 524 | 0.971287 |
| 2 | 508 | 0.971120 |
| 3 | 470 | 0.970718 |
| 4 | 437 | 0.967740 |
| 5 | 488 | 0.964331 |

Response juga mencantumkan `model: yolo26s-cls.pt`, `count: 5`,
`input_format: JPEG`, dan `normalized_format: JPEG`. Ini membuktikan jalur
live untuk input yang diuji (upload → normalisasi → preprocessing/embedding →
Turso SELECT → ranking), bukan jaminan ranking atau latensi untuk semua gambar.

## Arsitektur alur request

1. Browser mengirim screenshot sebagai `multipart/form-data` ke route handler
   Next.js di domain `3agang.pro`.
2. Route handler memeriksa tipe dan ukuran file, lalu meneruskan bytes gambar
   ke endpoint FastAPI Hugging Face. API key disimpan di server Next.js dan
   tidak pernah dikirim ke browser.
3. FastAPI memvalidasi gambar, menjalankan preprocessing dan YOLO26s yang sama
   dengan generator vector, membaca vector aktif dari Turso, lalu menghitung
   Top 5.
4. Next.js menerima daftar ID/skor dan mengambil data layout aktif dari Turso.
5. Next.js mengirim data terpilih ke komponen client untuk menampilkan kartu
   dan link `/layout/{id}`.

```text
Browser --image--> Next.js Route Handler --image + server API key--> FastAPI Space
                       |                                          |
                       |                                          +-- read-only --> Turso vectors
                       +-- IDs/scores <-- Top 5 -------------------+
                       |
                       +-- lookup card metadata --> Turso
                       |
                       +-- cards --> Browser
```

Browser tidak menghubungi Hugging Face secara langsung. Dengan pola ini,
secret FastAPI dan kredensial Turso tidak masuk ke bundle JavaScript.

## 1. Pastikan sumber model dan aset siap

### Model YOLO26s

API harus memakai bobot yang sama dengan vector Turso dan prototipe:
`yolo26s-cls.pt`. Model harus menghasilkan embedding **512 dimensi**.
Jangan mengganti ke YOLO26n atau model lain tanpa membuat ulang seluruh vector
database dengan model dan preprocessing yang sama.

Pilihan paling sederhana untuk deployment saat ini adalah membiarkan Ultralytics
mengunduh `yolo26s-cls.pt` saat startup; pengguna sudah mengonfirmasi download
dan startup sukses. Alternatifnya, unggah bobot itu ke root repository Space
(Dockerfile dan `.dockerignore` sudah mengizinkan), atau gunakan Hugging Face
Model Repository dengan `MODEL_REPO_ID` dan revision yang dipin. Repo private
membutuhkan `HF_TOKEN` sebagai secret.

Periksa lisensi Ultralytics dan hak distribusi bobot sebelum menjadikan model
atau Space publik. Runtime Space mungkin perlu mengunduh ulang model setelah
container dibangun ulang atau penyimpanan sementara dibersihkan.

### Vector Turso

API cukup membaca `id`, `is_active`, dan `vector` dari `layouts`. Gunakan
database URL dan token yang sama seperti aplikasi, tetapi beri token Turso
akses sekecil mungkin dan **read-only** bila setup Turso mendukungnya. Jangan
pernah menaruh token di Dockerfile, README Space, Git, atau kode browser.

Di dalam FastAPI, validasi setiap vector:

- ID unik;
- 512 nilai numerik;
- seluruh nilai finite;
- hanya layout aktif yang ikut diranking;
- jumlah kandidat tidak kosong.

Jika validasi gagal, hentikan request dengan error yang jelas; jangan
meneruskan ranking dengan vector kosong atau tidak lengkap.

## 2. Buat repository Docker Space

Space pengguna sudah disiapkan. Pastikan SDK Space adalah **Docker**. Repositori
deploy sebaiknya hanya memuat file runtime yang dibutuhkan, bukan seluruh
workspace eksperimen atau `.env.local`.

Struktur awal yang disarankan:

```text
basehunt-api/
├── README.md
├── Dockerfile
├── requirements.txt
├── app.py
└── edge_cropping/
    ├── __init__.py
    └── edge_cropping_preprocessing.py
```

Salin preprocessing helper yang sama dari project ke folder `edge_cropping/`.
Jangan menyalin versi yang dimodifikasi tanpa meninjau ulang kesesuaiannya
dengan vector yang sudah ada.

### `README.md` Space

Front matter minimal untuk HF Docker Space:

```yaml
---
title: Basehunt API
sdk: docker
app_port: 7860
---
```

Tambahkan deskripsi pemakaian endpoint setelah front matter. Jangan masukkan
secret atau nilai environment sensitif di README.

## 3. Siapkan dependency dan Docker

Contoh awal `requirements.txt`:

```text
fastapi
uvicorn[standard]
python-multipart
Pillow
pi-heif
numpy
opencv-python
torch
ultralytics
libsql-client
huggingface_hub
```

Ini daftar dependency awal, bukan lockfile yang telah diuji untuk deployment.
Sebelum production, uji versi Python/dependency di Docker build dan pin versi
yang benar-benar berhasil. Template API menggunakan `opencv-python`, yang juga
memenuhi dependency Ultralytics; jangan menginstall `opencv-python-headless`
bersamaan karena keduanya menyediakan modul `cv2`.

Contoh `Dockerfile` awal untuk CPU:

```dockerfile
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PORT=7860

RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/* \
    && useradd --create-home --uid 1000 appuser \
    && mkdir -p /home/appuser/.cache/huggingface \
        /home/appuser/.config/Ultralytics \
        /home/appuser/app \
    && chown -R appuser:appuser /home/appuser

WORKDIR /home/appuser/app

RUN pip install --upgrade pip \
    && pip install --index-url https://download.pytorch.org/whl/cpu torch torchvision

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY --chown=appuser:appuser . .

USER appuser
EXPOSE 7860
CMD ["sh", "-c", "uvicorn app:app --host 0.0.0.0 --port ${PORT:-7860} --workers 1"]
```

Buat working directory dan cache yang digunakan runtime dimiliki user
`appuser`; jangan mengandalkan `WORKDIR` yang dibuat otomatis karena folder
tersebut bisa dimiliki root. Ini penting bila Ultralytics perlu mengunduh
bobot saat startup atau menulis konfigurasi/cache.

Mulai dengan CPU dan satu worker. Worker multiprocess dapat memuat beberapa
salinan model dan menghabiskan RAM. Pilih hardware yang tersedia dan ukur
waktu cold start serta waktu inferensi; bila CPU tidak mencukupi, evaluasi
hardware GPU dan sesuaikan image PyTorch/CUDA sesuai dokumentasi Spaces.

## 4. Konfigurasikan HF Secrets dan Variables

Di **Space → Settings → Variables and secrets**, tambahkan konfigurasi runtime.
Nama yang disarankan:

| Nama | Jenis | Kegunaan |
|---|---|---|
| `TURSO_DATABASE_URL` | Secret | URL database Turso |
| `TURSO_AUTH_TOKEN` | Secret | Token baca Turso |
| `BASEHUNT_API_KEY` | Secret | Kunci bersama antara Next.js server dan API |
| `MODEL_REPO_ID` | Variable | Repo model jika bobot di HF Hub |
| `MODEL_REVISION` | Variable | Revision/commit model yang tetap |
| `HF_TOKEN` | Secret, bila perlu | Membaca repo model private/gated |

Gunakan nama secret yang tepat; jangan mencetak nilainya di log. Simpan
`BASEHUNT_API_KEY` yang sama sebagai environment variable server-side di
platform hosting Next.js. Jangan gunakan prefix `NEXT_PUBLIC_` untuk API key,
Turso URL/token, atau token HF.

Jika memilih bobot model lokal dalam Docker Space, `MODEL_REPO_ID`,
`MODEL_REVISION`, dan `HF_TOKEN` tidak diperlukan. Pastikan model tidak
terbawa ke git secara tak sengaja.

## 5. Implementasikan FastAPI

Implementasi awal sudah disiapkan di folder terpisah `basehunt-api/`:

```text
basehunt-api/
├── README.md
├── Dockerfile
├── requirements.txt
├── app.py
├── .env.example
├── .gitignore
├── .dockerignore
├── edge_cropping/
│   └── edge_cropping_preprocessing.py
└── tests/
    └── test_app.py
```

Folder ini sengaja berdiri sendiri sebagai build context untuk HF Docker
Space. Preprocessing helper di dalam folder disalin dari
`edge_cropping/edge_cropping_preprocessing.py`; jika helper sumber diubah di
kemudian hari, salin perubahan yang sama ke folder API dan jalankan parity
test sebelum deploy.

API menerima multipart field `image` dalam format JPEG, PNG, WebP, BMP, GIF
(frame pertama), HEIC/HEIF, atau AVIF. Ia memeriksa ukuran upload (maksimum
10 MiB) dan limit dimensi, menerapkan orientasi EXIF, mengubah gambar ke RGB,
lalu meng-encode JPEG quality 95 (4:4:4) **di memory**. Byte JPEG itu dibuka
kembali dan baru kemudian diberikan ke preprocessing edge-cropping dan
YOLO26s. Transparansi dikomposit ke latar putih. Tidak ada file upload
dinormalisasi yang disimpan sebagai file persisten oleh kode aplikasi;
Starlette dapat memakai temporary spool internal untuk upload multipart.
Ada batas ukuran file dan batas ukuran keseluruhan request untuk multipart.
API mengembalikan `input_format` dan `normalized_format` agar konversi dapat
diverifikasi. JPEG yang masuk juga dinormalisasi ulang ke JPEG.

API hanya membaca vector aktif dari Turso. Kunci `BASEHUNT_API_KEY` wajib
untuk `/match`; `/health` tidak mengungkap secret dan memeriksa kesiapan model,
bukan ketersediaan Turso. Model dimuat dan menjalani pemeriksaan embedding
512-dimensi saat startup. Space live saat ini menggunakan jalur auto-download
Ultralytics untuk `yolo26s-cls.pt`; alternatif lokal/Model Repository
dijelaskan pada bagian model.

`requirements.txt` belum memuat PyTorch; Dockerfile memasang build PyTorch CPU
terpisah sebelum dependency aplikasi. Docker build lokal belum diuji karena
Docker CLI tidak tersedia. Uji live telah membuktikan startup model dan satu
request Turso berhasil, tetapi stress/load testing, latency/cold-start terukur,
serta negative-case test pada Space masih perlu dilakukan sebelum production.

Contoh build/test lokal dari PowerShell:

```powershell
docker build -t basehunt-api .\basehunt-api
docker run --rm -p 7860:7860 --env-file .\basehunt-api\.env basehunt-api
```

Buat file `.env` lokal dari `.env.example` dengan nilai sendiri dan jangan
pernah commit file itu. Jangan menjalankan container terhadap database
production sebelum siap; gunakan kredensial read-only dan validasi response.

Validasi unit di folder API (jalankan dari root repository setelah dependency
API tersedia):

```powershell
.\.venv\Scripts\python.exe -m unittest discover -s .\basehunt-api\tests
```

Implementasi API memisahkan tanggung jawab sebagai berikut:

- startup: cek environment, load model sekali, dan validasi model embedding;
- `GET /health`: status proses saja, tanpa menampilkan secret;
- `POST /match`: validasi gambar, preprocessing, embedding, read-only query,
  cosine ranking, respons JSON;
- autentikasi API key pada `POST /match`;
- error yang jelas dan tidak mengandung kredensial atau trace internal.

### Pemeriksaan saat startup

Pastikan `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, dan `BASEHUNT_API_KEY`
tersedia. Load model dari file atau HF Hub sekali ketika aplikasi dimulai,
bukan setiap request. Jalankan smoke check bahwa model tersedia dan
menghasilkan vector 512 dimensi. Jika startup check gagal, aplikasi harus
gagal start dengan pesan aman di log, bukan merespons hasil kosong.

Untuk request yang melakukan inferensi CPU dan query synchronous, gunakan
route FastAPI `def match(...)` (bukan `async def` yang memblokir event loop)
atau pindahkan kerja blocking ke threadpool secara eksplisit. Mulai satu
worker; konfigurasi beberapa worker hanya setelah mengukur RAM karena tiap
worker dapat memuat bobot model sendiri.

### Preprocessing dan embedding harus identik

Panggil helper yang sama dengan generator:

```python
from PIL import Image
from edge_cropping.edge_cropping_preprocessing import (
    DEFAULT_DIAMOND,
    DEFAULT_ROI,
    make_edge_cropped_images,
)

with Image.open(uploaded_file) as source:
    _, processed = make_edge_cropped_images(
        source,
        roi=DEFAULT_ROI,
        diamond=DEFAULT_DIAMOND,
    )

embeddings = model.embed(processed)
query_vector = embeddings[0].detach().cpu().flatten().float()
```

Helper menerapkan crop ROI, grayscale, Gaussian blur 5×5, Canny 50/150, lalu
mask diamond setelah edge detection. Pertahankan konfigurasi, urutan operasi,
model, dan dimensi ini. Tambahkan pemeriksaan `embeddings` tidak kosong,
panjang 512, dan nilai finite.

Validasi upload sebelum inferensi:

- batasi ukuran request (misalnya maksimum 10 MiB; sesuaikan dengan hosting);
- terima hanya format gambar yang dibutuhkan (JPEG/PNG/WebP);
- gunakan Pillow `verify()` lalu buka ulang untuk decoding;
- tangani gambar rusak dan ukuran/dimensi ekstrem sebagai `400`;
- jangan menyimpan gambar upload ke disk kecuali memang dibutuhkan.

Pastikan batas juga diterapkan di Next.js route handler. Jangan menganggap
`Content-Type` dari browser sebagai bukti file aman.

### Membaca Turso dan memberi ranking

Gunakan query parameter-free dan eksplisit:

```sql
SELECT id, vector
FROM layouts
WHERE is_active = 1
  AND vector IS NOT NULL
  AND TRIM(vector) != ''
```

Turso mengembalikan vector yang sekarang tersimpan sebagai teks angka
dipisahkan koma. Parse ke float, validasi 512 dimensi dan finite, lalu hitung
cosine similarity antara embedding request dan vector database. Urutkan skor
menurun dan ambil maksimal lima. Jangan mengembalikan vector ke caller.

Untuk koleksi 205 layout, membaca dan meranking semua vector per pencarian
merupakan implementasi awal yang sederhana. Ukur latensi nyata. Jika kemudian
perlu cache, tetapkan TTL/invalidation yang eksplisit agar perubahan vector,
status aktif, atau layout tidak membuat hasil stale tanpa batas. Tutup client
database setelah query bila client yang dipakai membutuhkan penutupan.

### Endpoint dan kode status

Kontrak awal:

```text
GET  /health
POST /match   multipart field: image
               header: X-API-Key: <server-side secret>
```

Contoh respons sukses:

```json
{
  "matches": [
    { "id": 508, "score": 0.9746 },
    { "id": 524, "score": 0.9720 },
    { "id": 470, "score": 0.9718 },
    { "id": 437, "score": 0.9694 },
    { "id": 495, "score": 0.9678 }
  ],
  "model": "yolo26s-cls.pt",
  "count": 5
}
```

Angka di atas hanya contoh dari uji prototipe, bukan hasil jaminan untuk
gambar lain.

Kembalikan kode status yang konsisten:

- `200`: pencarian berhasil, termasuk `matches: []` hanya bila secara sah
  tidak ada kandidat (sebaiknya kondisi DB kosong dinyatakan sebagai error
  konfigurasi `503`);
- `400` atau `422`: gambar/format input tidak valid;
- `401`: API key hilang atau salah;
- `413`: file terlalu besar;
- `503`: database atau model tidak tersedia;
- `500`: kegagalan internal yang tidak dapat diprediksi.

Jangan menangkap semua error lalu mengembalikan sukses dengan daftar kosong.
Log error teknis di server tanpa secret, path privat, atau isi gambar.

## 6. Uji lokal sebelum push ke Space

Jalankan semua pemeriksaan ini sebelum menghubungkan production:

1. **Preprocessing parity:** proses gambar yang sama melalui helper lokal dan
   container; pastikan bentuk/format hasil cocok.
2. **Embedding:** pastikan model menghasilkan 512 nilai finite.
3. **Vector check:** query Turso read-only, validasi semua vector aktif, dan
   pastikan jumlah kandidat sesuai kondisi saat tes.
4. **Ranking parity:** pakai screenshot yang sudah diuji di app2. Bandingkan
   urutan hasil FastAPI dengan app2. Perbedaan signifikan harus diselidiki
   sebelum deploy.
5. **Negative cases:** file rusak, format tidak didukung, file terlalu besar,
   secret salah, Turso gagal, vector salah dimensi.
6. **Docker smoke test:** build image dan jalankan lokal pada port 7860.
7. Periksa log dan source untuk memastikan secret tidak tercetak.

Contoh request lokal (sesuaikan nilai key dan path file di terminal sendiri):

```powershell
curl.exe -X POST "http://127.0.0.1:7860/match" `
  -H "X-API-Key: $env:BASEHUNT_API_KEY" `
  -F "image=@.\test_user_input.jpg"
```

Jangan kirim screenshot atau secret ke layanan pihak ketiga yang tidak
diotorisasi. Jangan menguji endpoint produksi dengan upload massal.

## 7. Deploy ke Hugging Face Spaces

Status deploy: selesai untuk API awal. HF Space `agunghari2-llm111` dilaporkan
running; `/health` mengembalikan 200 dan tes live `/match` berhasil. Build
awal mengunduh model tetapi gagal menulis `.part` karena izin working
directory. Dockerfile diperbaiki dengan writable `/home/appuser/app`, lalu
startup berikutnya sukses. Implementasi UI/route Next.js belum dilakukan.

### Siapkan source untuk repository Space

Folder [basehunt-api/](./basehunt-api/) adalah Docker build context mandiri.
Isi foldernya (README, Dockerfile, requirements, `app.py`, dan folder
`edge_cropping/`) harus berada di **root repository Space**, karena Docker
build membaca Dockerfile dan file dengan path relatif dari root Space.
Jangan push root repository eksperimen `basefinder` sebagai Space; di sana ada
`.env.local`, dataset, dan file lain yang tidak dibutuhkan. `.env.example`
hanya contoh nama variable tanpa kredensial dan bukan konfigurasi runtime.

### Push source

1. Docker Space pengguna sudah dibuat; repository harus memiliki `README.md`
   dengan `sdk: docker`.
2. Salin isi `basehunt-api/` ke root repository Space: `app.py`, `Dockerfile`,
   `requirements.txt`, README, serta helper preprocessing.
3. Periksa `.gitignore`: pastikan `.env.local`, token, gambar pengguna,
   workbook/CSV vector, dan kredensial tidak ikut ter-push.
4. Push ke repository Space dengan Git. Bobot model bisa di-auto-download,
   diletakkan di root repo Space, atau diambil dari Model Repository.
5. Tambahkan Space Secrets/Variables melalui Settings, lalu pantau tab
   **Build logs** dan **Logs**.

Dokumentasi resmi Docker Spaces menyebut `sdk: docker` pada YAML README,
port default `7860`, secrets/runtime environment, serta user non-root.
Dokumentasi: [Docker Spaces](https://huggingface.co/docs/hub/spaces-sdks-docker)
dan [Space secrets overview](https://huggingface.co/docs/hub/spaces-overview#managing-secrets).

### Uji endpoint Space

1. Tunggu build berstatus Running.
2. Panggil `GET /health`; response tidak boleh menyertakan konfigurasi rahasia.
3. Panggil `POST /match` dengan satu screenshot dan `X-API-Key` yang benar.
4. Pastikan lima ID/skor terurut, semua ID ada di layout aktif, dan latency
   cold start/normal tercatat.
5. Uji key yang salah, file rusak, dan file terlalu besar; harus ditolak.
6. Periksa log bahwa tidak ada secret, token, vector, atau isi upload.
7. Uji restart/rebuild: model harus bisa dimuat kembali dan API pulih.

Jika startup log menampilkan `Downloading ... yolo26s-cls.pt` lalu
`Permission denied` untuk file sementara `.yolo26s-cls.pt.*.part`, biasanya
model tidak ditemukan di image dan proses mencoba auto-download, tetapi
working directory tidak writable oleh user Space. Pastikan Dockerfile terbaru
membuat/chown `/home/appuser/app`, lalu rebuild Space. Jika memang mengunggah
bobot lokal, pastikan `yolo26s-cls.pt` muncul di root repository Space,
`.dockerignore` memiliki pengecualian `!yolo26s-cls.pt`, dan Dockerfile
menjalankan `COPY --chown=appuser:appuser . .`. Setelah update Dockerfile/
`.dockerignore`, lakukan commit/push dan tunggu rebuild penuh.

Perhatikan bahwa file lokal di container Space bersifat sementara saat restart.
Gunakan HF Hub sebagai lokasi bobot yang dapat diunduh ulang atau storage
persisten jika dibutuhkan. Spaces dapat memiliki perilaku tidur/hibernasi dan
cold start sesuai hardware/konfigurasi; siapkan UI untuk menampilkan status
loading/error dan jangan mengasumsikan endpoint selalu merespons seketika.

## 8. Tambahkan integrasi server-side ke Next.js

Di repository aplikasi Next.js, tambahkan environment server-side:

```text
BASEHUNT_API_URL=https://agunghari2-llm111.hf.space
BASEHUNT_API_KEY=<secret-yang-sama-dengan-space>
```

Atur lewat secret manager platform web hosting. Jangan pakai nama
`NEXT_PUBLIC_BASEHUNT_API_KEY`. Hanya server route handler yang membaca
secret ini.

### Route handler proxy

Buat route handler App Router, misalnya `app/api/basehunt/route.ts`. Route
handler sebaiknya:

1. Menerima `FormData` dengan field `image`.
2. Memvalidasi file, MIME type, dan ukuran maksimal.
3. Mengirim bytes ke `${BASEHUNT_API_URL}/match` dengan `X-API-Key`.
4. Memberi timeout yang masuk akal, lalu memetakan kegagalan upstream menjadi
   error yang aman untuk UI.
5. Mengembalikan JSON matches saja; jangan forward header internal atau
   kredensial.

Skeleton:

```ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const apiUrl = process.env.BASEHUNT_API_URL;
  const apiKey = process.env.BASEHUNT_API_KEY;

  if (!apiUrl || !apiKey) {
    return NextResponse.json(
      { error: "Basehunt belum dikonfigurasi." },
      { status: 503 },
    );
  }

  const form = await request.formData();
  const image = form.get("image");
  if (!(image instanceof File) || image.size === 0) {
    return NextResponse.json(
      { error: "Pilih file gambar terlebih dahulu." },
      { status: 400 },
    );
  }
  if (image.size > 10 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Ukuran gambar maksimum 10 MiB." },
      { status: 413 },
    );
  }

  const upstreamForm = new FormData();
  upstreamForm.append("image", image, image.name);

  let upstream: Response;
  try {
    upstream = await fetch(`${apiUrl.replace(/\/$/, "")}/match`, {
      method: "POST",
      headers: { "X-API-Key": apiKey },
      body: upstreamForm,
      cache: "no-store",
      signal: AbortSignal.timeout(60_000),
    });
  } catch {
    return NextResponse.json(
      { error: "Layanan pencarian sedang tidak tersedia." },
      { status: 502 },
    );
  }

  if (!upstream.ok) {
    const status = upstream.status === 400 || upstream.status === 413
      ? upstream.status
      : 502;
    return NextResponse.json(
      { error: "Gagal memproses gambar. Coba lagi sebentar." },
      { status },
    );
  }

  let result: unknown;
  try {
    result = await upstream.json();
  } catch {
    return NextResponse.json(
      { error: "Layanan pencarian mengirim respons yang tidak valid." },
      { status: 502 },
    );
  }

  if (
    typeof result !== "object" ||
    result === null ||
    !("matches" in result) ||
    !Array.isArray(result.matches)
  ) {
    return NextResponse.json(
      { error: "Format respons layanan pencarian tidak valid." },
      { status: 502 },
    );
  }

  return NextResponse.json(result, {
    headers: { "Cache-Control": "no-store" },
  });
}
```

Tambahkan pemeriksaan MIME type di route, tetapi validasi gambar sebenarnya
tetap wajib di FastAPI. Sesuaikan batas body/timeout dengan limit hosting
Next.js. Jangan expose pesan exception dari upstream kepada browser. Jika
hosting Next.js tidak mendukung `AbortSignal.timeout`, gunakan pola timeout
yang didukung runtime/version project.

### Ambil metadata hasil dari Turso

UI hanya memerlukan lima kartu. Setelah mendapat `matches`, query metadata
berdasarkan daftar ID dengan parameter binding. Query server-side sebaiknya
membatasi hasil aktif:

```sql
SELECT
  layouts.id,
  layouts.th_level,
  layouts.base_tag,
  layouts.copy_link,
  layouts.image_url,
  layouts.description,
  layouts.source_type,
  layouts.source_url,
  layouts.upload_date,
  layouts.view_count,
  layouts.like_count,
  COALESCE(comment_counts.comment_count, 0) AS comment_count,
  layouts.is_active
FROM layouts
LEFT JOIN (
  SELECT layout_id, COUNT(*) AS comment_count
  FROM layout_comments
  WHERE is_visible = TRUE
  GROUP BY layout_id
) AS comment_counts ON comment_counts.layout_id = layouts.id
WHERE layouts.id IN (?, ?, ?, ?, ?)
  AND layouts.is_active = 1
```

Gunakan API `@libsql/client` yang sudah dipakai `page.tsx`, dengan binding
parameter (jangan menyusun nilai ID langsung ke SQL). Hasil database mungkin
berurutan berbeda dari ranking API; susun ulang hasil metadata menurut urutan
`matches[].id`. Buang ID yang sudah tidak aktif/tidak ditemukan. Jangan
menampilkan vector ke browser.

App Router handler secara default berjalan server-side, sehingga query Turso
dapat dilakukan di route yang sama setelah pencarian; alternatifnya buat
server action. Pilih satu alur dan jangan mengirim token Turso ke komponen
client.

## 9. Buat UI upload dan kartu Top 5

Komponen client dapat:

- menyimpan `File` terpilih;
- menampilkan preview lokal;
- mengirim `FormData` ke `/api/basehunt`;
- menampilkan state loading/error/no matches;
- menampilkan lima kartu dalam urutan ranking;
- tombol reset mengosongkan file, preview, dan hasil.

Data kartu yang tersedia sudah sesuai dengan props `LayoutCard` di project:
`id`, `th_level`, `base_tag`, `copy_link`, `image_url`, `description`,
`source_type`, `source_url`, `upload_date`, `view_count`, `like_count`,
`comment_count`, dan `is_active`. Komponen yang ada adalah
`LayoutCard.tsx`; gunakan ulang bila styling dan interaksi cocok. Link detail
yang dipakai sekarang adalah `/layout/{id}`.

Perlu adapter untuk field tambahan seperti `baseFileNumber`, `isNewest`, dan
`isPriority` bila `LayoutCard` memerlukannya. Jangan menganggap skor sama
dengan persentase kepastian; bila ditampilkan, labeli sebagai similarity.
Komponen `LayoutsFilter.tsx` saat ini mengatur koleksi/filter halaman layout,
bukan pencarian screenshot. Buat UI Basehunt sebagai komponen terpisah, lalu
tempatkan pada route/section yang sesuai dengan struktur Next.js production.

Contoh fetch client:

```ts
const form = new FormData();
form.append("image", file);

const response = await fetch("/api/basehunt", {
  method: "POST",
  body: form,
});
const payload = await response.json();

if (!response.ok) {
  throw new Error(payload.error ?? "Pencarian gagal.");
}
```

Jangan menambahkan header `Content-Type` manual saat mengirim `FormData`;
browser harus menetapkan multipart boundary.

## 10. Proteksi production, monitoring, dan perilaku kegagalan

- API key FastAPI hanya pertahanan dasar antar server, bukan pengganti
  rate-limit, quota, atau kontrol akses platform.
- Terapkan rate limiting per user/IP di Next.js/edge platform agar endpoint
  Space tidak menjadi target request publik tanpa batas.
- Batasi ukuran request baik di Next.js maupun FastAPI dan gunakan timeout.
- Jangan log screenshot, token, API key, auth header, atau vector lengkap.
- Tampilkan pesan loading yang mengantisipasi cold start HF.
- Bedakan kesalahan input (minta gambar lain) dari error upstream/database
  (tawarkan retry).
- Jika model/database tidak siap, jangan fallback diam-diam ke model lama,
  vector kosong, atau ranking palsu.
- Gunakan monitoring uptime/latency dan alarm untuk error 5xx.
- Simpan screenshot yang dipakai untuk debugging hanya bila ada izin dan
  kebijakan retensi yang jelas.
- Gunakan HTTPS; jangan aktifkan CORS wildcard hanya untuk membuat browser
  dapat mengakses Space langsung. Dengan server-to-server proxy, CORS langsung
  tidak diperlukan.

## 11. Checklist rilis bertahap

### Tahap A — parity lokal

- [x] API startup memvalidasi model menghasilkan embedding finite 512 dimensi.
- [x] Preprocessing helper API identik dengan helper generator vector.
- [ ] Bandingkan ranking beberapa screenshot known-good dengan
  `input_match/app2.py`.
- [x] Query live yang diuji hanya membaca Turso; kode tidak memakai SQL
  `UPDATE`, `INSERT`, atau `DELETE`.
- [x] Invalid image, ukuran besar, vector invalid, API key salah, dan
  kegagalan Turso diuji lewat unit/integration tests dengan dependency palsu.
- [x] Satu screenshot berhasil melewati jalur live `/match` hingga Top 5.

### Tahap B — HF Space

- [x] HF Space Docker build/start berhasil menurut log runtime yang dibagikan.
- [x] `/health` mengembalikan 200; satu `/match` dengan key benar mengembalikan 200.
- [ ] Konfirmasi final rotasi secret yang pernah terekspos; simpan hanya di
  Space Settings dan secret manager, bukan source/build logs.
- [ ] Uji key salah dan input tidak valid di deployed Space (unit tests lokal
  sudah menguji jalur tersebut).
- [ ] Ukur cold start, RAM, latensi, dan restart/rebuild.

### Tahap C — Next.js staging

- [ ] Environment API hanya tersedia server-side.
- [ ] Route handler meneruskan upload tanpa membocorkan API key.
- [ ] Metadata Turso difilter `is_active = 1` dan diurutkan sesuai ranking.
- [ ] UI menampilkan Top 5, loading, error, empty state, dan Reset.
- [ ] Tidak ada token Turso/API yang terdeteksi di browser bundle/network response.

### Tahap D — production

- [ ] Deploy dengan feature flag atau akses terbatas dahulu.
- [ ] Pantau tingkat error dan waktu respons.
- [ ] Uji satu screenshot nyata dengan izin, bandingkan ranking dengan app2.
- [ ] Aktifkan untuk pengguna setelah jalur rollback dan monitoring siap.

## Dokumentasi rujukan

- [Hugging Face Docker Spaces](https://huggingface.co/docs/hub/spaces-sdks-docker)
- [Hugging Face Spaces overview dan secrets](https://huggingface.co/docs/hub/spaces-overview#managing-secrets)
- [FastAPI in Docker](https://fastapi.tiangolo.com/deployment/docker/)
- [Hugging Face Hub download guide](https://huggingface.co/docs/huggingface_hub/guides/download)

Dokumentasi platform dapat berubah. Sebelum deploy, cek ulang pengaturan port,
hardware, batas request, waktu tidur/cold start, dan metode pengelolaan secrets
yang berlaku untuk Space serta hosting Next.js yang dipakai.
