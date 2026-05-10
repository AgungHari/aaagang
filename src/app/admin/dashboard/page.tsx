import { createClient } from "@libsql/client";
import SectionTitle from "@/components/SectionTitle";
import { Plus, Database, Eye, ThumbsUp, Edit3 } from "lucide-react";
import DeleteLayoutButton from "@/components/DeleteLayoutButton";
import PreviewButtons from "@/components/PreviewButtons";
import Link from "next/link";

export const runtime = 'edge';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export default async function AdminDashboard() {
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

  // 2. FETCH DATA (Hanya jalan jika lolos cek di atas)
  const result = await client.execute("SELECT * FROM layouts ORDER BY upload_date DESC");
  const layouts = result.rows;

  const totalLayouts = layouts.length;
  const totalViews = layouts.reduce((acc, curr) => acc + Number(curr.view_count || 0), 0);

  return (
    <main className="min-h-screen text-white p-6 lg:p-12 font-poppins">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4 text-amber-500">
          <SectionTitle 
            text1="ADMIN" 
            text2="DASHBOARD" 
            text3="Manage AAA GANG Base Layouts" 
          />
          <span className="text-white font-semibold">Total Views Layout: {totalViews}</span>
          <Link 
            href="/admin/dashboard/new" 
            className="flex items-center gap-2 bg-zinc-900/20 border border-zinc-800/50 text-zinc-300 px-6 py-3 rounded-full font-semibold transition animate-pulse"
          >
            <Plus size={20} />
          </Link>
        </div>

        {/* Stats & Table... */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-zinc-900/20 border border-zinc-800/50 p-6 rounded-2xl">
              <div className="flex items-center gap-4 text-gray-400 mb-2">
                <Database size={20} />
                <span className="text-sm font-bold uppercase tracking-widest">Total Layouts</span>
              </div>
              <p className="text-3xl">{totalLayouts}</p>
            </div>
            {/* ... stats lainnya ... */}
        </div>

        <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-2xl overflow-hidden">
          <div className="space-y-4 p-6 md:p-0">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-black/50 border-b border-white/10 sticky top-0">
                  <tr className="text-gray-400 text-xs uppercase tracking-widest">
                    <th className="px-6 py-4 font-bold">Image</th>
                    <th className="px-6 py-4 font-bold">TH Level</th>
                    <th className="px-6 py-4 font-bold">Description</th>
                    <th className="px-6 py-4 font-bold">Tag</th>
                    <th className="px-6 py-4 font-bold">Date</th>
                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {layouts.map((layout) => (
                    <tr key={String(layout.id)} className="hover:bg-white/[0.03] transition group">
                      <td className="px-6 py-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-black/50 border border-white/10">
                          <img 
                            src={String(layout.image_url)} 
                            alt="Layout preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full font-bold text-sm">TH {String(layout.th_level)}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-300 max-w-xs truncate text-sm">{layout.description ? String(layout.description) : "No description"}</td>
                      <td className="px-6 py-4">
                        <span className="inline-block bg-zinc-700/40 text-zinc-300 px-3 py-1 rounded-lg font-semibold text-sm">{String(layout.base_tag)}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-mono">{layout.upload_date ? new Date(String(layout.upload_date)).toLocaleDateString() : "-"}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <PreviewButtons imageUrl={String(layout.image_url)} sourceUrl={String(layout.source_url)} variant="desktop" />
                          <Link 
                            href={`/admin/dashboard/edit/${layout.id}`} 
                            className="inline-flex items-center gap-1 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 px-3 py-1.5 rounded-lg transition text-sm font-semibold"
                          >
                            <Edit3 size={14} />
                            Edit
                          </Link>
                          <DeleteLayoutButton layoutId={Number(layout.id)} variant="desktop" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {layouts.map((layout) => (
                <div key={String(layout.id)} className="bg-black/50 border border-white/10 rounded-lg p-4 space-y-3 hover:border-white/20 transition">
                  <div className="w-full h-40 rounded-lg overflow-hidden bg-black/50 border border-white/10 mb-3">
                    <img 
                      src={String(layout.image_url)} 
                      alt="Layout preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Town Hall</p>
                      <p className="text-white font-bold text-lg">TH {String(layout.th_level)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Tag</p>
                      <p className="text-zinc-400 font-bold">{String(layout.base_tag)}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Description</p>
                    <p className="text-gray-300 text-sm line-clamp-2">{layout.description ? String(layout.description) : "No description"}</p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Date</p>
                    <p className="text-gray-500 text-xs font-mono">{layout.upload_date ? new Date(String(layout.upload_date)).toLocaleDateString() : "-"}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                    <PreviewButtons imageUrl={String(layout.image_url)} sourceUrl={String(layout.source_url)} variant="mobile" />
                    <Link href={`/admin/dashboard/edit/${layout.id}`} className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 py-2 rounded-lg flex items-center justify-center gap-2 transition">
                      <Edit3 size={16} />
                      <span className="text-sm font-semibold">Edit</span>
                    </Link>
                    <DeleteLayoutButton layoutId={Number(layout.id)} variant="mobile" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}