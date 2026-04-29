# Sentinel Agent Test Project

This is a sample TypeScript project designed for testing the PR review agent. It contains intentional code quality issues and areas for improvement that a PR reviewer should identify.

## Project Structure

```
sentinel-agent-test/
├── src/
│   ├── calculator.ts    # Calculator class with various issues
│   ├── utils.ts         # Utility functions with security and quality issues
│   └── index.ts         # Main entry point
├── package.json
├── tsconfig.json
└── README.md
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Project

```bash
npm run build
```

## Known Issues for PR Review Testing

This project intentionally contains several code quality issues that a PR review agent should catch:

### In `src/calculator.ts`:
- **Division by zero**: The `divide()` method lacks zero-division checks
- **Inefficient algorithm**: The `fibonacci()` method uses recursive implementation without memoization
- **Missing error handling**: `parseAndAdd()` doesn't handle invalid input

### In `src/utils.ts`:
- **Security vulnerability**: `safeCalculate()` uses `eval()` which is unsafe
- **Weak validation**: `validateEmail()` has oversimplified email validation
- **Type safety**: `deepClone()` and `debounce()` use `any` types
- **Missing null checks**: `capitalize()` doesn't handle null/undefined properly

## Using This for PR Review Testing

1. **Push to GitHub**: Create a GitHub repository and push this project
2. **Create PRs**: Make changes to the code and create pull requests
3. **Configure PR Review Agent**: Point your PR review agent to this repository
4. **Test Review Capabilities**: The agent should identify the intentional issues above

## Example PR Scenarios

### Scenario 1: Fix Division by Zero
```typescript
// Before
divide(a: number, b: number): number {
  return a / b;
}

// After
divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Division by zero");
  }
  return a / b;
}
```

### Scenario 2: Remove eval() Usage
```typescript
// Before
export function safeCalculate(expression: string): number {
  try {
    return eval(expression);
  } catch (e) {
    return 0;
  }
}

// After
export function safeCalculate(expression: string): number {
  // Use a safer alternative like math.js library
  // Or implement a simple parser
  return 0; // Placeholder
}
```

### Scenario 3: Improve Email Validation
```typescript
// Before
export function validateEmail(email: string): boolean {
  return email.includes('@') && email.includes('.');
}

// After
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

## License

MIT
