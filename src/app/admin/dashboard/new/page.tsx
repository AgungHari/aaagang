
import SectionTitle from "@/components/SectionTitle";
import { createLayout } from "@/app/admin/dashboard/new/action";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { cookies } from "next/headers";

import { redirect } from "next/navigation";
import { jwtVerify } from "jose";

export default async function NewLayoutPage() {
    // 1. AUTH GATE (Gembok Server)
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
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-6 lg:p-12 font-urban">
      <div className="max-w-3xl mx-auto">
        <Link 
          href="/admin/dashboard" 
          className="flex items-center gap-2 text-gray-500 hover:text-white transition mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition" />
          Back to Dashboard
        </Link>

        <SectionTitle 
          text1="ADD NEW" 
          text2="BASE LAYOUT" 
          text3="Register a new strategic base to AAA GANG database" 
        />

        <form action={createLayout} className="mt-12 space-y-6 bg-[#111] border border-white/10 p-8 rounded-2xl shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* TH Level */}
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Town Hall Level</label>
              <select 
                name="th_level" 
                required
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition"
              >
                {[19,18,17,16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(lvl => (
                  <option key={lvl} value={lvl}>Town Hall {lvl}</option>
                ))}
              </select>
            </div>

            {/* Base Tag/Type */}
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Base Tag (e.g. War, Farming)</label>
              <input 
                name="base_tag" 
                type="text" 
                required 
                placeholder="Legend / War / Hybrid"
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>

          {/* Copy Link */}
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">In-Game Copy Link</label>
            <input 
              name="copy_link" 
              type="url" 
              required 
              placeholder="https://link.clashofclans.com/..."
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition text-blue-400"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Preview Image URL</label>
            <input 
              name="image_url" 
              type="url" 
              required 
              placeholder="Direct link to image (imgur/cloudinary)"
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition"
            />
          </div>

          {/* Source Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Source Type</label>
              <input 
                name="source_type" 
                type="text" 
                placeholder="YouTube / Blueprint / Web"
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Source URL</label>
              <input 
                name="source_url" 
                type="url" 
                placeholder="Link to original creator"
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Description</label>
            <textarea 
              name="description" 
              rows={3}
              placeholder="Explain why this base is good..."
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition resize-none"
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 active:scale-[0.98] transition duration-300 shadow-xl"
          >
            <Save size={20} />
            PUBLISH TO DATABASE
          </button>
        </form>
      </div>
    </main>
  );
}