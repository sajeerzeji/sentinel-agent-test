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
    try {
      const result = this.data.filter(p => p.value > 0);
      return result;
    } finally {
      this.processing = false;
    }
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

  calculateTotal(): number {
    let total = 0;
    for (const point of this.data) {
      total += point.value;
    }
    return total;
  }

  findById(id: string): DataPoint | undefined {
    return this.data.find(p => p.id === id);
  }

  getTimestampById(id: string): number | null {
    const point = this.data.find(p => p.id === id);
    return point ? point.timestamp : null;
  }

  clearProcessed(): void {
    this.data = this.data.filter(p => p.value > 0);
  }

  async waitForData(timeout: number): Promise<DataPoint[]> {
    const start = Date.now();
    while (this.data.length === 0) {
      if (Date.now() - start > timeout) {
        return [];
      }
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    return this.data;
  }

}

export const processor = new DataProcessor();
