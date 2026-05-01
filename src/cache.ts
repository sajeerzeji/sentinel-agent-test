// Simple cache implementation with fixes

export class Cache {
  private store: Map<string, { value: any; timestamp: number }> = new Map();
  private maxSize = 1000;
  private ttlMs = 5 * 60 * 1000; // 5 minutes TTL

  set(key: string, value: any): void {
    // Evict oldest entry if at capacity
    if (this.store.size >= this.maxSize) {
      this.evictOldest();
    }
    this.store.set(key, { value, timestamp: Date.now() });
  }

  get(key: string): any {
    const entry = this.store.get(key);
    if (!entry) return null;

    // Check TTL
    if (Date.now() - entry.timestamp > this.ttlMs) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTimestamp = Infinity;

    for (const [key, entry] of this.store.entries()) {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.store.delete(oldestKey);
    }
  }
}

export const globalCache = new Cache();
