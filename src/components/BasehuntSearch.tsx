"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  ImagePlus,
  LoaderCircle,
  RotateCcw,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import BrowserVideo from "@/components/BrowserVideo";
import LayoutCard from "@/components/LayoutCard";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = new Set([
  "image/avif",
  "image/bmp",
  "image/gif",
  "image/heic",
  "image/heif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);
const ACCEPT_ATTRIBUTE = [
  ".avif",
  ".bmp",
  ".gif",
  ".heic",
  ".heif",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
].join(",");

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

interface SearchResponse {
  matches: Match[];
  layouts: LayoutCardData[];
}

function formatFileSize(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MiB`;
}

export default function BasehuntSearch() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SearchResponse | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (result) {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  function selectImage(selected: File | undefined) {
    if (!selected || loading) return;
    setError(null);
    setResult(null);

    if (!ACCEPTED_IMAGE_TYPES.has(selected.type.toLowerCase())) {
      setFile(null);
      setError("Pilih gambar JPEG, PNG, WebP, BMP, GIF, HEIC, HEIF, atau AVIF.");
      return;
    }
    if (selected.size === 0) {
      setFile(null);
      setError("File gambar kosong. Pilih gambar lain.");
      return;
    }
    if (selected.size > MAX_IMAGE_BYTES) {
      setFile(null);
      setError("Ukuran gambar maksimum 10 MiB.");
      return;
    }

    setFile(selected);
  }

  async function searchForMatches() {
    if (!file || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const form = new FormData();
      form.append("image", file);

      const response = await fetch("/api/basehunt", {
        method: "POST",
        body: form,
      });
      let payload: unknown;
      try {
        payload = await response.json();
      } catch {
        throw new Error("Respons server tidak valid. Coba lagi sebentar.");
      }

      if (!response.ok) {
        const message =
          typeof payload === "object" &&
          payload !== null &&
          "error" in payload &&
          typeof payload.error === "string"
            ? payload.error
            : "Pencarian gagal. Coba lagi sebentar.";
        throw new Error(message);
      }

      if (
        typeof payload !== "object" ||
        payload === null ||
        !("matches" in payload) ||
        !Array.isArray(payload.matches) ||
        !("layouts" in payload) ||
        !Array.isArray(payload.layouts)
      ) {
        throw new Error("Respons pencarian tidak valid. Coba lagi.");
      }

      setResult(payload as SearchResponse);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Pencarian gagal. Periksa koneksi lalu coba lagi.",
      );
    } finally {
      setLoading(false);
    }
  }

  function resetSearch() {
    setFile(null);
    setResult(null);
    setError(null);
    setDragging(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <>
      <section className="relative isolate overflow-hidden px-5 pb-12 pt-32 sm:px-8 sm:pb-16 md:pt-40">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(245,158,11,0.13),transparent_52%)]" />
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/[0.06] px-3.5 py-2 text-[9px] font-black uppercase tracking-[0.24em] text-amber-300 sm:text-[10px]">
              <ScanLine size={14} />
              AAA GANG · VISUAL BASE SEARCH
            </div>
            <h1 className="text-5xl font-black uppercase italic leading-[0.92] tracking-tight text-white sm:text-6xl md:text-6xl" style={{ fontFamily: "'Docallisme', sans-serif" }}>
              FIND YOUR
              <br />
              <span className="text-amber-400">NEXT BASE</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
              Unggah screenshot base Clash of Clans. Basehunt akan mencari lima layout aktif yang paling mirip dari koleksi kami.
            </p>
          </div>

          <section
            aria-labelledby="basehunt-tutorial-title"
            className="mx-auto mt-9 max-w-5xl overflow-hidden rounded-[1.75rem] border border-zinc-800/80 bg-gradient-to-br from-zinc-950 via-zinc-950 to-amber-950/15"
          >
            <div className="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
              <div className="relative aspect-video min-h-52 overflow-hidden border-b border-zinc-800/70 bg-zinc-950 lg:border-b-0 lg:border-r">
                <BrowserVideo
                  src="/Basehunt.webm"
                  safariSrc="/Basehunt_Safari.mov"
                  controls
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-3 right-3 rounded-md border border-white/10 bg-black/65 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.15em] text-zinc-300 backdrop-blur">
                  how to use basehunt
                </span>
              </div>

              <div className="flex flex-col justify-center p-5 sm:p-7">
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-amber-400">
                  Panduan Basehunt
                </p>
                <h2
                  id="basehunt-tutorial-title"
                  className="mt-2 text-2xl font-black uppercase italic leading-tight text-white sm:text-3xl"
                  style={{ fontFamily: "'Docallisme', sans-serif" }}
                >
                  Tiga langkah
                  <br />
                  <span className="text-amber-400">cari base</span>
                </h2>
                <ol className="mt-5 space-y-3">
                  {[
                    "Screenshot base Clash of Clans yang ingin dicari.",
                    "Tekan scan base untuk memulai pencarian, tunggu beberapa detik hingga hasil muncul.",
                    "Pilih salah satu dari lima hasil yang paling mirip, lalu buka detail atau import ke akunmu.",
                  ].map((step, index) => (
                    <li key={step} className="flex items-start gap-3 text-xs leading-5 text-zinc-400">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-amber-400/20 bg-amber-400/[0.06] text-[9px] font-black text-amber-300">
                        0{index + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          <div className="mx-auto mt-10 grid max-w-5xl gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
            <div className="rounded-[1.75rem] border border-zinc-800/80 bg-zinc-950/75 p-4 shadow-[0_24px_80px_-45px_rgba(245,158,11,0.25)] backdrop-blur sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-400">01 / Upload screenshot</p>
                  <p className="mt-1 text-xs text-zinc-500">JPG, PNG, WebP, HEIC, dan lainnnya</p>
                </div>
                {file && (
                  <button
                    type="button"
                    onClick={resetSearch}
                    disabled={loading}
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-zinc-800 text-zinc-500 transition hover:border-zinc-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Reset pencarian"
                    title="Reset"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPT_ATTRIBUTE}
                className="sr-only"
                disabled={loading}
                onChange={(event) => selectImage(event.currentTarget.files?.[0])}
                aria-label="Pilih screenshot base"
              />

              <button
                type="button"
                disabled={loading}
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragOver={(event) => event.preventDefault()}
                onDragLeave={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    setDragging(false);
                  }
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragging(false);
                  selectImage(event.dataTransfer.files[0]);
                }}
                className={`group relative flex min-h-64 w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed p-5 text-center transition sm:min-h-72 disabled:cursor-wait disabled:opacity-70 ${
                  dragging
                    ? "border-amber-300 bg-amber-400/[0.08]"
                    : "border-zinc-700 bg-black/35 hover:border-amber-400/50 hover:bg-amber-400/[0.03]"
                }`}
              >
                {previewUrl ? (
                  <>
                    <Image
                      src={previewUrl}
                      alt="Preview screenshot base"
                      fill
                      unoptimized
                      sizes="(max-width: 1024px) 100vw, 55vw"
                      className="object-contain p-3"
                    />
                    <span className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/75 px-3 py-2 text-[10px] font-bold text-zinc-200 backdrop-blur">
                      <ImagePlus size={14} className="text-amber-300" />
                      Ganti gambar
                    </span>
                  </>
                ) : (
                  <>
                    <span className="mb-4 inline-flex size-14 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/[0.07] text-amber-300 transition group-hover:scale-105">
                      <Upload size={23} />
                    </span>
                    <span className="text-sm font-bold text-zinc-200">Tarik screenshot ke sini</span>
                    <span className="mt-1 text-xs text-zinc-500">atau pilih file langsung dari perangkat</span>
                    <span className="mt-5 rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-zinc-500">
                      Maksimum 10 MiB
                    </span>
                  </>
                )}
              </button>

              {file && (
                <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-zinc-800/70 bg-black/30 px-3.5 py-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <ImagePlus size={15} className="shrink-0 text-amber-400" />
                    <span className="truncate text-xs font-semibold text-zinc-300">{file.name}</span>
                  </div>
                  <span className="shrink-0 text-[10px] tabular-nums text-zinc-600">{formatFileSize(file.size)}</span>
                </div>
              )}

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={searchForMatches}
                  disabled={!file || loading}
                  className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
                >
                  {loading ? (
                    <>
                      <LoaderCircle size={16} className="animate-spin" />
                      Menganalisis base...
                    </>
                  ) : (
                    <>
                      Scan base
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
                {file && (
                  <button
                    type="button"
                    onClick={resetSearch}
                    disabled={loading}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-zinc-800 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.13em] text-zinc-400 transition hover:border-zinc-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <RotateCcw size={14} />
                    Reset
                  </button>
                )}
              </div>

              {loading && (
                <p className="mt-3 text-center text-[10px] leading-5 text-zinc-600" role="status">
                  Proses mungkin dapat memakan waktu lebih lama dari biasanya. Jika tidak ada hasil setelah beberapa detik, coba lagi dengan screenshot base yang berbeda.
                </p>
              )}
              {error && (
                <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-xs leading-5 text-red-200" role="alert">
                  <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-300" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <aside className="flex flex-col justify-between rounded-[1.75rem] border border-zinc-800/70 bg-gradient-to-br from-zinc-900/70 via-zinc-950/80 to-amber-950/15 p-5 sm:p-7">
              <div>
                <div className="mb-5 inline-flex size-11 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/[0.07] text-amber-300">
                  <Sparkles size={21} />
                </div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-400">How it works</p>
                <h2 className="mt-2 text-2xl font-black uppercase italic leading-tight text-white sm:text-3xl" style={{ fontFamily: "'Docallisme', sans-serif" }}>
                  YOUR SCREENSHOT
                  <br />
                  <span className="text-amber-400">MEETS THE ARCHIVE</span>
                </h2>
                <div className="mt-6 space-y-4">
                  {[
                    ["01", "Upload screenshot", "Screenshot base yang ingin kamu cari."],
                    ["02", "AI Mencocokkan", "AI akan menganalisis screenshot dan mencari lima layout aktif yang paling mirip dari ratusan base di database kami."],
                    ["03", "Pilih hasil", "Buka detail atau import salah satu dari lima hasil."],
                  ].map(([number, title, description]) => (
                    <div key={number} className="flex gap-3">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-amber-400/20 bg-amber-400/[0.06] text-[9px] font-black text-amber-300">{number}</span>
                      <div>
                        <p className="text-xs font-bold text-zinc-200">{title}</p>
                        <p className="mt-1 text-[10px] leading-5 text-zinc-500">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-7 flex items-start gap-2.5 border-t border-white/[0.07] pt-4 text-[10px] leading-5 text-zinc-600">
                <ShieldCheck size={15} className="mt-0.5 shrink-0 text-amber-500/70" />
                Screenshot yang kamu unggah hanya digunakan untuk mencari base. Kami tidak menyimpan screenshot yang kamu unggah.
              </div>
            </aside>
          </div>
        </div>
      </section>

      {result && (
        <section
          ref={resultsRef}
          className="mx-auto max-w-7xl scroll-mt-8 px-5 pb-20 pt-8 sm:px-8"
        >
          <div className="mb-7 flex flex-col justify-between gap-3 border-b border-zinc-800/70 pb-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.22em] text-amber-400">
                <ScanLine size={13} />
                02 / Search results
              </p>
              <h2 className="text-3xl font-black uppercase italic tracking-tight text-white sm:text-4xl" style={{ fontFamily: "'Docallisme', sans-serif" }}>
                Closest <span className="text-amber-400">matches</span>
              </h2>
              <p className="mt-2 text-xs text-zinc-500">
                {result.layouts.length
                  ? `${result.layouts.length} layout aktif diurutkan dari yang paling mirip.`
                  : "Tidak ada layout aktif yang cocok untuk ditampilkan."}
              </p>
            </div>
          </div>

          {result.layouts.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {result.layouts.map((layout) => {
                const rank = result.matches.findIndex((match) => match.id === layout.id);
                const match = result.matches[rank];
                return (
                  <div key={layout.id}>
                    <div className="mb-2 flex items-center justify-between px-1">
                      <span className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.16em] text-amber-300">
                        <span className="flex size-6 items-center justify-center rounded-full bg-amber-400 text-[10px] text-black">{rank + 1}</span>
                        Match #{rank + 1}
                      </span>
                      {match && (
                        <span className="rounded-full border border-zinc-800 bg-zinc-900/70 px-2.5 py-1 text-[9px] font-bold tabular-nums text-zinc-400">
                          {(match.score * 100).toFixed(2)}% similarity
                        </span>
                      )}
                    </div>
                    <LayoutCard
                      {...layout}
                      isNewest={false}
                      isPriority={rank === 0}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-800/70 bg-zinc-950/50 px-5 py-14 text-center">
              <p className="text-sm font-bold text-zinc-300">Base tidak ditemukan atau format screenshot tidak valid.</p>
              <p className="mt-2 text-xs text-zinc-500">Coba lagi dengan screenshot base yang berbeda.</p>
            </div>
          )}
        </section>
      )}
    </>
  );
}
