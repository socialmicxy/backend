const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const private_key = fs.readFileSync("AuthKey_U23NT233Y6.p8").toString();
const team_id = "359SJ8YD53";
const key_id = "U23NT233Y6";
const token = jwt.sign({}, private_key, {
  algorithm: "ES256",
  expiresIn: "180d",
  issuer: team_id,
  header: {
    alg: "ES256",
    kid: key_id,
  },
});

const token_key = "";
router.get("/appleMusicToken", function (req, res) {
  res.send(JSON.stringify({ token: token }));
});

router.post("/saveAppleMusicToken", (req, res) => {
  let payload = {};
  payload = req.body;
  User.findOneAndUpdate(
    { email: req.session.user.email },
    {
      $push: {
        connectedAccounts: payload,
      },
    }
  )
    .then((result) => {
      res.send({ succes: true });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/my-appleMusic-playlist", (req, res) => {});

module.exports = router;
