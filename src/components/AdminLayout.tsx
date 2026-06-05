'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Home, LayoutGrid, Settings, LogOut, Menu, X } from 'lucide-react';
import { logoutAction } from '@/app/admin/(protected)/settings/action';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Helper function to check if link is active
  const isActive = (href: string) => pathname === href;

  const navItems = [
    { label: 'Home', href: '/admin/home', icon: Home },
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutGrid },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  // Close sidebar when navigating
  const handleNavClick = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white font-poppins">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-black/80 border-b border-white/10 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center font-bold text-xs">
              AG
            </div>
            <h1 className="font-bold text-sm">AAA GANG</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Side Panel */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-black/50 border-r border-white/10 flex flex-col z-40 transition-transform duration-300 md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        overflow-y-auto
      `}>
        {/* Brand/Logo Section */}
        <div className="p-4 md:p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 md:w-10 h-8 md:h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center font-bold text-xs md:text-base">
              AG
            </div>
            <div>
              <h1 className="font-bold text-sm md:text-lg">AAA GANG</h1>
              <p className="text-[10px] md:text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-2 md:p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={`flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-all duration-300 text-sm md:text-base ${
                  active
                    ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} className="md:w-5 md:h-5" />
                <span className="font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Section */}
        <div className="p-2 md:p-4 border-t border-white/10">
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-all duration-300 border border-red-500/30 font-semibold group text-sm md:text-base"
            >
              <LogOut size={18} className="md:w-5 md:h-5 group-hover:translate-x-0.5 transition" />
              <span>Logout</span>
            </button>
          </form>
        </div>

        {/* Footer Info */}
        <div className="p-3 md:p-4 text-[10px] md:text-xs text-gray-600 text-center border-t border-white/10">
          <p>&copy; 2026 AAA GANG</p>
          <p>Internal System</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}
