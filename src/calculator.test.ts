import { describe, it, expect } from 'vitest';
import { Calculator } from './calculator';

describe('Calculator', () => {
  describe('divide', () => {
    it('should divide two numbers correctly', () => {
      const calc = new Calculator();
      expect(calc.divide(10, 2)).toBe(5);
      expect(calc.divide(20, 4)).toBe(5);
    });

    it('should throw error when dividing by zero', () => {
      const calc = new Calculator();
      expect(() => calc.divide(10, 0)).toThrow('Division by zero is not allowed');
      expect(() => calc.divide(5, 0)).toThrow();
    });
  });

  describe('add', () => {
    it('should add two numbers correctly', () => {
      const calc = new Calculator();
      expect(calc.add(2, 3)).toBe(5);
      expect(calc.add(-1, 1)).toBe(0);
    });
  });

  describe('subtract', () => {
    it('should subtract two numbers correctly', () => {
      const calc = new Calculator();
      expect(calc.subtract(5, 3)).toBe(2);
      expect(calc.subtract(10, 5)).toBe(5);
    });
  });

  describe('multiply', () => {
    it('should multiply two numbers correctly', () => {
      const calc = new Calculator();
      expect(calc.multiply(3, 4)).toBe(12);
      expect(calc.multiply(2, 5)).toBe(10);
    });
  });

  describe('power', () => {
    it('should calculate power correctly', () => {
      const calc = new Calculator();
      expect(calc.power(2, 3)).toBe(8);
      expect(calc.power(5, 2)).toBe(25);
    });
  });
});
