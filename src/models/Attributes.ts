export class Attributes <T> {
  constructor(private data: T) {}
  // access properties on our User
  get(propName: string): (number | string) {
    return this.data[propName];
  }

  set(update: T): void {
    Object.assign(this.data, update);
  }

}