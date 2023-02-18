const express = require("express");
const User = require("../models/user");
const playlistApi = require("../spotifyApi/playlist");
const aboutMe = require("../spotifyApi/aboutMe");
const PlaylistModel = require("../models/playlist");
const getPlaylistTrack = require("../spotifyApi/getPlaylistTrack");
const router = express.Router();
const spotifyWebApi = require("spotify-web-api-node");

router.post("/save-my-token", async (req, res) => {
  const code = req.body.code;
  const spotifyApi = new spotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDRIECTURI,
  });
  spotifyApi
    .authorizationCodeGrant(code)
    .then(async (data) => {
      let id = await getMySpotifyProfileId(data.body.access_token);
      let payload = {};
      payload = req.body;
      (payload.token = data.body.access_token),
        (payload.refreshToken = data.body.refresh_token);
      payload.expiresIn = data.body.expires_in;
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
        .catch((err) => {});
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

async function createMyPlayListFromSpotify(token, id, userId) {
  const myPlaylist = await playlistApi(token, id);
  myPlaylist.forEach((playlist) => {
    let playListModelPayLoad = {
      playlistName: playlist.name,
      createrId: userId,
      playlistId: playlist.id,
      numberOfsounds: playlist.tracks.total,
      isPrivate: true,
      platform: "spotify",
      collaborative: false,
      playListUrl: playlist.external_urls.spotify,
      description: playlist.description,
      images: playlist.images,
    };
    PlaylistModel.create(playListModelPayLoad)
      .then((result) => {})
      .catch((err) => {
        console.log("err");
      });
  });
}
async function getMySpotifyProfileId(token) {
  const aboutTheUser = await aboutMe(token);
  return aboutTheUser.id;
}

module.exports = router;
