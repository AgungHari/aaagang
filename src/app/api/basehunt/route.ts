import { createClient } from "@libsql/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_REQUEST_BYTES = MAX_IMAGE_BYTES + 64 * 1024;
const DEFAULT_BASEHUNT_API_URL = "https://agunghari2-llm111.hf.space";
const ALLOWED_IMAGE_TYPES = new Set([
  "image/avif",
  "image/bmp",
  "image/gif",
  "image/heic",
  "image/heif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

interface Match {
  id: number;
  score: number;
}

interface LayoutCardData {
  id: number;
  baseFileNumber: number;
  th_level: number;
  base_tag: string;
  copy_link: string;
  image_url: string;
  description: string;
  source_type: string;
  source_url: string;
  upload_date: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  is_active: number;
}

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

async function readBodyWithinLimit(request: Request): Promise<Uint8Array<ArrayBuffer> | null> {
  const reader = request.body?.getReader();
  if (!reader) return new Uint8Array();

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalBytes += value.byteLength;
      if (totalBytes > MAX_REQUEST_BYTES) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(new ArrayBuffer(totalBytes));
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}

function parseMatches(payload: unknown): Match[] | null {
  if (typeof payload !== "object" || payload === null || !("matches" in payload)) {
    return null;
  }

  const matches = payload.matches;
  if (!Array.isArray(matches) || matches.length > 5) return null;

  const parsed: Match[] = [];
  const seenIds = new Set<number>();

  for (const match of matches) {
    if (
      typeof match !== "object" ||
      match === null ||
      !("id" in match) ||
      !("score" in match) ||
      typeof match.id !== "number" ||
      !Number.isSafeInteger(match.id) ||
      match.id <= 0 ||
      typeof match.score !== "number" ||
      !Number.isFinite(match.score) ||
      seenIds.has(match.id)
    ) {
      return null;
    }

    seenIds.add(match.id);
    parsed.push({ id: match.id, score: match.score });
  }

  return parsed;
}

export async function POST(request: Request) {
  const apiKey = process.env.BASEHUNT_API_KEY;
  const apiUrl = process.env.BASEHUNT_API_URL ?? DEFAULT_BASEHUNT_API_URL;
  const databaseUrl = process.env.TURSO_DATABASE_URL;
  const databaseToken = process.env.TURSO_AUTH_TOKEN;

  if (!apiKey || !databaseUrl || !databaseToken) {
    return jsonError("Basehunt belum dikonfigurasi di server.", 503);
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return jsonError("Ukuran gambar maksimum 10 MiB.", 413);
  }

  let body: Uint8Array<ArrayBuffer> | null;
  try {
    body = await readBodyWithinLimit(request);
  } catch {
    return jsonError("Permintaan upload tidak valid.", 400);
  }
  if (!body) {
    return jsonError("Ukuran gambar maksimum 10 MiB.", 413);
  }

  let form: FormData;
  try {
    const contentType = request.headers.get("content-type");
    if (!contentType) return jsonError("Permintaan upload tidak valid.", 400);
    form = await new Response(body, {
      headers: { "Content-Type": contentType },
    }).formData();
  } catch {
    return jsonError("Permintaan upload tidak valid.", 400);
  }

  const image = form.get("image");
  if (!(image instanceof File) || image.size === 0) {
    return jsonError("Pilih file gambar terlebih dahulu.", 400);
  }
  if (image.size > MAX_IMAGE_BYTES) {
    return jsonError("Ukuran gambar maksimum 10 MiB.", 413);
  }
  if (!ALLOWED_IMAGE_TYPES.has(image.type.toLowerCase())) {
    return jsonError("Format gambar tidak didukung.", 400);
  }

  const upstreamForm = new FormData();
  upstreamForm.append("image", image, image.name || "basehunt-image");

  let upstream: Response;
  try {
    const endpoint = new URL("/match", apiUrl);
    if (endpoint.protocol !== "https:") {
      console.error("Basehunt inference service URL must use HTTPS.");
      return jsonError("Konfigurasi layanan pencarian tidak aman.", 503);
    }
    upstream = await fetch(endpoint, {
      method: "POST",
      headers: { "X-API-Key": apiKey },
      body: upstreamForm,
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(60_000),
    });
  } catch {
    console.error("Basehunt inference service request failed.");
    return jsonError("Layanan pencarian sedang tidak tersedia. Coba lagi sebentar.", 502);
  }

  if (!upstream.ok) {
    if (upstream.status === 400 || upstream.status === 413) {
      return jsonError(
        upstream.status === 413 ? "Ukuran gambar maksimum 10 MiB." : "Gambar tidak dapat diproses.",
        upstream.status,
      );
    }

    console.error(`Basehunt inference service returned HTTP ${upstream.status}.`);
    return jsonError("Layanan pencarian gagal memproses gambar. Coba lagi sebentar.", 502);
  }

  let upstreamPayload: unknown;
  try {
    upstreamPayload = await upstream.json();
  } catch {
    console.error("Basehunt inference service returned invalid JSON.");
    return jsonError("Respons layanan pencarian tidak valid.", 502);
  }

  const matches = parseMatches(upstreamPayload);
  if (!matches) {
    console.error("Basehunt inference service returned an invalid match list.");
    return jsonError("Format hasil pencarian tidak valid.", 502);
  }

  if (matches.length === 0) {
    return NextResponse.json({ matches, layouts: [] }, {
      headers: { "Cache-Control": "no-store" },
    });
  }

  let client: ReturnType<typeof createClient> | undefined;
  try {
    client = createClient({ url: databaseUrl, authToken: databaseToken });
    const placeholders = matches.map(() => "?").join(", ");
    const result = await client.execute({
      sql: `
        WITH ranked_layouts AS (
          SELECT
            id,
            ROW_NUMBER() OVER (ORDER BY upload_date ASC, id ASC) AS base_file_number
          FROM layouts
          WHERE is_active = 1
        ),
        comment_counts AS (
          SELECT layout_id, COUNT(*) AS comment_count
          FROM layout_comments
          WHERE is_visible = TRUE
          GROUP BY layout_id
        )
        SELECT
          layouts.id,
          ranked_layouts.base_file_number,
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
        INNER JOIN ranked_layouts ON ranked_layouts.id = layouts.id
        LEFT JOIN comment_counts ON comment_counts.layout_id = layouts.id
        WHERE layouts.id IN (${placeholders})
          AND layouts.is_active = 1
      `,
      args: matches.map(({ id }) => id),
    });

    const layoutsById = new Map<number, LayoutCardData>();
    for (const row of result.rows) {
      const id = Number(row.id);
      if (!Number.isSafeInteger(id) || Number(row.is_active) !== 1) continue;

      layoutsById.set(id, {
        id,
        baseFileNumber: Number(row.base_file_number),
        th_level: Number(row.th_level),
        base_tag: String(row.base_tag ?? ""),
        copy_link: String(row.copy_link ?? ""),
        image_url: String(row.image_url ?? ""),
        description: String(row.description ?? ""),
        source_type: String(row.source_type ?? ""),
        source_url: String(row.source_url ?? ""),
        upload_date: String(row.upload_date ?? ""),
        view_count: Number(row.view_count ?? 0),
        like_count: Number(row.like_count ?? 0),
        comment_count: Number(row.comment_count ?? 0),
        is_active: 1,
      });
    }

    const layouts = matches
      .map(({ id }) => layoutsById.get(id))
      .filter((layout): layout is LayoutCardData => layout !== undefined);

    return NextResponse.json({ matches, layouts }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    console.error("Basehunt Turso metadata lookup failed.");
    return jsonError("Data layout sedang tidak tersedia. Coba lagi sebentar.", 503);
  } finally {
    client?.close();
  }
}
