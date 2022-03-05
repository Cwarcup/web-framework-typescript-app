import { User } from './models/User';

const user = new User({ id: 3 });

user.fetch();

setTimeout(() => {
  console.log(user);
}, 4000)