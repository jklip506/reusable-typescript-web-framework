import { User } from './models/User';

const user = new User({ name: 'John', age: 0 });


user.save();