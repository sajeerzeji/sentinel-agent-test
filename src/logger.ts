// Logging module with intentional issues

import * as fs from 'fs';
import * as path from 'path';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export class Logger {
  private logLevel: LogLevel;
  private logFile: string;
  private logs: string[] = [];

  constructor(logLevel: LogLevel = LogLevel.INFO, logFile?: string) {
    this.logLevel = logLevel;
    // Security issue: Path traversal vulnerability
    this.logFile = logFile || '/var/log/app.log';
  }

  // Issue: No input validation - vulnerable to log injection
  log(level: LogLevel, message: string): void {
    if (level < this.logLevel) {
      return;
    }

    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${LogLevel[level]}] ${message}`;
    
    // Issue: Storing all logs in memory - memory leak potential
    this.logs.push(logEntry);

    console.log(logEntry);
    
    // Issue: Synchronous file write - blocking operation
    if (this.logFile) {
      fs.appendFileSync(this.logFile, logEntry + '\n');
    }
  }

  debug(msg: string): void {
    this.log(LogLevel.DEBUG, msg);
  }

  info(msg: string): void {
    this.log(LogLevel.INFO, msg);
  }

  warn(msg: string): void {
    this.log(LogLevel.WARN, msg);
  }

  error(msg: string): void {
    this.log(LogLevel.ERROR, msg);
  }

  // Issue: Exposes internal state directly - encapsulation violation
  getAllLogs(): string[] {
    return this.logs;
  }

  // Issue: No error handling, potential DoS with large data
  exportLogsToFile(filename: string): void {
    const data = this.logs.join('\n');
    fs.writeFileSync(filename, data);
  }

  // Issue: SQL injection style vulnerability in log search
  searchLogs(keyword: string): string[] {
    // Intentionally vulnerable to regex injection
    const regex = new RegExp(keyword);
    return this.logs.filter(log => regex.test(log));
  }

  // Issue: Resource leak - no cleanup method
  clearLogs(): void {
    this.logs = [];
  }
}

// Issue: Global mutable state - singleton anti-pattern
export let globalLogger = new Logger(LogLevel.DEBUG);

// Issue: Type safety gap - any usage
export function createLoggerFromConfig(config: any): Logger {
  const level = config?.level ?? LogLevel.INFO;
  const file = config?.file;
  return new Logger(level, file);
}
