import { generate } from 'randomstring';
import { User } from './user';

export class Room {
  id: string;
  members: (User & { janken?: string })[] = [];
  winner?: User;
  constructor(public hostUser: User) {
    this.id = generate({
      charset: 'alphabetic',
      capitalization: 'uppercase',
      length: 6,
    });
    this.members.push(this.hostUser);
  }
}
