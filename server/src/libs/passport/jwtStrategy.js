import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../../models/user.js";
import config from "../../config/config.js";

const secretOrKey = config.jwt.secret;

const jwtLogin = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey
  },
  async (payload, done) => {
    try {
      const user = await User.findById(payload.sub);

      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (error) {
      done(error, false);
    }
  }
);

const useJwtStrategy = (passport) => {
  passport.use(jwtLogin);
};

export default useJwtStrategy;
