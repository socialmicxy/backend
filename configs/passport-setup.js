const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const keys = require("../configs/keys");
const User = require("../models/User");

//Tell passport we want to use the Google Strategy
//Takes in two params
//1 - Strategu
//2 - Call back ~ fires at some point during auth process

passport.use(
  new GoogleStrategy(
    {
      callbackURL: "/api/auth/google/redirect",
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("call back function fired");
      console.log(`access token is ${accessToken}`);
      console.log(profile._json);

      const gid = profile._json.sub;
      User.findOne({ googleId: gid }).then((currUser) => {
        if (currUser) {
          console.log("user already exists " + currUser);
        } else {
          new User({ username: profile._json.name, googleId: gid })
            .save()
            .then((newUser) => {
              console.log("new user created " + newUser);
            })
            .catch((err) => {
              console.log("could not create user " + err);
            });
        }
      });
    }
  )
);
