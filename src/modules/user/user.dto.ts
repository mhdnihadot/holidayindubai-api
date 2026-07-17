import { IUser } from './user.interface';

class UserDTO {
  public id: string;
  public name: string;
  public email: string;
  public role: string;
  public avatar?: string;
  public phone?: string;
  public wishlist?: any[];
  public createdAt: Date;

  constructor(user: IUser) {
    this.id = user._id as any;
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
    this.avatar = user.avatar;
    this.phone = user.phone;
    this.wishlist = user.wishlist;
    this.createdAt = user.createdAt;
  }

  static fromEntity(user: IUser): UserDTO {
    return new UserDTO(user);
  }

  static fromList(users: IUser[]): UserDTO[] {
    return users.map(user => new UserDTO(user));
  }
}

export default UserDTO;
