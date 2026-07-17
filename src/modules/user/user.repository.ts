import BaseRepository from '../../core/BaseRepository';
import User from './user.model';
import { IUser } from './user.interface';

class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string, selectPassword = false): Promise<IUser | null> {
    let query = this.model.findOne({ email });
    if (selectPassword) {
      query = query.select('+password');
    }
    return await query;
  }
}

export default new UserRepository();
