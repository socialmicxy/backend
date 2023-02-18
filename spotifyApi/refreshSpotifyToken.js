const express = require("express");
const User = require("../models/user");
const router = express.Router();
const spotifyWebApi = require("spotify-web-api-node");

function refresh(email) {
  return new Promise((resolve, reject) => {
    User.findOne({ email: email }).then((user) => {
      let spotify = user.connectedAccounts.find(
        (account) => account.accountType === "spotify"
      );
      const refreshToken = spotify.refreshToken;
      const spotifyApi = new spotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken,
      });
      spotifyApi
        .refreshAccessToken()
        .then((data) => {
          user.connectedAccounts.forEach((account) => {
            if (account.accountType === "spotify") {
              update(account, data.body.access_token, data.body.expiresIn);
            }
          });
          let newToken = data.body.access_token;
          user.save().then((save) => {
            resolve(newToken);
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  });
}

function update(object, accessToken, expiresIn) {
  object.token = accessToken;
  object.expiresIn = expiresIn;
}
module.exports = refresh;
