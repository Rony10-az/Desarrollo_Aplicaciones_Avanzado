import User from "../models/User.js";


class UserRepository {
    async create(user) {
        return await User.create(user);
    }
    async findAll() {
        return await User.find();
    }
    async findById(id) {
        return await User.findById(id);
    }
    async update(id, data) {
        return await User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }
    async delete(id) {
        return await User.findByIdAndDelete(id);
    }
}
export default new UserRepository();