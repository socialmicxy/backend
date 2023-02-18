const express = require("express");
const PlaylistModel = require("../models/playlist");
const User = require("../models/user");
const playlistApi = require("../spotifyApi/playlist");
const addTracksToPlaylist = require("../spotifyApi/addTrackToPlaylist");
const refreshToken = require("../spotifyApi/refreshSpotifyToken");
const router = express.Router();
const getPlaylistTrack = require("../spotifyApi/getPlaylistTrack");
router.get("/my-playlist", (req, res) => {
  User.findOne({ email: req.session.user.email }).then(async (user) => {
    if (user) {
      let spotify = user.connectedAccounts.find(
        (account) => account.accountType === "spotify"
      );

      try {
        const myPlaylist = await playlistApi(spotify.token);
        let modifyData = myPlaylist.map((playlist) => {
          return {
            playlistName: playlist.name,
            createrId: req.session.user.email,
            id: playlist.id,
            numberOfsounds: playlist.tracks.total,
            isPrivate: true,
            platform: "spotify",
            collaborative: false,
            playListUrl: playlist.external_urls.spotify,
            description: playlist.description,
            images: playlist.images,
          };
        });
        res.send(modifyData);
      } catch (err) {
        if (err.body.error.message === "The access token expired") {
          refreshToken(req.session.user.email);
        }
        console.log(err);
      }
    } else {
      res.send({ message: "user does not exist" });
    }
  });
});

router.get("/my-playlist/:id", (req, res) => {
  PlaylistModel.findOne({ _id: req.params.id })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/my-playlist-track/:id/:token", async (req, res) => {
  try {
    const getThisPlaylistTrack = await getMyPlayList(
      req.params.token,
      req.params.id,
      req.session.user.email
    );
    res.send(getThisPlaylistTrack);
  } catch (err) {
    console.log(err);
  }
});
let counter = 0;
router.get("/stress-test", (req, res) => {
  counter++;

  if (counter > 100) {
    counter = 0;
  }

  res.send({ succes: true });
});

router.get("/refresh-token", async (req, res) => {
  let newToken = await refreshToken(req.session.user.email);
  res.send(newToken);
});
router.post("/add-track-to-spotify-playlist", async (req, res) => {
  let { token, playlistId, trackUri } = req.body;
  try {
    const addTrack = await addTracksToPlaylist(token, playlistId, trackUri);
    res.send({ succes: true });
  } catch (err) {
    res.send({ succes: false });
  }
});

router.post("/edit-playlist", (req, res) => {});
async function getMyPlayList(token, id, email) {
  try {
    const getThisPlaylistTrack = await getPlaylistTrack(token, id);
    return getThisPlaylistTrack;
  } catch (err) {
    if (err.body.error.message === "The access token expired") {
      let newToken = await refreshToken(email);
      const getThisPlaylistTrack = getMyPlayList(newToken, id, email);
      return getThisPlaylistTrack;
    }
  }
}

module.exports = router;
