import { Shield, LogOut } from 'lucide-react';
import { logoutAction } from './action';

export default function AdminSettingsPage() {
  return (
    <main className="min-h-screen text-white p-6 lg:p-12 font-poppins">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-2xl md:text-4xl text-white" style={{ fontFamily: "'Docallisme', sans-serif" }}>PENGATURAN <span className=" text-amber-500">AKUN</span></h1>

          <p className="text-gray-400 text-sm">Kelola profil dan akses admin</p>
        </div>

        <div className="mt-12 space-y-8">
          {/* Account Information */}
          <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
                <Shield size={20} className="text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold">Informasi Akun</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-black/50 p-4 rounded-lg border border-white/5">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Status</p>
                <p className="text-lg font-semibold text-green-400">✓ Authenticated</p>
              </div>

              <div className="bg-black/50 p-4 rounded-lg border border-white/5">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Role</p>
                <p className="text-lg font-semibold">Admin</p>
              </div>

              <div className="bg-black/50 p-4 rounded-lg border border-white/5">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Access Level</p>
                <p className="text-lg font-semibold text-amber-400">Full Control</p>
              </div>
            </div>
          </div>

          {/* Logout Section */}
          <div className="bg-red-600/10 border border-red-500/30 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-red-600/20 flex items-center justify-center">
                <LogOut size={20} className="text-red-400" />
              </div>
              <h2 className="text-2xl font-bold">Logout</h2>
            </div>

            <p className="text-gray-300 mb-6">
              Tekan tombol di bawah untuk logout dari akun admin. Kamu akan diarahkan ke halaman login 
              dan harus login kembali untuk akses admin panel.
            </p>

            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all duration-300 active:scale-95"
              >
                <LogOut size={20} />
                <span>Logout Sekarang</span>
              </button>
            </form>

            <p className="text-xs text-gray-500 mt-4">
              Token kamu akan dihapus dan session berakhir seketika.
            </p>
          </div>

          {/* Security Info */}
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-6">
            <p className="text-blue-300 text-sm">
              <span className="font-bold"> Keamanan:</span> Token admin kamu disimpan dalam secure, 
              HttpOnly cookie dan akan otomatis expire setelah 24 jam.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
