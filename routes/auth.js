const express = require("express");
const User = require("../models/user");

const authRouter = express.Router();

authRouter.post("/login", (req, res) => {
  if (req.session.user) req.session.destroy();
  User.findOne({ email: req.body.email }).then((result) => {
    if (result) {
      req.session.user = {
        userId: result._id.toString(),
        email: result.email,
      };
      res.send({ succes: true });
    } else {
      User.create({
        username: req.body.name,
        profileUrl: req.body.picture,
        email: req.body.email,
        googleId: req.body.credential,
        connectedAccounts: [],
        musicsyncspace: false,
      }).then((result) => {
        req.session.user = {
          userId: result._id.toString(),
          email: result.email,
        };
        res.send({ succes: true });
      });
    }
  });
});

authRouter.post("/logout", (req, res) => {
  if (req.session.user) {
    req.session.destroy();
    res.send(JSON.stringify("Login"));
  } else {
    res.send(JSON.stringify("You are not Login"));
  }
});
authRouter.post("/check-login", (req, res) => {
  if (req.session.user) {
    User.findOne({ email: req.session.user.email })
      .then((result) => {
        if (result) {
          res.send({ payload: result, succes: true });
        } else {
          res.send({ succes: false });
        }
      })
      .catch((err) => {
        return;
      });
  } else {
    res.send({ succes: false });
  }
});
module.exports = authRouter;
