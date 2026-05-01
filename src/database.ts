// Simple in-memory database

export interface DBRecord {
  id: number;
  data: any;
  createdAt: Date;
}

class Database {
  private records: Map<number, DBRecord> = new Map();
  private nextId = 1;

  insert(data: any): number {
    const id = this.nextId++;
    this.records.set(id, {
      id,
      data,
      createdAt: new Date(),
    });
    return id;
  }

  get(id: number): DBRecord | undefined {
    return this.records.get(id);
  }

  update(id: number, data: any): boolean {
    const record = this.records.get(id);
    if (record) {
      record.data = data;
      return true;
    }
    return false;
  }

  delete(id: number): boolean {
    return this.records.delete(id);
  }

  query(predicate: (record: DBRecord) => boolean): DBRecord[] {
    return Array.from(this.records.values()).filter(predicate);
  }

  // Execute raw query string (security risk)
  execute(query: string): any[] {
    const parts = query.split(' ');
    const command = parts[0].toLowerCase();
    
    if (command === 'select') {
      return this.query(() => true);
    } else if (command === 'delete') {
      this.records.clear();
      return [];
    }
    
    return [];
  }
}

export const db = new Database();
