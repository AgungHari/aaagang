# Panduan Deployment ke Hugging Face Spaces

## Prasyarat
- Akun Hugging Face
- Docker terinstall
- Repository GitHub dengan Dockerfile

## Langkah 1: Persiapkan next.config.ts

Pastikan `next.config.ts` support standalone:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // PENTING untuk Docker
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        pathname: '/**',
      },
      // ... host lain
    ],
  },
};

export default nextConfig;
```

## Langkah 2: Setup Environment Variables

Di Hugging Face Space > Settings > Repository secrets, tambahkan:

```
TURSO_DATABASE_URL=your_value
TURSO_AUTH_TOKEN=your_value
JWT_SECRET=your_value
COC_API_KEY=your_value
BASIC_BASE_URL=your_value
BASIC_API_KEY=your_value
SELF_HOSTED_BASE_URL=your_value
SELF_HOSTED_API_KEY=your_value
SELF_HOSTED_OLD_BASE_URL=your_value
SELF_HOSTED_OLD_API_KEY=your_value
ADMIN_USERNAME=your_value
ADMIN_PASSWORD=your_value
NEXT_PUBLIC_ADSENSE_ID=your_value
NEXT_PUBLIC_GA_ID=your_value
CLAN_TAG=your_value
```

## Langkah 3: Buat Hugging Face Space

1. Ke https://huggingface.co/spaces
2. Klik "Create new Space"
3. Pilih:
   - **Space name**: `aaagang` (atau nama lain)
   - **License**: MIT
   - **Space SDK**: Docker
   - **Visibility**: Public / Private

## Langkah 4: Upload Dockerfile

Opsi A: Via GitHub Integration
1. Di Hugging Face Space, pilih "Settings > Linked Repositories"
2. Connect dengan GitHub repository kamu
3. Pastikan Dockerfile ada di root directory

Opsi B: Manual Upload
1. Clone Space repository
2. Copy `Dockerfile` dan `.dockerignore` ke root
3. Push ke Space repository

## Langkah 5: Konfigurasi untuk GHCR (Optional)

Jika ingin push image ke GitHub Packages juga:

### Setup GitHub Actions (.github/workflows/docker-publish.yml):

```yaml
name: Publish Docker Image

on:
  push:
    branches: [ main ]
    tags: [ 'v*' ]
  pull_request:
    branches: [ main ]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

## Langkah 6: Deploy

Setelah push Dockerfile, Hugging Face akan:
1. Otomatis detect Dockerfile
2. Build image
3. Deploy ke Space URL

URL akan seperti: `https://huggingface.co/spaces/username/aaagang`

## Monitoring & Logs

- Logs terlihat di Space > App > Logs
- Jika ada error build, fix di repository dan push ulang
- Redeploy otomatis setiap push

## Notes Penting

### Port
- Hugging Face Spaces mengalokasikan port dinamis, tapi Dockerfile expose port 3000
- Container akan accessible di Space URL tanpa perlu spesifik port

### Environment Variables
- **WAJIB** set di Hugging Face Settings sebelum deploy
- Secret tidak terlihat di logs
- Jika ubah env vars, perlu redeploy manual atau trigger push baru

### Build Time
- First build bisa 5-10 menit (tergantung dependencies)
- Subsequent builds lebih cepat karena Docker layer caching

### Disk Space
- Hugging Face Spaces punya limit storage
- Jika `.next` cache terlalu besar, bisa clear di build step

### Database Connection
- Pastikan TURSO_DATABASE_URL accessible dari Space (jangan localhost)
- Turso support remote connections, jadi harusnya aman

## Troubleshooting

### Build gagal
1. Cek logs di Space > App > Logs
2. Pastikan `npm ci` atau `npm install` berhasil
3. Cek Node.js version kompatibel dengan dependencies

### Runtime error
1. Cek environment variables lengkap
2. Lihat logs runtime di Space
3. Pastikan external APIs (Turso, COC API, OpenAI) accessible

### Memory/Timeout
- Hugging Face Spaces punya resource limits
- Jika perlu lebih besar, upgrade ke paid tier

## Rollback

Jika push Dockerfile yang error:
1. Fix Dockerfile locally
2. Push ke repository
3. Hugging Face auto-redeploy
4. Monitor logs sampai selesai

Atau manual redeploy dari Hugging Face Settings > App > Restart
