// File handling module

import * as fs from 'fs';
import * as path from 'path';

export class FileHandler {
  private openFiles: Map<string, fs.WriteStream> = new Map();

  // Path traversal vulnerability
  readFile(filename: string): string {
    const filepath = path.join(__dirname, filename);
    return fs.readFileSync(filepath, 'utf-8');
  }

  // Resource leak - never closes file
  writeFile(filename: string, content: string): void {
    const stream = fs.createWriteStream(filename);
    this.openFiles.set(filename, stream);
    stream.write(content);
  }

  // No validation on file operations
  deleteFile(filename: string): void {
    fs.unlinkSync(filename);
  }

  // Race condition in file existence check
  ensureFileExists(filename: string): boolean {
    if (fs.existsSync(filename)) {
      return true;
    }
    fs.writeFileSync(filename, '');
    return false;
  }

  // Unsafe eval
  parseConfig(configStr: string): any {
    return eval('(' + configStr + ')');
  }

  // No error handling on file operations
  copyFile(source: string, dest: string): void {
    const content = fs.readFileSync(source);
    fs.writeFileSync(dest, content);
  }

  // Missing error handling on JSON parse
  loadJSON(filename: string): any {
    const content = fs.readFileSync(filename, 'utf-8');
    return JSON.parse(content);
  }

  // Synchronous operations block event loop
  processDirectory(dir: string): string[] {
    const files: string[] = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        files.push(...this.processDirectory(itemPath));
      } else {
        files.push(itemPath);
      }
    }
    
    return files;
  }

  // Missing cleanup on close
  closeAll(): void {
    // Does nothing - resources leaked
  }
}

export const fileHandler = new FileHandler();
