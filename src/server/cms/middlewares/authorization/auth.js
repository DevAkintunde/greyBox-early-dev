import passport from "koa-passport";
import bcrypt from "bcryptjs";
import Admin from "../../models/entities/accounts/Admin.model.js";
import sequelize from "../../config/db.config.js";

import {
  BASE_URL,
  API_ENDPOINT,
  JWEB_TOKEN_KEY,
  googleID,
  googleSECRET,
  fbID,
  fbSECRET,
  twitterKEY,
  twitterSECRET,
  inKEY,
  inSECRET,
} from "../../utils/secrets.js";
import * as accountController from "../../controllers/account.controller.js";
import LocalStrategy from "passport-local";
import JwtStrategy from "passport-jwt";
import ExtractJwt from "passport-jwt";
import GoogleStrategy from "passport-google-oauth20";
import FacebookStrategy from "passport-facebook";
//import LinkedInStrategy from "passport-linkedin";

export const passportConfig = async (passport) => {
  /**
   * Serialize user
   *
   * @param object        user account info
   */
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  /**
   * Deserialize user from session
   *
   * @param string email as id   User account email
   * @returns
   */
  passport.deserializeUser(async (user, done) => {
    console.log("user 2222: ", user);
    if (user) {
      done(null, user);
    }
  });

  /**
   * Localstrategy of Passport.js
   *
   * @param string        email
   * @param string        password
   * @returns
   */
  // user accounts.
  // defaults to general accounts but when admin specific accounts is imported,
  // specify by passing 'Admin' or any other specific account model type in the passport.userType attribute.
  passport.use(
    new LocalStrategy.Strategy(
      {
        usernameField: "email",
        //passwordField: 'password',
        session:
          passport.requestToken && passport.requestToken === "session"
            ? true
            : false,
      },
      (email, password, done) => {
        let accountType = passport.userType ? passport.userType : "Admin";
        accountController.signInLocal(accountType, email, password, done);
      }
    )
  );

  /**
   * Jwtstrategy of Passport.js
   *
   * @param object        opt
   * @param function      callback
   * @returns
   */
  //Jwt is used secondarily for auth.
  // if token is preferred in case of mobile app, set X-requestToken as 'bearer' in a custom incoming request header.
  // session and token generation are turned turned off by default.
  // using header key: X-requestToken: '*'.

  let opts = {
    jwtFromRequest: ExtractJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWEB_TOKEN_KEY,
    //issuer: 'accounts.examplesoft.com',
    //audience: 'yoursite.net',
  };
  passport.use(
    new JwtStrategy.Strategy(opts, function (jwt_payload, done) {
      if (jwt_payload.profile.email) {
        done(null, jwt_payload.profile);
      } else {
        done(null, false);
      }
    })
  );

  /**
   * google strategy of Passport.js
   *
   * @param
   * @returns
   */
  /*  passport.use(
    new GoogleStrategy(
      {
        clientID: googleID,
        clientSecret: googleSECRET,
        callbackURL:
          BASE_URL +
          ":" +
          (process.env.PORT || 3000) +
          API_ENDPOINT +
          "account/signwith/google/callback",
        passReqToCallback: true,
      },
      (request, accessToken, refreshToken, profile, done) => {
        let accountType = passport.userType ? passport.userType : "Admin";
        accountController.signWithApp(
          "google",
          accountType,
          request,
          accessToken,
          refreshToken,
          profile,
          done
        );
      }
    )
  ); */

  /**
   * Facebook strategy of Passport.js
   *
   * @param
   * @returns
   */

  /*  passport.use(
    new FacebookStrategy.Strategy()(
      {
        clientID: "facebook-app-id",
        clientSecret: "facebook-app-secret",
        callbackURL:
          "http://localhost:" +
          (process.env.PORT || 3000) +
          "/users/auth/facebook/callback",
        profileFields: ["id", "displayName", "name", "photos", "email"],
      },
      async (token, tokenSecret, profile, done) => {
        // Retrieve admin from database, if exists
        const admin = await Admin.findOne(profile.emails[0].value);
        if (admin) {
          done(null, admin);
        } else {
          // If admin not exist, create it
          const newAdmin = {
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            password: "password-is-from-google",
            email: profile.emails[0].value,
          };
          const createdAdmin = await Admin.create(newAdmin);
          if (createdAdmin) {
            done(null, createdAdmin);
          } else {
            done(null, false);
          }
        }
      }
    )
  ); */

  /**
   * Twitter strategy of Passport.js
   *
   * @param
   * @returns
   */
  /* const TwitterStrategy = require("passport-twitter").Strategy;
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: "twitter-client-id",
        consumerSecret: "twitter-client-secret",
        callbackURL:
          "http://localhost:" +
          (process.env.PORT || 3000) +
          "/users/auth/twitter/callback",
        includeEmail: true,
      },
      async (token, tokenSecret, profile, done) => {
        // Retrieve admin from database, if exists
        const admin = await Admin.findOne(profile.emails[0].value);
        if (admin) {
          done(null, admin);
        } else {
          // If admin not exist, create it
          const newAdmin = {
            firstName: profile.username,
            lastName: profile.username,
            password: "password-is-from-twitter",
            email: profile.emails[0].value,
          };
          const createdAdmin = await Admin.create(newAdmin);
          if (createdAdmin) {
            done(null, createdAdmin);
          } else {
            done(null, false);
          }
        }
        console.log(profile);
      }
    )
  );
   */
  /**
   * LinkedIn strategy of Passport.js
   *
   * @param
   * @returns
   */

  /*  passport.use(
    new LinkedInStrategy.Strategy()(
      {
        consumerKey: "linkedin-api-key",
        consumerSecret: "linkedin-secret-key",
        callbackURL:
          "http://localhost:" +
          (process.env.PORT || 3000) +
          "/users/auth/linkedin/callback",
      },
      async (token, tokenSecret, profile, done) => {
        // Retrieve admin from database, if exists
        const admin = await Admin.findOne(profile.emails[0].value);
        if (admin) {
          done(null, admin);
        } else {
          // If admin not exist, create it
          const newAdmin = {
            firstName: profile.username,
            lastName: profile.username,
            password: "password-is-from-linkedin",
            email: profile.emails[0].value,
          };
          const createdAdmin = await Admin.create(newAdmin);
          if (createdAdmin) {
            done(null, createdAdmin);
          } else {
            done(null, false);
          }
        }
      }
    )
  ); */
};
