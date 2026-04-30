import { describe, it, expect } from 'vitest';
import { validateEmail, formatDate, capitalize } from './utils';

describe('Utils', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@example.com')).toBe(true);
      expect(validateEmail('user+tag@example.co.uk')).toBe(true);
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
});
