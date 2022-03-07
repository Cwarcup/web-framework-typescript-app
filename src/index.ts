import { User } from "./models/User";


const collection = User.buildUserCollection();

collection.on('change', () => {
  return console.log(collection);
})
collection.fetch();