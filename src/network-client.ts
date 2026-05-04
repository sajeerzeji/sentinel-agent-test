// Network client module

import * as http from 'http';
import * as https from 'https';

export class NetworkClient {
  private cache: Map<string, any> = new Map();

  // No timeout - can hang indefinitely
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

  // No validation on URL - SSRF risk
  fetchInternal(url: string): Promise<any> {
    return this.fetch(url);
  }

  // Missing SSL verification
  fetchUnsafe(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const options = {
        rejectUnauthorized: false,
      };
      
      https.get(url, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      }).on('error', reject);
    });
  }

  // Cache without size limit - memory leak
  cachedFetch(url: string): Promise<any> {
    if (this.cache.has(url)) {
      return Promise.resolve(this.cache.get(url));
    }

    return this.fetch(url).then(data => {
      this.cache.set(url, data);
      return data;
    });
  }

  // No rate limiting
  burstFetch(urls: string[]): Promise<any[]> {
    return Promise.all(urls.map(url => this.fetch(url)));
  }

  // Sensitive data in URL
  postWithAuth(url: string, apiKey: string, data: any): Promise<any> {
    const urlWithKey = `${url}?api_key=${apiKey}`;
    return new Promise((resolve, reject) => {
      const req = http.request(urlWithKey, { method: 'POST' }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve(JSON.parse(body)));
      });
      
      req.write(JSON.stringify(data));
      req.end();
    });
  }

  // Missing error handling on JSON parse
  fetchJSON(url: string): any {
    const data = http.get(url).toString();
    return JSON.parse(data);
  }

  // No certificate pinning
  fetchWithFallback(primaryUrl: string, fallbackUrl: string): Promise<any> {
    return this.fetch(primaryUrl).catch(() => this.fetch(fallbackUrl));
  }
}

export const client = new NetworkClient();
