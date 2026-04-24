// src/app/admin/login/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginAction } from '@/app/admin/action'
import { AlertCircle, Lock } from 'lucide-react'

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
      router.push('/admin/dashboard')
    } else {
      setError(result.message || 'Login failed')
      setIsRateLimited(result.isRateLimited || false)
      setAttemptsRemaining(result.attemptsRemaining || null)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 font-poppins animate-slide-up">
      <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Dekorasi Glow di pojok */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 blur-[100px]" />
        
        <div className="text-center mb-8 relative z-10">
          <h1 className="text-3xl tracking-wider text-white italic " style={{ fontFamily: "'Docallisme', sans-serif" }} >
            ADMIN <span className="text-amber-500">ACCESS</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2 uppercase tracking-widest font-medium">
            AAA GANG Internal System
          </p>
        </div>
        
        <form action={handleSubmit} className="space-y-6 relative z-10">
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
          
          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">
              Username
            </label>
            <input 
              name="username"
              type="text" 
              required
              disabled={isRateLimited}
              className={`w-full bg-black/50 border rounded-xl px-4 py-4 text-white outline-none transition-all duration-300 placeholder:text-gray-800 ${
                isRateLimited
                  ? 'border-red-500/30 opacity-50 cursor-not-allowed'
                  : 'border-white/5 focus:border-amber-500'
              }`}
              placeholder="Please dont hack me this is non profit :v"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">
              Pass
            </label>
            <input 
              name="password"
              type="password" 
              required
              disabled={isRateLimited}
              className={`w-full bg-black/50 border rounded-xl px-4 py-4 text-white outline-none transition-all duration-300 placeholder:text-gray-800 ${
                isRateLimited
                  ? 'border-red-500/30 opacity-50 cursor-not-allowed'
                  : 'border-white/5 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50'
              }`}
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={isRateLimited}
            className={`group relative w-full py-4 rounded-2xl transition-all overflow-hidden ${
              isRateLimited
                ? 'bg-red-600/30 text-red-400 cursor-not-allowed opacity-50'
                : 'bg-amber-500 text-black hover:text-white'
            }`}
          >
            <span className="relative z-10 tracking-widest flex items-center justify-center gap-2" style={{ fontFamily: "'Docallisme', sans-serif" }} >
              {isRateLimited && <Lock size={18} />}
              {isRateLimited ? 'LOCKED' : 'GANGSTA'}
            </span>
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[10px] text-gray-600 tracking-widest uppercase">
            Kamu Siapa? &copy; {new Date().getFullYear()} AAA GANG
          </p>
        </div>
      </div>
    </main>
  )
}