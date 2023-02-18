const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  height: Number,
  url: String,
  width: Number,
});
const userSchema = new mongoose.Schema({
  playlistName: String,
  createrId: String,
  numberOfsounds: Number,
  isPrivate: Boolean,
  playlistId: { type: String, unique: true, required: true },
  platform: String,
  collaborative: Boolean,
  playListUrl: String,
  description: String,
  images: [imageSchema],
});

const Playlist = mongoose.model("playlists", userSchema);
module.exports = Playlist;
