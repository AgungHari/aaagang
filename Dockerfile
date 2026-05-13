# Multi-stage build untuk Next.js 16
# Stage 1: Dependencies
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN \
  if [ -f package-lock.json ]; then npm ci --only=production; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile --production; \
  elif [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile --prod; \
  else npm install --only=production; \
  fi

# Stage 2: Builder
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; \
  else npm install; \
  fi
COPY . .

ARG TURSO_DATABASE_URL
ARG TURSO_AUTH_TOKEN

ENV TURSO_DATABASE_URL=$TURSO_DATABASE_URL
ENV TURSO_AUTH_TOKEN=$TURSO_AUTH_TOKEN

RUN npm run build

# Stage 3: Runtime
FROM node:22-alpine AS runner
WORKDIR /app

# Set environment
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy built application from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

EXPOSE 3000

# Start Next.js server
CMD ["node", "server.js"]

# Labels untuk GitHub Container Registry (GHCR)
LABEL org.opencontainers.image.title="AAA Gang Web"
LABEL org.opencontainers.image.description="Clash of Clans clan website dengan AI chatbot"
LABEL org.opencontainers.image.url="https://github.com/yourusername/aaagang"
LABEL org.opencontainers.image.source="https://github.com/yourusername/aaagang"
LABEL org.opencontainers.image.version="0.1.0"
LABEL org.opencontainers.image.vendor="AAA Gang"
LABEL org.opencontainers.image.authors="AAA Gang Team"
LABEL org.opencontainers.image.documentation="https://github.com/yourusername/aaagang"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.created="2026-05-13"
