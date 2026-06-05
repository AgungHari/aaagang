'use server'
import { cookies } from 'next/headers'
import { SignJWT } from 'jose' 
import { checkRateLimit, getRemainingAttempts, getResetTime, resetRateLimit } from '@/lib/rateLimit'

// Rate limit config: 5 attempts per 15 minutes
const MAX_LOGIN_ATTEMPTS = 5
const LOGIN_WINDOW_MS = 15 * 60 * 1000 // 15 minutes

export async function loginAction(formData: FormData) {
  // Normalize input (trim whitespace)
  const username = (formData.get('username') as string)?.trim() || ''
  const password = (formData.get('password') as string) || ''

  // Use username as identifier for rate limiting (normalized)
  const identifier = `login:${username.toLowerCase()}`

  console.log(`[Login] Attempt for user: ${username}`)

  // Check rate limit BEFORE credential validation
  // This prevents attackers from using failed attempts to probe usernames
  if (!checkRateLimit(identifier, MAX_LOGIN_ATTEMPTS, LOGIN_WINDOW_MS)) {
    const resetSeconds = getResetTime(identifier) || 0
    const resetMinutes = Math.ceil(resetSeconds / 60)
    
    console.log(`[Login] RATE LIMITED for ${username}. Reset in ${resetMinutes}min`)
    
    return {
      success: false,
      message: `Too many login attempts. Please try again in ${resetMinutes} minute${resetMinutes > 1 ? 's' : ''}.`,
      isRateLimited: true,
    }
  }

  // Validate credentials
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    // Reset rate limit on successful login
    resetRateLimit(identifier)

    console.log(`[Login] SUCCESS for ${username}`)

    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1d')
      .sign(secret)

    const cookieStore = await cookies()
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 1 hari
    })

    return { success: true, redirectUrl: '/admin/home' }
  }

  // Invalid credentials - return remaining attempts info
  const remaining = getRemainingAttempts(identifier, MAX_LOGIN_ATTEMPTS)
  
  console.log(`[Login] FAILED for ${username}. Remaining: ${remaining}/${MAX_LOGIN_ATTEMPTS}`)
  
  return {
    success: false,
    message: 'Invalid credentials',
    attemptsRemaining: remaining,
    isRateLimited: false,
  }
}