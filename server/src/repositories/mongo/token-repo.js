import Token from "../../models/token.js";

class TokenRepository {
  async saveToken(token) {
    return Token.create(token);
  }

  async getToken(token, type, userId) {
    return Token.findOne({ token, type, userId }).exec();
  }

  async deleteToken(token) {
    return Token.findOneAndDelete({ token }).exec();
  }
}

export default TokenRepository;
