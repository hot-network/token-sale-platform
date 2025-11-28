interface CacheEntry<T> {
  value: T;
  expiry: number;
}

class Cache {
  private store: Map<string, CacheEntry<any>> = new Map();

  /**
   * Sets a value in the cache with a specific time-to-live (TTL).
   * @param key The key to store the value under.
   * @param value The value to store.
   * @param ttl The time-to-live in milliseconds.
   */
  set<T>(key: string, value: T, ttl: number): void {
    const expiry = Date.now() + ttl;
    this.store.set(key, { value, expiry });
  }

  /**
   * Retrieves a value from the cache. Returns null if the key doesn't exist or has expired.
   * @param key The key of the value to retrieve.
   */
  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) {
      return null;
    }
    if (Date.now() > entry.expiry) {
      this.store.delete(key);
      return null;
    }
    return entry.value as T;
  }

  /**
   * Checks if a non-expired key exists in the cache.
   * @param key The key to check.
   */
  has(key: string): boolean {
    const entry = this.store.get(key);
     if (!entry) {
      return false;
    }
     if (Date.now() > entry.expiry) {
      this.store.delete(key);
      return false;
    }
    return true;
  }
}

// Export a singleton instance
export const appCache = new Cache();


// --- localStorage Cache ---

/**
 * Sets a value in localStorage.
 * @param key The key to store the value under.
 * @param value The value to store.
 */
export const localCacheSet = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error setting localStorage key "${key}":`, error);
  }
};

/**
 * Retrieves a value from localStorage.
 * @param key The key of the value to retrieve.
 * @returns The stored value or null if not found.
 */
export const localCacheGet = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.warn(`Error getting localStorage key "${key}":`, error);
    return null;
  }
};
