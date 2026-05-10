import SectionTitle from "@/components/SectionTitle";
import { createClient } from "@libsql/client";
import { updateLayout } from "@/app/admin/dashboard/action"; 
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export const runtime = 'edge';
import { cookies } from "next/headers"; 
import { redirect } from "next/navigation"; 
import { jwtVerify } from "jose"; 

export default async function EditLayoutPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
    // 1. CEK SESI (AUTH GATE)
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    redirect("/admin/login");
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
  } catch (error) {
    redirect("/admin/login");
  }
  const { id } = await params;

  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  const result = await client.execute({
    sql: "SELECT * FROM layouts WHERE id = ?",
    args: [id]
  });
  
  const data = result.rows[0];

  if (!data) return <div className="p-10 text-white font-urban">Data tidak ditemukan</div>;

  const updateLayoutWithId = updateLayout.bind(null, Number(id));

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-6 lg:p-12 font-urban">
      <div className="max-w-3xl mx-auto">
        <Link href="/admin/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-white mb-8 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition" />
          Back to Dashboard
        </Link>

        <SectionTitle 
          text1="EDIT" 
          text2="BASE LAYOUT" 
          text3={`Updating Layout ID: ${id}`} 
        />

        <form action={updateLayoutWithId} className="mt-12 space-y-6 bg-[#111] border border-white/10 p-8 rounded-2xl shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Town Hall</label>
              <select 
                name="th_level" 
                defaultValue={Number(data.th_level)} 
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
              >
                {[19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(lvl => (
                  <option key={lvl} value={lvl}>Town Hall {lvl}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Base Tag</label>
              <input 
                name="base_tag" 
                defaultValue={String(data.base_tag)} 
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-blue-500" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Copy Link</label>
            <input 
              name="copy_link" 
              defaultValue={String(data.copy_link)} 
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 outline-none text-blue-400 focus:border-blue-500" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Image URL</label>
            <input 
              name="image_url" 
              defaultValue={String(data.image_url)} 
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-blue-500" 
            />
          </div>

          {/* Kolom Baru: Source Type & Source URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Source Type</label>
              <input 
                name="source_type" 
                defaultValue={data.source_type ? String(data.source_type) : ""} 
                placeholder="YouTube / Web"
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Source URL</label>
              <input 
                name="source_url" 
                defaultValue={data.source_url ? String(data.source_url) : ""} 
                placeholder="https://..."
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-blue-500" 
              />
            </div>
          </div>

          {/* Kolom Baru: Description */}
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Description</label>
            <textarea 
              name="description" 
              defaultValue={data.description ? String(data.description) : ""} 
              rows={3}
              placeholder="Base anti 3 star legend league..."
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-blue-500 resize-none font-sans"
            />
          </div>

          {/* Kolom Baru: Is Active Switch */}
          <div className="flex items-center gap-3 bg-black/50 p-4 rounded-lg border border-white/5">
            <input 
              type="checkbox" 
              name="is_active" 
              id="is_active"
              defaultChecked={Boolean(data.is_active)}
              className="w-5 h-5 accent-blue-600 cursor-pointer"
            />
            <label htmlFor="is_active" className="text-sm font-bold text-gray-300 uppercase tracking-widest cursor-pointer">
              Show this base to members (Active)
            </label>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-[0.98] transition duration-300"
          >
            <Save size={20} /> UPDATE DATABASE
          </button>
        </form>
      </div>
    </main>
  );
}