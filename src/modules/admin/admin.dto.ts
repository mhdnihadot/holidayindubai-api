import { IAdmin } from './admin.interface';

class AdminDTO {
  public id: string;
  public name: string;
  public email: string;
  public role: string;
  public createdAt: Date;

  constructor(admin: IAdmin) {
    this.id = admin._id as any;
    this.name = admin.name;
    this.email = admin.email;
    this.role = admin.role;
    this.createdAt = admin.createdAt;
  }

  static fromEntity(admin: IAdmin): AdminDTO {
    return new AdminDTO(admin);
  }

  static fromList(admins: IAdmin[]): AdminDTO[] {
    return admins.map(admin => new AdminDTO(admin));
  }
}

export default AdminDTO;
