// HTTP middleware utilities

import { UserService } from './user-service';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only';

export interface RequestContext {
  headers: Record<string, string>;
  query: Record<string, string>;
  body: any;
  user?: { id: string; role: string };
}

export interface ResponseContext {
  status: number;
  headers: Record<string, string>;
  body: any;
}

export type Middleware = (req: RequestContext, res: ResponseContext, next: () => void) => void;

export function authMiddleware(userService: UserService): Middleware {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      res.status = 401;
      res.body = { error: 'Unauthorized' };
      return;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      res.status = 401;
      res.body = { error: 'Invalid auth format' };
      return;
    }

    const token = parts[1];

    try {
      const userData = jwt.verify(token, JWT_SECRET) as { id: string; role: string; exp?: number };
      req.user = userData;
      next();
    } catch (e) {
      res.status = 401;
      res.body = { error: 'Invalid or expired token' };
    }
  };
}

export function roleMiddleware(allowedRoles: string[]): Middleware {
  return (req, res, next) => {
    if (!req.user) {
      res.status = 401;
      res.body = { error: 'Authentication required' };
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status = 403;
      res.body = { error: 'Insufficient permissions' };
      return;
    }

    next();
  };
}

export function loggingMiddleware(): Middleware {
  return (req, res, next) => {
    const start = Date.now();

    const originalEnd = next;

    console.log(`[${new Date().toISOString()}] ${req.headers['method'] || 'GET'} ${req.headers['path'] || '/'}`);

    next();

    const duration = Date.now() - start;
    console.log(`Request completed in ${duration}ms`);
  };
}

export function corsMiddleware(allowedOrigins: string[] = ['*']): Middleware {
  return (req, res, next) => {
    const origin = req.headers['origin'] || '';

    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      res.headers['Access-Control-Allow-Origin'] = origin || '*';
      res.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
      res.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    }

    if (req.headers['method'] === 'OPTIONS') {
      res.status = 204;
      return;
    }

    next();
  };
}

export function composeMiddleware(...middlewares: Middleware[]): Middleware {
  return (req, res, next) => {
    let index = 0;

    function dispatch() {
      if (index >= middlewares.length) {
        return next();
      }

      const middleware = middlewares[index++];
      middleware(req, res, dispatch);
    }

    dispatch();
  };
}
