import { User } from "./models/User";

const user = new User( {name: 'myname', age: 20 });

user.on('change-any-event', () => {});
user.on('change again', () => {});
user.on('change more', () => {});
console.log(user);