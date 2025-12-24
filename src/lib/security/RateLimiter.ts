type RateLimitEntry = {
  count: number;
  startTime: number;
};

/**
 * A simple in-memory rate limiter class.
 * This is suitable for single-instance deployments. For distributed systems,
 * an external service like Redis would be required.
 */
export class RateLimiter {
  private static readonly clients = new Map<string, RateLimitEntry>();
  private static readonly LIMIT = 100; // Max requests
  private static readonly WINDOW_MS = 15 * 60 * 1000; // 15 minutes in milliseconds

  /**
   * Checks if a request from a given identifier is within the rate limit.
   * @param identifier - A unique identifier for the client (e.g., IP address or user ID).
   * @returns `true` if the request is allowed, `false` if it is blocked.
   */
  public static check(identifier: string): boolean {
    const now = Date.now();
    const clientEntry = this.clients.get(identifier);

    if (!clientEntry || now - clientEntry.startTime > this.WINDOW_MS) {
      // If the entry doesn't exist or the window has expired, reset it.
      this.clients.set(identifier, {
        count: 1,
        startTime: now,
      });
      return true;
    }

    if (clientEntry.count < this.LIMIT) {
      // If the request count is within the limit, increment and allow.
      clientEntry.count++;
      this.clients.set(identifier, clientEntry);
      return true;
    }
    
    // If the limit is exceeded, block the request.
    return false;
  }
}
