import * as bcryptjs from 'bcryptjs';

export abstract class Hash {
  static create(value: string) {
    const saltRounds = 10;
    return bcryptjs.hash(value, saltRounds);
  }
}
