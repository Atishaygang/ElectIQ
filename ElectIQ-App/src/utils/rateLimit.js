import { APP_CONFIG } from '../config/appConfig';

/**
 * RateLimiter class to limit actions over a time window.
 */
class RateLimiter {
  constructor(limit, timeWindowMs) {
    this.limit = limit;
    this.timeWindowMs = timeWindowMs;
    this.requests = [];
  }

  isRateLimited() {
    const now = Date.now();
    this.requests = this.requests.filter(timestamp => now - timestamp < this.timeWindowMs);
    
    if (this.requests.length >= this.limit) {
      return true;
    }
    
    this.requests.push(now);
    return false;
  }

  reset() {
    this.requests = [];
  }
}

/** Global rate limiter instance for chat */
export const chatRateLimiter = new RateLimiter(APP_CONFIG.RATE_LIMIT_PER_MINUTE, 60 * 1000);
