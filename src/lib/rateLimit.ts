/**
 * Simple In-Memory Rate Limiting Utility
 * Tracks attempts per identifier and enforces limits
 */

type RateLimitRecord = {
  attempts: number
  resetTime: number
}

// In-memory store untuk tracking attempts
const store: Map<string, RateLimitRecord> = new Map()

/**
 * Check if request should be allowed based on rate limit
 * @param identifier - Unique identifier (e.g., username, IP address)
 * @param limit - Max attempts allowed in window
 * @param windowMs - Time window in milliseconds
 * @returns true if allowed, false if rate limited
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 minutes default
): boolean {
  const now = Date.now()
  const record = store.get(identifier)

  // No record yet, create one
  if (!record) {
    store.set(identifier, {
      attempts: 1,
      resetTime: now + windowMs,
    })
    console.log(`[RateLimit] New record for ${identifier}: attempts=1`)
    return true // Allow first attempt
  }

  // Check if window expired
  if (now > record.resetTime) {
    // Reset counter
    store.set(identifier, {
      attempts: 1,
      resetTime: now + windowMs,
    })
    console.log(`[RateLimit] Window expired for ${identifier}, reset: attempts=1`)
    return true // Allow request in new window
  }

  // Check if limit ALREADY exceeded (before increment)
  if (record.attempts >= limit) {
    console.log(`[RateLimit] Rate limited for ${identifier}: attempts=${record.attempts}/${limit}`)
    return false // Rate limited!
  }

  // Increment attempts
  record.attempts++
  console.log(`[RateLimit] Incremented ${identifier}: attempts=${record.attempts}/${limit}`)
  return true
}

/**
 * Get remaining attempts before rate limit
 */
export function getRemainingAttempts(
  identifier: string,
  limit: number = 5
): number {
  const now = Date.now()
  const record = store.get(identifier)

  if (!record || now > record.resetTime) {
    return limit
  }

  return Math.max(0, limit - record.attempts)
}

/**
 * Get time until rate limit resets (in seconds)
 */
export function getResetTime(identifier: string): number | null {
  const now = Date.now()
  const record = store.get(identifier)

  if (!record || now > record.resetTime) {
    return null
  }

  return Math.ceil((record.resetTime - now) / 1000)
}

/**
 * Reset rate limit for specific identifier (e.g., successful login)
 */
export function resetRateLimit(identifier: string): void {
  store.delete(identifier)
}

/**
 * Cleanup old records (call periodically to prevent memory leak)
 */
export function cleanupExpiredRecords(): void {
  const now = Date.now()
  let cleaned = 0

  for (const [key, record] of store.entries()) {
    if (now > record.resetTime) {
      store.delete(key)
      cleaned++
    }
  }

  console.log(`[RateLimit] Cleaned up ${cleaned} expired records`)
}

// Cleanup setiap 1 jam
setInterval(cleanupExpiredRecords, 60 * 60 * 1000)
