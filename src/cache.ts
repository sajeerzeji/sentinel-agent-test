// Simple cache implementation with issues

export class Cache {
  private store: Map<string, any> = new Map();
  private maxSize = 1000;

  set(key: string, value: any): void {
    // No eviction strategy - will grow indefinitely
    this.store.set(key, value);
  }

  get(key: string): any {
    return this.store.get(key);
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  // No TTL support
  // No size limit enforcement
  // No concurrency control
}

export const globalCache = new Cache();
