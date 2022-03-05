# Web Framework Notes

Setup parcel:
```
npm i -g parcel-bundler
parcel index.html
```
start json-server
```
json-server --watch db.json
```
> Need both json-server and parcel running at the same time. 
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

## Trigger event callbacks

```typescript
// Users.ts
trigger(eventName: string): void {
    const handlers = this.events[eventName]; 
    
    //can be undefined when User is first created
    if(!handlers || handlers.length === 0) {
      return;
    }

    handlers.forEach((callback: Callback) => {
      callback();
    })
  }

  //index.ts
  import { User } from "./models/User";

const user = new User( {name: 'myname', age: 20 });

user.on('change', () => {
  console.log('change number one');
});
user.on('change', () => {
  console.log('change number two');
});
user.on('save', () => {
  console.log('save was triggered');
});


user.trigger('change')
// change number one
//change number two
user.trigger('save')
// save was triggered
```

# Adding JSON Server

- uses [JSON server from npm.](https://www.npmjs.com/package/json-server)
  - can receive information and store it in a json file.

```
npm install -g json-server
```
Whenever we run  `json-server` we need to point it to a actual json file which will save our data. 

Create a `db.json` file with some data.
```json
{
  "users": []
}
```
> Tells json-server that we are going to serve up a resource called 'users'. json-server will then create routes for us. 

Start JSON Server
```
json-server --watch db.json
```
json-server routes your 'user' to http://localhost:3000/users 

---

Want to use **axios** to communicate with our User model and the server.

Install Axios:
```
npm install axios
```

then start parcel:
```
parcel index.html
```

# REST Conventions
| Methods	|       Path     |      Result    |
| ------- | ------------- | -------------- |
|  GET   	|  /posts       | retrieve all posts |
|  GET  	|  /posts/:id   | retrieve posts with the given ID |
|  POST   |  /posts       |  create a new post |
|  PUT    |  /posts/:id   |  update a post |
|  DELETE |  /posts:id    | deletes a post |

```typescript
//index.ts
import axios from 'axios';

axios.post('http://localhost:3000/users', {
  name: 'myName',
  age: 20
})


// in Dev tools Network XHR
{name: "myName", age: 20, id: 19}
age: 20
id: 19
name: "myName"
```

All our models that need to be synced with a server need an 'ID' property. 
If a User does NOT have an ID, then this means it is NOT on the server. 

## Fetch Method
```typescript
  fetch(): void {
    axios
      .get(`http://localhost:3000/users/${this.get('id')}`)
      .then((response: AxiosResponse): void => {
        this.set(response.data)
      })
  }

 // index.ts
 import { User } from './models/User';

const user = new User({ id: 3 });

user.fetch();
```

## Save()

Have to check to see if our user has an ID.
If they have an ID, need to use **PUT** method because we are **updating** information on the server. 
If no ID is found, then we need to use **POST** method, because we are creating a new user. 

```typescript
save(): void {
    const id = this.get('id');

    if(id) {
      // put
      axios.put(`http://localhost:3000/users/${id}`, this.data)
    } else {
      // post
      axios.post('http://localhost:3000/users', this.data)
    }
  }

// index.ts
import { User } from './models/User';

const user = new User({ id: 1 });

user.set({ name: 'NEW NAME', age: 9999 });

user.save();
```
> after saving and running parcel and json-server, then you should see db.json update the new information. This is using the put method. 
> 