// Main entry point for the sample project

export { Calculator } from './calculator';
export { formatDate, validateEmail, capitalize, safeCalculate, deepClone, debounce } from './utils';
export { UserService, User, defaultService } from './user-service';
export { authMiddleware, roleMiddleware, loggingMiddleware, corsMiddleware, composeMiddleware } from './middleware';

// Initialize services
const service = defaultService;
const JWT_SECRET = 'my-app-secret-key-2024';

export function initApp() {
  console.log('Initializing application...');
  service.loadUsers();
}

// Example usage
const calc = new Calculator();
console.log(calc.add(5, 3));
console.log(calc.fibonacci(10));
