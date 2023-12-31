import jwt from "jsonwebtoken";
import moment from "moment-timezone";
import config from "../config/config.js";
import UserService from "./userService.js";
import ApiError from "../utils/ApiError.js";
import { HTTP_CODES } from "../config/constants.js";
import TokenRepository from "../repositories/mongo/token-repo.js";

const userService = new UserService();

class TokenService {
  constructor() {
    this.tokenRepository = new TokenRepository();
  }

  /**
   * Generate a JWT token
   * @param {ObjectId} userId - User ID for whom the token is being generated
   * @param {Moment} expires - Expiry time for the token
   * @param {string} type - Type of token (e.g., accessToken, refreshToken)
   * @param {string} [secret=config.jwt.secret] - Secret key for token signing
   * @returns {string} - Generated JWT token
   */
  generateToken(userId, expires, type, secret = config.jwt.secret) {
    const payload = {
      sub: userId,
      iat: moment().unix(),
      exp: expires.unix(),
      type
    };
    return jwt.sign(payload, secret);
  }

  /**
   * Save a token to the database
   * @param {string} token - Token to be saved
   * @param {ObjectId} userId - User ID associated with the token
   * @param {Moment} expires - Expiry time for the token
   * @param {string} type - Type of token (e.g., refreshToken, resetPasswordToken)
   * @param {boolean} [blacklisted=false] - Flag indicating whether the token is blacklisted
   * @returns {Promise<Token>} - Saved token document
   */
  async saveToken(token, userId, expires, type, blacklisted = false) {
    const tokenDoc = {
      token,
      user: userId,
      expires: expires.toDate(),
      type,
      blacklisted
    };
    await this.tokenRepository.saveToken(tokenDoc);
    return tokenDoc;
  }

  /**
   * Verify the validity of a token
   * @param {string} token - Token to be verified
   * @param {string} type - Type of token (e.g., accessToken, resetPasswordToken)
   * @returns {Promise<Token>} - Token document if valid, else throws an error
   */
  async verifyToken(token, type) {
    const payload = jwt.verify(token, config.jwt.secret);
    const tokenDoc = await this.tokenRepository.getToken(
      token,
      type,
      payload.sub
    );

    if (!tokenDoc) {
      throw new Error("Token not found");
    }
    return tokenDoc;
  }

  async generateAuthTokens(user) {
    const accessTokenExpires = moment().add(
      config.jwt.accessExpirationMinutes,
      "minutes"
    );
    const accessToken = this.generateToken(
      user.id,
      accessTokenExpires,
      "accessToken"
    );

    const refreshTokenExpires = moment().add(
      config.jwt.refreshExpirationDays,
      "days"
    );
    const refreshToken = this.generateToken(
      user.id,
      refreshTokenExpires,
      "refreshToken"
    );
    await this.saveToken(
      refreshToken,
      user.id,
      refreshTokenExpires,
      "refreshToken"
    );

    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires.toDate()
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires.toDate()
      }
    };
  }

  async generateResetPasswordToken(email) {
    const user = await userService.getUserByEmail(email);
    if (!user) {
      throw new ApiError(
        HTTP_CODES.NOT_FOUND,
        "No users found with this email"
      );
    }
    const expires = moment().add(
      config.jwt.resetPasswordExpirationMinutes,
      "minutes"
    );
    const resetPasswordToken = this.generateToken(
      user.id,
      expires,
      "resetPasswordToken"
    );
    await this.saveToken(
      resetPasswordToken,
      user.id,
      expires,
      "resetPasswordToken"
    );
    return resetPasswordToken;
  }

  async generateVerifyEmailToken(user) {
    const expires = moment().add(
      config.jwt.verifyEmailExpirationMinutes,
      "minutes"
    );
    const verifyEmailToken = this.generateToken(
      user.id,
      expires,
      "verifyEmailToken"
    );
    await this.saveToken(
      verifyEmailToken,
      user.id,
      expires,
      "verifyEmailToken"
    );
    return verifyEmailToken;
  }
}

export default TokenService;
