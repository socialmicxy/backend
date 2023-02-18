const express = require("express");
const passport = require("passport");

const authRouter = express.Router();

//we import his becuase passport.authenticate('google') needs this
//configuration

require("../configs/passport-setup");

//auth login
authRouter.post("/login", (req, res) => {});

//auth logout
authRouter.get("/logout", (req, res) => {
  //handle with passport
  res.send("logging out");
});

//auth with google
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile"] })
);

//callback route for google to redirect to
//once we are authorized we get a code in the query params with key = code

//we use the auth code in our call back function to get the info we need
//so the authorization from google only gives us a code

//passport callback function in our setup file is fired before
//the rest of this function is fired

//passport knows we already have our authoriaztion code the second time we call
//passport.authenticate('google') so it by passing the authorization step
authRouter.get(
  "/google/redirect",
  passport.authenticate("google"),
  (req, res) => {
    res.send("you reached the call back uri");
    console.log(`Code is ${req.query.code}`);
    res.send("succes");
  }
);

module.exports = authRouter;
