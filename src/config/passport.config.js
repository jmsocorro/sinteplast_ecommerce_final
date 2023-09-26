import passport from "passport";
import mongoose from "mongoose";
import local from "passport-local";
import passport_jwt, { ExtractJwt } from "passport-jwt";
import GitHubStrategy from "passport-github2";
import userModel from "../models/users.Model.js";
import {
  createHash,
  createLogger,
  isValidPassword,
  generateToken,
  generateResetToken,
  extractCookie,
} from "../utils.js";
import config from "./config.js";

const userModelpp = mongoose.model(
  userModel.userCollection,
  userModel.userSchema
);

const LocalStrategy = local.Strategy;
const GithubStrategy = GitHubStrategy.Strategy;
const JWTStrategy = passport_jwt.Strategy;
const JWTExtract = passport_jwt.ExtractJwt;
const logger = createLogger();

const initializePassport = () => {
  // registro de usuario
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, age, email, role = "user" } = req.body;
        try {
          const regex =
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[_*-+.,;:@$!%*?&¿¡#·])[A-Za-z\d_*-+.,;:@$!%*?&¿¡#·]{8,}$/;
          let errortxt = [];
          (!first_name || first_name.length === 0) &&
            errortxt.push("first_name es obligatorio.");
          (!last_name || last_name.length === 0) &&
            errortxt.push("last_name es obligatorio.");
          (!email || email.length === 0) &&
            errortxt.push("email es obligatorio.");
          (!age || age.length === 0) && errortxt.push("age es obligatorio.");
          age &&
            (isNaN(age) || Number.isInteger(age) || age <= 0) &&
            errortxt.push("age tiene que ser un número positivo.");
          (!password || !regex.test(password)) &&
            errortxt.push(
              "password debe tener al entre 8 y 120 caracteres, al menos una mayúscula, una minúscula y un caracter especial."
            );
          const found = await userModelpp
            .findOne({ email: email })
            .lean()
            .exec();
          if (found !== null) {
            errortxt.push(
              "Ya se encuentra un usuario registrado con el mismo correo electrónico."
            );
          }
          if (errortxt.length > 0) {
            return done(null, false);
          } else {
            const user = {
              first_name,
              last_name,
              email,
              age,
              password: createHash(password),
              role,
            };
            const newUser = await userModelpp.create(user);
            return done(null, newUser);
          }
        } catch (error) {
          return done({ error: 6, errortxt: error });
        }
      }
    )
  );
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          logger.debug(Date.now() + " / " + username);
          if (
            username === config.ADMIN_EMAIL &&
            password === config.ADMIN_PASSWORD
          ) {
            const found = {
              _id: config.ADMIN_EMAIL,
              first_name: "Admin",
              last_name: "Coder",
              email: config.ADMIN_EMAIL,
              age: 0,
              role: "admin",
              cart: null,
            };
            const token = generateToken(found);
            found.token = token;
            return done(null, found);
          } else {
            const found = await userModelpp.findOne({
              email: username,
            });
            if (found !== null && isValidPassword(found, password)) {
              console.log(found)
              await userModelpp.findByIdAndUpdate(found._id, {
                last_connection: Date.now(),
              });
              const token = generateToken(found);
              found.token = token;
              return done(null, found);
            } else {
              return done(null, false);
            }
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.use(
    "reset",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          logger.debug(Date.now() + " / " + username);
          if (username === config.ADMIN_EMAIL) {
            /*
                        const found = {
                            _id: config.ADMIN_EMAIL,
                            first_name: "Admin",
                            last_name: "Coder",
                            email: config.ADMIN_EMAIL,
                            age: 0,
                            role: "admin",
                            cart: null,
                        };
                        const token = generateToken(found);
                        found.token = token;
                        */
            return done(null, false);
          } else {
            logger.debug(Date.now() + " / " + username);
            const found = await userModelpp.findOne({
              email: username,
            });
            const token = generateResetToken(found);
            found.token = token;
            return done(null, found);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: config.CLIENT_ID,
        clientSecret: config.CLIENT_SECRET,
        callbackURL: "http://localhost:8080/githubcallback",
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const useremail = profile._json.email
            ? profile._json.email
            : profile.emails[0].value;

          let user = await userModelpp.findOne({
            email: useremail,
          });
          if (!user) {
            const adduser = {
              first_name: profile._json.name,
              last_name: profile._json.login,
              email: useremail,
              age: 0,
              password: " ",
            };
            const newUser = await userModelpp.create(adduser);
            return done(null, newUser);
          }
          return done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([extractCookie]),
        secretOrKey: config.JWT_SECRET,
      },
      async (jwt_payload, done) => {
        done(null, jwt_payload.user);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    if (id === config.ADMIN_EMAIL) {
      const user = {
        _id: config.ADMIN_EMAIL,
        first_name: "Admin",
        last_name: "Coder",
        email: config.ADMIN_EMAIL,
        age: 0,
        role: "admin",
        cart: null,
      };
      done(null, user);
    } else {
      const user = await userModelpp.findById(id);
      done(null, user);
    }
  });
};

export default initializePassport;
