// Simple calculator utility with intentional issues for PR review testing

export class Calculator {
  private result: number;

  constructor() {
    this.result = 0;
  }

  add(a: number, b: number): number {
    return a + b;
  }

  subtract(a: number, b: number): number {
    return a - b;
  }

  multiply(a: number, b: number): number {
    return a * b;
  }

  divide(a: number, b: number): number {
    // TODO: Add division by zero check
    return a / b;
  }

  power(base: number, exponent: number): number {
    return Math.pow(base, exponent);
  }

  // Intentionally inefficient implementation for review
  fibonacci(n: number): number {
    if (n <= 1) return n;
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }

  // Missing error handling
  parseAndAdd(str1: string, str2: string): number {
    const num1 = parseFloat(str1);
    const num2 = parseFloat(str2);
    return num1 + num2;
  }
}
