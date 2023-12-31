// UserRepository.js

import User from "../../models/user.js";

class UserRepository {
  async createUser(userBody) {
    return User.create(userBody);
  }

  async getAllUsers() {
    return User.find();
  }

  async queryUsers(filter, options) {
    return User.paginate(filter, options).exec();
  }

  async getUserById(id) {
    return User.findOne({ _id: id }).exec();
  }

  async getUserByEmail(email) {
    return User.findOne({ email }).exec();
  }

  async updateUserById(userId, updateBody) {
    return User.findOneAndUpdate({ _id: userId }, updateBody, {
      new: true
    }).exec();
  }

  async deleteUserById(userId) {
    return User.findOneAndDelete({ _id: userId }).exec();
  }
}

export default UserRepository;
