'use client';

import { BarChart3, Settings } from 'lucide-react';

export default function AdminHomePage() {
  return (
    <main className="min-h-screen text-white p-6 lg:p-12 font-poppins">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-2xl md:text-4xl text-white" style={{ fontFamily: "'Docallisme', sans-serif" }}>SELAMAT <span className="text-amber-500">DATANG</span></h1>
          
          <p className="text-gray-400 text-sm">Welcome back to AAA GANG Admin Panel</p>
        </div>

        <div className="mt-12 space-y-8">
          {/* Welcome Section */}
          <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-amber-500">
              Terima Kasih Sudah Login! 
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Kamu sudah login ke admin panel AAA GANG. Dari sini, yang berarti kamu sudah menjadi bagian dari tim inti yang mengelola base layouts untuk clan kita.
            </p>
            <p className="text-gray-400 text-base">
              Gunakan menu navigasi di sebelah kiri untuk mengakses fitur yang tersedia. 
              Jika ada pertanyaan atau butuh bantuan, hubungi leader clan.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dashboard Link */}
            <div className="bg-black/50 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition group cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition">Dashboard</h3>
              <p className="text-gray-400 text-sm mb-4">
                Lihat semua base layouts yang sudah di-upload dan kelola semuanya di sini.
              </p>
              <a 
                href="/admin/dashboard" 
                className="inline-block text-blue-400 hover:text-blue-300 font-semibold transition"
              >
                Buka Dashboard →
              </a>
            </div>

            {/* Settings Link */}
            <div className="bg-black/50 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition group cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-amber-600/20 flex items-center justify-center">
                  <Settings className="w-6 h-6 text-amber-400" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-amber-400 transition">Pengaturan</h3>
              <p className="text-gray-400 text-sm mb-4">
                Kelola profil admin, lihat informasi akun, dan logout dari sistem.
              </p>
              <a 
                href="/admin/settings" 
                className="inline-block text-amber-400 hover:text-amber-300 font-semibold transition"
              >
                Buka Pengaturan →
              </a>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-6">
            <p className="text-blue-300 text-sm">
              <span className="font-bold">Tips:</span> Gunakan keyboard shortcuts untuk navigasi yang lebih cepat. 
              Tekan ESC untuk kembali ke halaman sebelumnya.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
