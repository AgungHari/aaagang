// src/app/admin/(auth)/login/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginAction } from '@/app/admin/action'
import { AlertCircle, Lock } from 'lucide-react'
import Image from 'next/image'

export default function AdminLogin() {
  const [error, setError] = useState('')
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    const result = await loginAction(formData)
    if (result.success) {
      setError('')
      setIsRateLimited(false)
      router.push(result.redirectUrl || '/admin/home')
    } else {
      setError(result.message || 'Login failed')
      setIsRateLimited(result.isRateLimited || false)
      setAttemptsRemaining(result.attemptsRemaining || null)
    }
  }

  return (
     <main className="min-h-screen flex flex-col lg:flex-row font-poppins">
       {/* Image Section - Now visible on mobile (top) and desktop (left) */}
       <div className="lg:w-1/2 relative overflow-hidden min-h-[250px] lg:min-h-screen">
         <Image
           src="/login.webp"
           alt="Admin Access"
           fill
           className="object-cover"
           priority
         />
         {/* Overlay */}
         <div className="absolute inset-0 bg-black/40" />

         {/* Content Overlay */}
         <div className="absolute inset-0 flex flex-col justify-between p-6 lg:p-12 text-white">
           <div>
             <Image
              src="/badge_clan.webp"
              alt="clan"
              width={40}
              height={40}
              className="hidden lg:block object-contain drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]"
            />
          </div>
          <div>
            <h1 className="text-3xl lg:text-5xl mb-4 lg:mb-6" style={{ fontFamily: "'Docallisme', sans-serif" }}>
              YOUR<br />NEXT<br />ADVENTURE<br /><span className='text-amber-500'>AWAITS!</span>
            </h1>
            <p className="hidden lg:block text-sm lg:text-base text-gray-300 max-w-sm">
              Access the exclusive admin dashboard to manage layouts, view analytics, and more. Please contact leader to sign up as AAA GANGS Admin.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-12 bg-zinc-950">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl text-white mb-4" style={{ fontFamily: "'Docallisme', sans-serif" }}>
              WELCOME<br />BACK
            </h2>
            <p className="text-gray-400 text-sm">Yang pending jangan dibiarin ganjel acc langsung.</p>
          </div>

          <form action={handleSubmit} className="space-y-6">
            {error && (
              <div className={`flex items-start gap-3 p-4 rounded-lg border text-xs ${
                isRateLimited 
                  ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                  : 'bg-red-500/10 border-red-500/20 text-red-500'
              }`}>
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold uppercase tracking-widest">{error}</p>
                  {attemptsRemaining !== null && attemptsRemaining > 0 && !isRateLimited && (
                    <p className="text-xs mt-1 opacity-80">
                      Remaining attempts: {attemptsRemaining} / {5} Per Username
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Username Field */}
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 ml-1">
                Username
              </label>
              <input 
                name="username"
                type="text" 
                required
                disabled={isRateLimited}
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-gray-600 ${
                  isRateLimited
                    ? 'border-red-500/30 opacity-50 cursor-not-allowed'
                    : 'border-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20'
                }`}
                placeholder="Enter your username"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 ml-1">
                Password
              </label>
              <input 
                name="password"
                type="password" 
                required
                disabled={isRateLimited}
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-gray-600 ${
                  isRateLimited
                    ? 'border-red-500/30 opacity-50 cursor-not-allowed'
                    : 'border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20'
                }`}
                placeholder="••••••••"
              />
            </div>

            {/* Remember me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                <input 
                  type="checkbox" 
                  disabled={isRateLimited}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 accent-amber-500 cursor-pointer"
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-amber-500 hover:text-amber-400 transition font-semibold">
                Chat Clan Bosku?
              </a>
            </div>

            {/* Sign In Button */}
            <button 
              type="submit"
              disabled={isRateLimited}
              className={`w-full py-3 rounded-xl transition-all font-bold uppercase tracking-widest ${
                isRateLimited
                  ? 'bg-red-600/30 text-red-400 cursor-not-allowed opacity-50'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              {isRateLimited ? (
                <span className="flex items-center justify-center gap-2">
                  <Lock size={16} />
                  LOCKED
                </span>
              ) : (
                'SIGN IN'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-[10px] text-gray-500 tracking-widest uppercase">
              &copy; {new Date().getFullYear()} AAA GANG Internal System
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
