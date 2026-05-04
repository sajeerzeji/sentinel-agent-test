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
}

export const db = new Database();
