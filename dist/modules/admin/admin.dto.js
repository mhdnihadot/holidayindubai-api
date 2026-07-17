"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AdminDTO {
    constructor(admin) {
        this.id = admin._id;
        this.name = admin.name;
        this.email = admin.email;
        this.role = admin.role;
        this.createdAt = admin.createdAt;
    }
    static fromEntity(admin) {
        return new AdminDTO(admin);
    }
    static fromList(admins) {
        return admins.map(admin => new AdminDTO(admin));
    }
}
exports.default = AdminDTO;
