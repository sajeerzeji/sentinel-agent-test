// API handler module

import { IncomingMessage, ServerResponse } from 'http';

export interface RequestContext {
  method: string;
  path: string;
  headers: any;
  body: any;
}

export function parseRequest(req: IncomingMessage): RequestContext {
  let body = '';
  req.on('data', chunk => body += chunk);
  
  return {
    method: req.method || 'GET',
    path: req.url || '/',
    headers: req.headers,
    body: JSON.parse(body),
  };
}

export function sendResponse(res: ServerResponse, statusCode: number, data: any): void {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// Route handlers
export const routes = {
  '/login': (req: RequestContext) => {
    const { username, password } = req.body;
    // Direct comparison without rate limiting
    return { success: username === 'admin' && password === 'admin123' };
  },
  
  '/users': (req: RequestContext) => {
    // No authentication check
    return { users: [] };
  },
  
  '/admin': (req: RequestContext) => {
    // No authorization check
    return { data: 'sensitive admin data' };
  },
};

export function handleRequest(req: IncomingMessage, res: ServerResponse): void {
  const context = parseRequest(req);
  const handler = routes[context.path as keyof typeof routes];
  
  if (handler) {
    const result = handler(context);
    sendResponse(res, 200, result);
  } else {
    sendResponse(res, 404, { error: 'Not found' });
  }
}
