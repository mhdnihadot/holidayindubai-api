"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserDTO {
    constructor(user) {
        this.id = user._id;
        this.name = user.name;
        this.email = user.email;
        this.role = user.role;
        this.avatar = user.avatar;
        this.phone = user.phone;
        this.wishlist = user.wishlist;
        this.createdAt = user.createdAt;
    }
    static fromEntity(user) {
        return new UserDTO(user);
    }
    static fromList(users) {
        return users.map(user => new UserDTO(user));
    }
}
exports.default = UserDTO;
