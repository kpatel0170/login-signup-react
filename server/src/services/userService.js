import ApiError from "../utils/ApiError.js";
import { HTTP_CODES, AUTH_MESSAGES } from "../config/constants.js";
import UserRepository from "../repositories/mongo/user-repo.js";

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Create a user
   * @param {Object} userBody
   * @returns {Promise<User>}
   */
  async createUser(userBody) {
    const existingUser = await this.userRepository.getUserByEmail(
      userBody.email
    );
    if (existingUser) {
      throw new ApiError(HTTP_CODES.BAD_REQUEST, AUTH_MESSAGES.EXISTS_EMAIL);
    }

    return this.userRepository.createUser(userBody);
  }

  /**
   * Get all users
   * @returns {Promise<User[]>}
   */
  async getAllUsers() {
    return this.userRepository.getAllUsers();
  }

  /**
   * Query for users
   * @param {Object} filter - Mongo filter
   * @param {Object} options - Query options
   * @returns {Promise<QueryResult>}
   */
  async queryUsers(filter, options) {
    const users = await this.userRepository.queryUsers(filter, options);
    return users;
  }

  /**
   * Get user by ID
   * @param {ObjectId} id - User ID
   * @returns {Promise<User>}
   */
  async getUserById(id) {
    return this.userRepository.getUserById(id);
  }

  /**
   * Get user by email
   * @param {string} email - User email
   * @returns {Promise<User>}
   */
  async getUserByEmail(email) {
    return this.userRepository.getUserByEmail(email);
  }

  /**
   * Update user by ID
   * @param {ObjectId} userId - User ID
   * @param {Object} updateBody - Data to update
   * @returns {Promise<User>}
   */
  async updateUserById(userId, updateBody) {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new ApiError(HTTP_CODES.NOT_FOUND, AUTH_MESSAGES.USER_NOT_FOUND);
    }
    const existingUser = await this.userRepository.getUserByEmail(
      updateBody.email
    );
    if (existingUser && existingUser._id.toString() !== userId) {
      throw new ApiError(HTTP_CODES.BAD_REQUEST, AUTH_MESSAGES.EMAIL_EXISTS);
    }
    await this.userRepository.updateUserById(userId, updateBody);
    return this.userRepository.getUserById(userId);
  }

  /**
   * Delete user by ID
   * @param {ObjectId} userId - User ID
   * @returns {Promise<User>}
   */
  async deleteUserById(userId) {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new ApiError(HTTP_CODES.NOT_FOUND, AUTH_MESSAGES.USER_NOT_FOUND);
    }
    await this.userRepository.deleteUserById(userId);
    return user;
  }
}

export default UserService;
