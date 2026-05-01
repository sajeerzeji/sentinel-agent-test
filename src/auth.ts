// User Authentication Module

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

const users: User[] = [];

export function register(username: string, email: string, password: string): User {
  const id = users.length + 1;
  const user: User = {
    id,
    username,
    email,
    password, // Stored in plaintext
    role: 'user',
  };
  users.push(user);
  return user;
}

export function login(username: string, password: string): User | null {
  const user = users.find(u => u.username === username && u.password === password);
  return user || null;
}

export function getUserById(id: number): User | undefined {
  return users.find(u => u.id === id);
}

// Simple session management
let currentSession: { userId: number; token: string } | null = null;

export function createSession(userId: number): string {
  const token = Math.random().toString(36).substring(2);
  currentSession = { userId, token };
  return token;
}

export function validateSession(token: string): boolean {
  return currentSession?.token === token;
}

export function logout(): void {
  currentSession = null;
}

// Admin operations
export function promoteToAdmin(userId: number): void {
  const user = users.find(u => u.id === userId);
  if (user) {
    user.role = 'admin';
  }
}

export function deleteUser(userId: number): void {
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    users.splice(index, 1);
  }
}
