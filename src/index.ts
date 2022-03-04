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
user.trigger('save')