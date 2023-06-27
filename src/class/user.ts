export class User {
  name?: string;
  constructor(public socketId: string, public id: string) {}
}
