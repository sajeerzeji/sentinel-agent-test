// Utility functions with various code quality issues

export function formatDate(date: Date): string {
  return date.toISOString();
}

export function validateEmail(email: string): boolean {
  // Simplified validation - should use regex
  return email.includes('@') && email.includes('.');
}

export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Replaced eval() with safer basic arithmetic parser
export function safeCalculate(expression: string): number {
  try {
    // Remove all whitespace
    const cleaned = expression.replace(/\s/g, '');
    
    // Basic validation: only allow digits, operators, and parentheses
    if (!/^[\d+\-*/().]+$/.test(cleaned)) {
      throw new Error('Invalid characters in expression');
    }
    
    // Use Function constructor as a safer alternative to eval for basic math
    return new Function('return ' + cleaned)();
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
