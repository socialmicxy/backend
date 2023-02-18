const express = require("express");
const User = require("../models/user");
const MusicSyncSpace = require("../models/musicSyncSpace");
const Store = require("../caching/store");
const router = express.Router();
const redis = require("redis");
let redisClient;

// (async () => {
//   redisClient = redis.createClient();

//   redisClient.on("error", (error) => console.error(`Error : ${error}`));

//   await redisClient.connect();
// })();

const spotifyWebApi = require("spotify-web-api-node");
const { v4: uuidV4 } = require("uuid");

router.post("/transition-musicsyncspace", async (req, res) => {
  let room = "";
  if (req.body.musicsyncspace) room = "890acf13-3ee2-4462-9080-e856841027ee";
  User.findOneAndUpdate(
    { email: req.session.user.email },
    { musicsyncspace: req.body.musicsyncspace }
  ).then((result) => {
    res.send({ room: room });
  });
});

router.get("/connect-to-musicsyncspace/:id", async (req, res) => {
  res.send({ musicsyncspace: req.params.id });
});

router.post("/update-my-queue", async (req, res) => {
  const { room, queue } = req.body;
  let cacheStatus = await Store.set(room, JSON.stringify(queue));
  if (cacheStatus) {
    res.send({ succes: true });
  }
});

router.get("/retrieve-this-room-queue/:id", async (req, res) => {
  const cacheQueue = await Store.get(req.params.id);
  if (cacheQueue) {
    res.send(cacheQueue);
  } else {
    res.send([]);
  }
});

module.exports = router;
