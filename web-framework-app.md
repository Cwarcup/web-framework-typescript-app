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

# Composition

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
```

