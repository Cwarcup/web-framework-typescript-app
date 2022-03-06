// import { User } from './models/User';

// const user = new User({ name: 'new record', age: 0});

// A quick reminder on accessors

class Person {
  constructor(public firstName: string, public lastName: string) {}

  fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

const person = new Person('firstname', 'lastname');
console.log(person.fullName());