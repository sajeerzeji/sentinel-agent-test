// Main entry point for the sample project

export { Calculator } from './calculator';
export { formatDate, validateEmail, capitalize, safeCalculate, deepClone, debounce } from './utils';

// Example usage
const calc = new Calculator();
console.log(calc.add(5, 3));
console.log(calc.fibonacci(10));
