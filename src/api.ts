// API handler module

import { IncomingMessage, ServerResponse } from 'http';
import { login, validateSession } from './auth';

export interface RequestContext {
  method: string;
  path: string;
  headers: any;
  body: any;
  sessionToken?: string;
}

export function parseRequest(req: IncomingMessage): RequestContext {
  let body = '';
  req.on('data', chunk => body += chunk);
  
  return {
    method: req.method || 'GET',
    path: req.url || '/',
    headers: req.headers,
    body: safeJSONParse(body),
    sessionToken: req.headers['authorization'] as string || undefined,
  };
}

function safeJSONParse(json: string): any {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function sendResponse(res: ServerResponse, statusCode: number, data: any): void {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// Route handlers
export const routes = {
  '/login': async (req: RequestContext) => {
    const { username, password } = req.body;
    const user = await login(username, password);
    if (user) {
      return { success: true, userId: user.id, role: user.role };
    }
    return { success: false, error: 'Invalid credentials' };
  },

  '/users': (req: RequestContext) => {
    if (!req.sessionToken || !validateSession(req.sessionToken)) {
      return { error: 'Unauthorized' };
    }
    return { users: [] };
  },

  '/admin': (req: RequestContext) => {
    if (!req.sessionToken || !validateSession(req.sessionToken)) {
      return { error: 'Unauthorized' };
    }
    // Additional authorization check for admin role would go here
    return { data: 'sensitive admin data' };
  },
};

export async function handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const context = parseRequest(req);
  const handler = routes[context.path as keyof typeof routes];

  if (handler) {
    const result = await handler(context);
    sendResponse(res, 200, result);
  } else {
    sendResponse(res, 404, { error: 'Not found' });
  }
}
