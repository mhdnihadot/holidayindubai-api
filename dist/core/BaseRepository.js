"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    async create(data) {
        return await this.model.create(data);
    }
    async findById(id) {
        return await this.model.findById(id);
    }
    async findOne(query, select = '') {
        return await this.model.findOne(query).select(select);
    }
    async find(query = {}, populate = null, select = '', sort = null) {
        let q = this.model.find(query).select(select);
        if (sort)
            q = q.sort(sort);
        if (populate)
            q = q.populate(populate);
        return await q;
    }
    async updateById(id, data) {
        return await this.model.findByIdAndUpdate(id, data, {
            returnDocument: 'after',
            runValidators: true,
        });
    }
    async deleteById(id) {
        return await this.model.findByIdAndDelete(id);
    }
    async count(query = {}) {
        return await this.model.countDocuments(query);
    }
}
exports.default = BaseRepository;
