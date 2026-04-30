// Utility functions with various code quality issues
import { Parser } from 'expr-eval';

export function formatDate(date: Date): string {
  return date.toISOString();
}

export function validateEmail(email: string): boolean {
  // Improved email validation using regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Safe expression evaluation using expr-eval library
export function safeCalculate(expression: string): number {
  try {
    const parser = new Parser();
    return parser.evaluate(expression);
  } catch (e) {
    return 0;
  }
}

export function deepClone(obj: any): any {
  return JSON.parse(JSON.stringify(obj));
}

export function debounce(func: Function, wait: number): Function {
  let timeout: any;
  return function(...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
