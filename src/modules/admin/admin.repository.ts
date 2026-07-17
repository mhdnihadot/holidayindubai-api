import BaseRepository from '../../core/BaseRepository';
import Admin from './admin.model';
import { IAdmin } from './admin.interface';

class AdminRepository extends BaseRepository<IAdmin> {
  constructor() {
    super(Admin);
  }

  async findByEmail(email: string, selectPassword = false): Promise<IAdmin | null> {
    let query = this.model.findOne({ email });
    if (selectPassword) {
      query = query.select('+password');
    }
    return await query;
  }
}

export default new AdminRepository();
