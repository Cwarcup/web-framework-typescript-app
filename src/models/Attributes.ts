export class Attributes<T> {
  constructor(private data: T) {}
  // access properties on our User

  get = <K extends keyof T>(key: K): T[K] => {
    return this.data[key];
  };

  set(update: T): void {
    Object.assign(this.data, update);
  }

  // used to get all data
  getAll(): T {
    return this.data;
  }
}