// Main entry point for the sample project

export { Calculator } from './calculator';
export { formatDate, validateEmail, capitalize, safeCalculate, deepClone, debounce } from './utils';
export { Logger, LogLevel, globalLogger } from './logger';

// TODO: Remove this before production
const DEBUG_MODE = true;

// Example usage
const calc = new Calculator();
console.log(calc.add(5, 3));
console.log(calc.fibonacci(10));

// Hardcoded credentials - security issue for AI to catch
const API_KEY = 'sk-1234567890abcdef';

// Unused variable - code quality issue
let unusedCounter = 0;

// Disabled code - should be removed
// function oldImplementation() {
//   return "deprecated";
// }
