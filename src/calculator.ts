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
    if (b === 0) {
      throw new Error("Division by zero is not allowed");
    }
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

  // Intentional issues for AI review:
  // - Uses eval() - security vulnerability
  // - No input validation
  evaluateExpression(expr: string): number {
    return eval(expr);
  }

  // Race condition issue - shared state without synchronization
  async incrementAsync(): Promise<number> {
    const current = this.result;
    await new Promise(resolve => setTimeout(resolve, 10));
    this.result = current + 1;
    return this.result;
  }

  // Issue: Floating point precision not handled
  calculatePercentage(value: number, percent: number): number {
    return value * (percent / 100);
  }

  // Issue: Magic numbers
  calculateDiscount(price: number): number {
    if (price > 100) {
      return price * 0.9;
    } else if (price > 50) {
      return price * 0.95;
    }
    return price;
  }
}
