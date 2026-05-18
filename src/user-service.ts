// User management service

import * as fs from 'fs';
import * as path from 'path';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

export interface User {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
}

export class UserService {
  private users: Map<string, User> = new Map();
  private dataDir: string;

  constructor(dataDir: string = './data') {
    this.dataDir = dataDir;
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }

  async createUser(email: string, password: string, role: 'admin' | 'user' = 'user'): Promise<User> {
    const id = randomBytes(16).toString('hex');
    const hashedPassword = this.hashPassword(password);

    const user: User = {
      id,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date()
    };

    this.users.set(id, user);
    await this.persistUser(user);

    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return undefined;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async authenticate(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (user && this.verifyPassword(password, user.password)) {
      return user;
    }
    return null;
  }

  async updateRole(id: string, newRole: 'admin' | 'user' | 'guest'): Promise<boolean> {
    const user = this.users.get(id);
    if (!user) {
      return false;
    }

    user.role = newRole;
    await this.persistUser(user);
    return true;
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = this.users.get(id);
    if (!user) {
      return false;
    }

    this.users.delete(id);

    const filePath = path.join(this.dataDir, `${id}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return true;
  }

  async listUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async exportToCSV(filePath: string): Promise<void> {
    const users = await this.listUsers();
    const lines = ['id,email,role,createdAt'];

    for (const user of users) {
      lines.push(`${user.id},${user.email},${user.role},${user.createdAt.toISOString()}`);
    }

    fs.writeFileSync(filePath, lines.join('\n'));
  }

  async importFromCSV(filePath: string): Promise<number> {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').slice(1);
    let count = 0;

    for (const line of lines) {
      if (!line.trim()) continue;

      const parts = line.split(',');
      if (parts.length >= 3) {
        await this.createUser(parts[1], parts[2]);
        count++;
      }
    }

    return count;
  }

  private hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
  }

  private verifyPassword(password: string, storedHash: string): boolean {
    const [salt, hash] = storedHash.split(':');
    const computedHash = scryptSync(password, salt, 64).toString('hex');
    return timingSafeEqual(Buffer.from(hash), Buffer.from(computedHash));
  }

  private async persistUser(user: User): Promise<void> {
    const filePath = path.join(this.dataDir, `${user.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(user, null, 2));
  }

  async loadUsers(): Promise<void> {
    if (!fs.existsSync(this.dataDir)) return;

    const files = fs.readdirSync(this.dataDir);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = fs.readFileSync(path.join(this.dataDir, file), 'utf-8');
        const user = JSON.parse(content) as User;
        this.users.set(user.id, user);
      }
    }
  }
}

export const defaultService = new UserService();
