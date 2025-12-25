type RateLimitEntry = {
  count: number;
  startTime: number;
};

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp in seconds for when the limit resets
};

type RateLimitConfig = {
    limit?: number;
    windowMs?: number;
}

/**
 * A simple in-memory rate limiter class.
 * This is suitable for single-instance deployments. For distributed systems,
 * an external service like Redis would be required.
 */
export class RateLimiter {
  private static readonly clients = new Map<string, Map<string, RateLimitEntry>>();
  private static readonly DEFAULT_LIMIT = 100; // Max requests
  private static readonly DEFAULT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes in milliseconds

  /**
   * Checks if a request from a given identifier is within the rate limit.
   * @param identifier - A unique identifier for the client (e.g., IP address).
   * @param scope - A string to scope the rate limit to (e.g., 'login', 'api'). Defaults to 'default'.
   * @param config - Optional configuration for this specific check.
   * @returns A RateLimitResult object with details about the request's status.
   */
  public static check(identifier: string, scope: string = 'default', config?: RateLimitConfig): RateLimitResult {
    const now = Date.now();
    const limit = config?.limit ?? this.DEFAULT_LIMIT;
    const windowMs = config?.windowMs ?? this.DEFAULT_WINDOW_MS;

    if (!this.clients.has(identifier)) {
        this.clients.set(identifier, new Map<string, RateLimitEntry>());
    }

    const clientScopes = this.clients.get(identifier)!;
    let scopeEntry = clientScopes.get(scope);

    // If the entry doesn't exist or the window has expired, reset it.
    if (!scopeEntry || now - scopeEntry.startTime > windowMs) {
      scopeEntry = {
        count: 1,
        startTime: now,
      };
      clientScopes.set(scope, scopeEntry);
    } else {
      // Otherwise, just increment the count.
      scopeEntry.count++;
      clientScopes.set(scope, scopeEntry);
    }
    
    const isWithinLimit = scopeEntry.count <= limit;
    const remainingRequests = isWithinLimit ? limit - scopeEntry.count : 0;
    const resetTime = Math.ceil((scopeEntry.startTime + windowMs) / 1000);

    return {
      success: isWithinLimit,
      limit: limit,
      remaining: remainingRequests,
      reset: resetTime,
    };
  }
}
