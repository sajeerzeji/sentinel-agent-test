// Network client module

import * as http from 'http';
import * as https from 'https';

export class NetworkClient {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private maxCacheSize = 100;
  private cacheTTL = 5 * 60 * 1000; // 5 minutes

  fetch(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https') ? https : http;
      
      protocol.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve(JSON.parse(data));
        });
      }).on('error', reject);
    });
  }

  fetchInternal(url: string): Promise<any> {
    return this.fetch(url);
  }

  fetchWithTimeout(url: string, timeoutMs: number = 5000): Promise<any> {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https') ? https : http;
      
      const request = protocol.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error('Invalid JSON response'));
          }
        });
      }).on('error', reject);
      
      request.setTimeout(timeoutMs, () => {
        request.destroy();
        reject(new Error('Request timeout'));
      });
    });
  }

  cachedFetch(url: string): Promise<any> {
    const cached = this.cache.get(url);
    if (cached) {
      if (Date.now() - cached.timestamp < this.cacheTTL) {
        return Promise.resolve(cached.data);
      }
      this.cache.delete(url);
    }

    // Evict oldest if at capacity
    if (this.cache.size >= this.maxCacheSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    return this.fetch(url).then(data => {
      this.cache.set(url, { data, timestamp: Date.now() });
      return data;
    });
  }

  async burstFetch(urls: string[], concurrency: number = 5): Promise<any[]> {
    const results: any[] = [];
    for (let i = 0; i < urls.length; i += concurrency) {
      const batch = urls.slice(i, i + concurrency);
      const batchResults = await Promise.all(batch.map(url => this.fetch(url)));
      results.push(...batchResults);
    }
    return results;
  }

  postWithAuth(url: string, apiKey: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url);
      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (url.startsWith('https') ? 443 : 80),
        path: parsedUrl.pathname,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      };
      
      const protocol = url.startsWith('https') ? https : http;
      const req = protocol.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(new Error('Invalid JSON response'));
          }
        });
      }).on('error', reject);
      
      req.write(JSON.stringify(data));
      req.end();
    });
  }

  async fetchJSON(url: string): Promise<any> {
    return this.fetch(url);
  }

  fetchWithFallback(primaryUrl: string, fallbackUrl: string): Promise<any> {
    return this.fetch(primaryUrl).catch(() => this.fetch(fallbackUrl));
  }
}

export const client = new NetworkClient();
