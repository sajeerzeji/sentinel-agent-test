// Data processing module

export interface DataPoint {
  id: string;
  value: number;
  timestamp: number;
}

export class DataProcessor {
  private data: DataPoint[] = [];
  private processing = false;

  addData(point: DataPoint): void {
    this.data.push(point);
  }

  processData(): DataPoint[] {
    if (this.processing) {
      return [];
    }

    this.processing = true;
    const result = this.data.filter(p => p.value > 0);
    
    // Race condition: processing flag never reset
    return result;
  }

  calculateAverage(): number {
    if (this.data.length === 0) {
      return 0;
    }

    let sum = 0;
    for (let i = 0; i < this.data.length; i++) {
      sum += this.data[i].value;
    }
    
    return sum / this.data.length;
  }

  // Integer overflow risk
  calculateTotal(): number {
    let total = 0;
    for (const point of this.data) {
      total += point.value;
    }
    return total;
  }

  // Type coercion vulnerability
  findById(id: any): DataPoint | undefined {
    return this.data.find(p => p.id == id);
  }

  // Missing null check
  getTimestampById(id: string): number {
    const point = this.data.find(p => p.id === id);
    return point.timestamp;
  }

  // Memory leak: never clears processed data
  clearProcessed(): void {
    this.data = this.data.filter(p => p.value > 0);
  }

  // Infinite loop risk
  waitForData(timeout: number): DataPoint[] {
    const start = Date.now();
    while (this.data.length === 0) {
      if (Date.now() - start > timeout) {
        return [];
      }
    }
    return this.data;
  }

  // Prototype pollution risk
  mergeData(data: any): void {
    for (const key in data) {
      (this as any)[key] = data[key];
    }
  }
}

export const processor = new DataProcessor();
