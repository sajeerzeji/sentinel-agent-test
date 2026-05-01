import { describe, it, expect } from 'vitest';
import { validateEmail, formatDate, capitalize, safeCalculate, deepClone } from './utils';

describe('Utils', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@example.com')).toBe(true);
      expect(validateEmail('user+tag@example.co.uk')).toBe(true);
      // Leading/trailing whitespace should not affect validity
      expect(validateEmail('  test@example.com  ')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('invalid@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('invalid@')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('formatDate', () => {
    it('should format date to ISO string', () => {
      const date = new Date('2024-01-01T00:00:00Z');
      expect(formatDate(date)).toBe('2024-01-01T00:00:00.000Z');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('world')).toBe('World');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');
    });
  });

  describe('safeCalculate', () => {
    it('should evaluate valid mathematical expressions', () => {
      expect(safeCalculate('2 + 2')).toBe(4);
      expect(safeCalculate('10 * 5')).toBe(50);
      expect(safeCalculate('20 / 4')).toBe(5);
    });

    it('should return 0 for invalid expressions', () => {
      expect(safeCalculate('invalid')).toBe(0);
      expect(safeCalculate('2 +')).toBe(0);
    });
  });

  describe('deepClone', () => {
    it('should create a deep copy of an object', () => {
      const obj = { a: 1, b: { c: 2 } };
      const cloned = deepClone(obj);
      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
      expect(cloned.b).not.toBe(obj.b);
    });
  });
});
