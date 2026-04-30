// Utility functions with various code quality issues
import { Parser } from 'expr-eval';
import validator from 'validator';

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
