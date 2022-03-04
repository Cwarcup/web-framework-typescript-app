# Web Framework Notes

Setup parcel:
```
npm i -g parcel-bundler
parcel index.html
```
## Framework Structure

Inside our framework we will have two types of **classes.**
1. Model Classes:
   - Handle data, used to represent Users, Blog Posts, Images, etc.
2. View Classes:
  - Handle HTML and events cause by user (such as clicks).
---
class User
- Will need to create a class to represent a **User** and all of its data (like name and age).
  - User class needs to have the ability to store some data, retrieve data, and change it. 
  - needs ability to notify the rest of the app when data is changed. 
  - User needs to be able to persist data to an outside server, and also retrieve the data at some point.
---
**Extraction Approach**
- **Build** class User as a 'mega' **class** with lots of methods. 
- Refactor User to use **composition**.
- Refactor User to be a **reusable class** that can represent **any piece of data**, not just a User. 
---
**class User**
- private **data**: UserProps
  - object to store information about a particular user.
  - private = cannot access this property outside this class.
  - want to allow other devs to use other methods (get() and set()) to change the data.
- get(propName: string): (string | number)
  - **retrieve** a single piece of info about this user (name, age). `get('name')`
- set(update: UserProps): void
  - **changes** information about this user (name, age).
- on(eventName: string, callback: () => {})
  - **registers** an event handler with this object, so other parts of the app know when something changes.
- trigger(eventName: string): void
  - **triggers** an event to tell other parts of the app that something has changed.
- fetch(): Promise
  - **fetches** some data from the server about a particular user.
- save(): Promise
  - **saves** some data about this user to the server.

# Composition class User

```typescript
interface UserProps {
  name: string;
  age: number;
}

export class User {
  constructor(private data: UserProps) {}
  
  get(propName: string): (number | string) {
    return this.data[propName];
  }
}

// index.ts
import { User } from "./models/User";

const user = new User( {name: 'myname', age: 20 });

console.log(user.get('name'));
console.log(user.get('age'));
```

###  User set() method
```typescript
  set(update: UserProps): void {
    Object.assign(this.data, update);
  }
```
> Object.assign() takes the data from `update` and overwrites the data in `this.data`.

```typescript
// index.ts
import { User } from "./models/User";

const user = new User( {name: 'myname', age: 20 });

console.log(user.get('name')); // myname
console.log(user.get('age')); // 20

user.set({ name: 'newname', age: 9999 });

console.log(user.get('name')); // newname
console.log(user.get('age')); // 9999
```

> Issue: can not update only ONE property. 
> If we try to only update `name` we get an error.

Can solve issue by changing properties in `interface UserProps` to **optional.** Do this by adding `?` beside the optional property names.
```typescript
interface UserProps {
  name?: string;
  age?: number;
}

// index.ts
import { User } from "./models/User";

const user = new User( {name: 'myname', age: 20 });

console.log(user.get('name'));
console.log(user.get('age'));

user.set({ name: 'newname'}); // this will now work

console.log(user.get('name'));
console.log(user.get('age'));
```

### class User on() and trigger() method
`on(eventName: string, callback: () => {})`
Used to **register** an event handler with this object, so other parts of the app know when something changes.

`trigger` runs all the callback functions that have been registered by `on()`.

---
- indicate that `callback` is going to be a function by stating `() => void`.
- could also create a **type alias** for `() => void`.
```typescript
type Callback = () => void
class User {
  on(eventName: string, callback: Callback) {
// ...
  }
}
```
`eventName` could be 'click', 'hover', 'mouseover'. Need to be able to receive events and store them.

Will use an object to store all the types of callbacks.
**Keys** of the object will be **event names**. The **values** will be **arrays of all the Callbacks**.

Will store this property in class User:
```typescript
events: { [key: string]: Callback[] } = {};
```
> `[key: string]` could be any event. "click" "hoverover". This will store our event names. 
> ` Callback[]` states that the values will be an array of callback functions. 

```typescript
  on(eventName: string, callback: Callback): void {
    const handlers = this.data[eventName] || [];
    handlers.push(callback);
    this.events[eventName] = handlers;
  }
```
```typescript
// index.ts

import { User } from "./models/User";

const user = new User( {name: 'myname', age: 20 });

user.on('change-any-event', () => {

});

console.log(user);
// User {data: {…}, events: {…}}
// data: {name: 'myname', age: 20}
// events: {change-any-event: Array(1)}
// [[Prototype]]: Object
```
> we can confirm the `on()` method is working.