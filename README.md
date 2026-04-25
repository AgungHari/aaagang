
[![web-banner](thumbnail2.webp)](https://www.3agang.pro/)

# AAA GANG Dashboard

A production-ready Next.js application for the AAA GANG Clash of Clans community. The site displays clan statistics, member details, current war status, and includes an interactive chat assistant for clan-related questions.

## Features

### Public Features
- Clan overview with live war status and performance highlights
- Member leaderboards for donations, trophies, and engagement
- **Base Layouts Gallery** - Community-contributed base layouts with filtering by TH level
- Responsive dark UI with modern, minimalist styling
- Interactive chat interface with local storage support
- Static asset handling via `public` directory for optimized badge loading
- Tailwind CSS styling with custom layouts and transitions

### Admin Features
- **Admin Dashboard** - Manage base layouts with full CRUD operations
- **Authentication** - JWT-based admin login with rate limiting (5 attempts per 15 minutes)
- **Layout Management** - Create, read, update, and delete base layouts
- **Content Metadata** - Track views, likes, source URLs, and upload dates
- **Markdown Support** - Rich descriptions with markdown formatting for layout details

## Setup

### Requirements

- Node.js 20 or newer
- npm

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser to preview the app.

## Technology

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- `lucide-react` for iconography
- `react-markdown` for formatted chat responses


## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
COC_API_KEY=your_clash_api_key
CLAN_TAG=%23YOUR_CLAN_TAG
MISTRAL_API_KEY=your_mistral_api_key
TURSO_DATABASE_URL=your_turso_database_url
TURSO_AUTH_TOKEN=your_turso_auth_token
JWT_SECRET=your_jwt_secret_key
ADMIN_USERNAME=admin_username
ADMIN_PASSWORD=admin_password
```

- `COC_API_KEY` is used to fetch clan and player data via the Clash of Clans proxy API.
- `CLAN_TAG` identifies the clan used by the dashboard.
- `MISTRAL_API_KEY` is used by the chat endpoint when an AI assistant backend is configured.
- `TURSO_DATABASE_URL` & `TURSO_AUTH_TOKEN` - Turso SQLite database credentials for base layouts storage.
- `JWT_SECRET` - Secret key for JWT token signing (admin authentication).
- `ADMIN_USERNAME` & `ADMIN_PASSWORD` - Admin credentials for dashboard login.

## Database Setup

### Turso SQLite Database

This project uses **Turso** (SQLite edge database) to store base layouts. The `layouts` table schema:

```sql
CREATE TABLE layouts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  th_level INTEGER NOT NULL,
  base_tag TEXT NOT NULL,
  copy_link TEXT NOT NULL,
  image_url TEXT,
  description TEXT,
  source_type TEXT,
  source_url TEXT,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);
```

**Columns:**
- `th_level` - Town Hall level (1-16)
- `base_tag` - Unique base identifier/name
- `copy_link` - In-game copy link for the layout
- `image_url` - Preview image URL
- `description` - Markdown-formatted layout description
- `source_type` - Source type (youtube, reddit, custom, etc)
- `source_url` - External source URL
- `view_count` - Number of times layout was viewed
- `like_count` - Number of likes received
- `upload_date` - Timestamp when layout was added
- `is_active` - Boolean to soft-delete layouts

### Admin Dashboard Access

**Routes:**
- `/admin/login` - Admin login page
- `/admin/dashboard` - Layout management dashboard (protected)
- `/admin/dashboard/new` - Create new layout (protected)
- `/admin/dashboard/edit/[id]` - Edit layout (protected)

**Authentication:**
- JWT-based session management
- Rate limiting: 5 login attempts per 15 minutes
- HttpOnly cookies for token storage
- Admin access requires valid credentials from environment variables

## Clash of Clans API Key Setup

1. Create an API key on the official Clash of Clans developer portal: https://developer.clashofclans.com/#/
2. If your server does not have a static IP address, use RoyaleAPI proxy. This proxy is especially useful for deployments that cannot maintain a fixed IP.
3. Whitelist the proxy IP address: `45.79.218.79`.
4. Substitute the official API domain with the proxy domain for Clash of Clans:
   - Official API: `https://api.clashofclans.com`
   - Proxy API: `https://cocproxy.royaleapi.dev`

For more details, see the RoyaleAPI proxy documentation:
- https://docs.royaleapi.com/proxy.html

### Proxy Usage Example

Use the proxy URL to call Clash of Clans endpoints with your official key:

```bash
curl -H "Authorization: Bearer YOUR_KEY" \
  https://cocproxy.royaleapi.dev/v1/clans/%23YOUR_CLAN_TAG
```

The same pattern applies to other Supercell game proxies:

- Clash Royale API proxy: `https://proxy.royaleapi.dev`
- Clash of Clans API proxy: `https://cocproxy.royaleapi.dev`
- Brawl Stars API proxy: `https://bsproxy.royaleapi.dev`

## Self-hosted LLM

This project can also connect to a self-hosted LLM backend. One example deployment is available on Hugging Face Spaces:

- https://agunghari2-llm-ministral3b-selfhosted.hf.space/
- https://huggingface.co/AgungHari2

A sample Dockerfile for a self-hosted `llama.cpp`-based model server:

```dockerfile
FROM ghcr.io/ggml-org/llama.cpp:server

WORKDIR /app

ENV PORT=7860
ENV HOST=0.0.0.0

USER root

RUN apt-get update && apt-get install -y curl && \
    curl -L https://huggingface.co/bartowski/mistralai_Ministral-3-3B-Instruct-2512-GGUF/resolve/main/mistralai_Ministral-3-3B-Instruct-2512-Q2_K.gguf -o /app/model.gguf && \
    chmod 777 /app/model.gguf

RUN echo '#!/bin/bash\
SERVER_PATH=$(which llama-server || find / -name llama-server 2>/dev/null | head -n 1)\
echo "Executing: $SERVER_PATH"\
exec $SERVER_PATH -m /app/model.gguf --host 0.0.0.0 --port 7860 -c 4096 --n-gpu-layers 0\
' > /app/start.sh && chmod +x /app/start.sh

ENTRYPOINT ["/bin/bash", "/app/start.sh"]
```

If you use this setup, configure the dashboard chat backend to point to the self-hosted model server.

For the exact HF Space call pattern and chat integration, review `src/app/api/chat/route2.txt`, especially the `baseURL` and API key usage for `https://agunghari2-llm.hf.space/v1`.

## SEO & Sitemap

The project includes an automatically generated `sitemap.xml` at `/sitemap.xml` for search engine indexing.

**Sitemap Priority & Update Frequency:**
- Homepage `/` - Priority 1.0, daily
- `/layout` - Priority 0.9, daily (frequently updated base layouts)
- `/warlog` - Priority 0.8, daily
- `/members` - Priority 0.8, weekly (member roster updates)
- `/sigma` - Priority 0.6, never (static AI assistant)
- `/tentang` - Priority 0.3, monthly (static info page)

**Admin routes** (`/admin/*`) are excluded from sitemap as they require authentication.

## Build and Production

Build the application for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Repository Structure

```
src/
├── app/                           # Next.js app router
│   ├── admin/                     # Protected admin routes
│   │   ├── action.ts              # Admin login action
│   │   ├── dashboard/             # Dashboard page
│   │   │   ├── action.ts          # Update/delete layout actions
│   │   │   ├── page.tsx           # Dashboard main page
│   │   │   ├── edit/              # Edit layout route
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx   # Layout editor page
│   │   │   └── new/               # Create layout route
│   │   │       ├── action.ts      # Create layout action
│   │   │       └── page.tsx       # New layout form
│   │   └── login/
│   │       └── page.tsx           # Admin login page
│   ├── api/                       # API routes
│   │   ├── chat/                  # Chat API endpoint
│   │   │   └── route.ts           # Chat route handler
│   │   └── proxy/                 # Turso database proxy
│   │       └── route.ts           # Authenticated DB queries
│   ├── layout/                    # Base layouts routes
│   │   ├── action.ts              # View/like count actions
│   │   ├── page.tsx               # Layouts gallery page
│   │   └── [id]/
│   │       └── page.tsx           # Layout detail page
│   ├── members/                   # Members routes
│   │   ├── page.tsx               # Members list page
│   │   └── [tag]/
│   │       └── page.tsx           # Member filter by tag
│   ├── sigma/                     # AI chat page
│   │   ├── ChatInterface.tsx      # Chat component
│   │   └── page.tsx               # Chat interface page
│   ├── warlog/                    # War log routes
│   │   └── page.tsx               # War log page
│   ├── tentang/                   # About/Info routes
│   │   └── page.tsx               # About page
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   ├── not-found.tsx              # 404 page
│   ├── page.tsx                   # Homepage
│   └── sitemap.ts                 # SEO sitemap
├── components/                    # Reusable React components
│   ├── AboutCard.tsx              # About section cards
│   ├── ClanCapitalCard.tsx        # Clan capital info
│   ├── ConsoleLogger.tsx          # Debug console
│   ├── Footer.tsx                 # Site footer
│   ├── HallOfFame.tsx             # Top players display
│   ├── LayoutCard.tsx             # Base layout card component
│   ├── LeaderboardCard.tsx        # Leaderboard display
│   ├── LikeButton.tsx             # Like functionality button
│   ├── Navbar.tsx                 # Navigation bar
│   ├── ScrollReveal.tsx           # Scroll animation wrapper
│   ├── SectionDivider.tsx         # Section separator
│   ├── SectionTitle.tsx           # Section title component
│   ├── TiltImage.tsx              # 3D tilt image effect
│   ├── TimelineItem.tsx           # Timeline event item
│   ├── WarLogCard.tsx             # War log card display
│   ├── WarStatusCard.tsx          # War status info
│   ├── WarTestimonial.tsx         # War testimonial section
│   └── WarTestimonialCard.tsx     # Individual testimonial
├── constants/
│   └── league.ts                  # League & trophy constants
└── lib/                           # Utility functions & helpers
    ├── coc.ts                     # Clash of Clans API client
    ├── mockData.ts                # Mock data for development
    ├── player.ts                  # Player utility functions
    └── rateLimit.ts               # Rate limiting implementation

public/                            # Static assets
├── robots.txt                     # SEO robots file
├── site.webmanifest              # PWA manifest
└── fonts/                         # Custom fonts
```


## Notes

- The `Navbar` component references clan badge images from the `public/` folder.
- Chat history is persisted locally in the browser using local storage.
- **Like tracking** uses browser `localStorage` to prevent duplicate likes from the same user.
- **View tracking** increments server-side in the database when a layout is viewed.
- Base layout descriptions support **Markdown formatting** for rich content display (bold, headings, lists, etc).
- Layout images are optimized via Next.js `Image` component for performance.
- The project is compatible with modern deployment platforms such as Vercel.
- Rate limiting is implemented in-memory; for production with multiple servers, consider using Redis-based rate limiting.



## License

This project is licensed under the MIT License. See the `LICENSE` file for full terms and permissions.
