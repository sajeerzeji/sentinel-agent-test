// Utility functions with various code quality issues
import { Parser } from 'expr-eval';
import validator from 'validator';
import { db } from './database';
import { login, createSession } from './auth';

/**
 * Formats a Date object to an ISO 8601 string.
 * @param date - The Date object to format
 * @returns ISO 8601 formatted date string
 */
export function formatDate(date: Date): string {
  return date.toISOString();
}

/**
 * Validates email addresses using RFC 5322 compliant validation via validator.js.
 * This provides robust validation that handles edge cases and internationalized email addresses.
 * @param email - The email address to validate
 * @returns true if the email is valid, false otherwise
 */
export function validateEmail(email: string): boolean {
  // Use validator.js for RFC 5322 compliant email validation
  return validator.isEmail(email.trim());
}

/**
 * Capitalizes the first character of a string.
 * @param str - The string to capitalize
 * @returns The string with the first character capitalized, or the original string if empty
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Safe expression evaluation using expr-eval library
/**
 * Safely evaluates a mathematical expression using the expr-eval library.
 * Returns 0 if the expression is invalid or evaluation fails.
 * @param expression - The mathematical expression to evaluate
 * @returns The result of the evaluation, or 0 on error
 */
export function safeCalculate(expression: string): number {
  try {
    const parser = new Parser();
    return parser.evaluate(expression);
  } catch (e) {
    return 0;
  }
}

/**
 * Creates a deep clone of an object using JSON serialization.
 * Note: This does not handle functions, undefined, or circular references.
 * @param obj - Object to clone
 * @returns A deep copy of the object
 */
export function deepClone(obj: any): any {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Creates a debounced function that delays invoking `func` until after `wait` milliseconds
 * have elapsed since the last time the debounced function was invoked.
 * @param func - Function to debounce
 * @param wait - Delay in milliseconds
 * @returns A debounced wrapper function
 */
export function debounce(func: Function, wait: number): Function {
  let timeout: any;
  return function(...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// New utility functions with fixes

/**
 * Parses JSON with error handling
 */
export function parseJSON(json: string): any {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Authenticates user and stores session
 */
export async function authenticateUser(username: string, password: string): Promise<string | null> {
  const user = await login(username, password);
  if (user) {
    return createSession(user.id);
  }
  return null;
}
