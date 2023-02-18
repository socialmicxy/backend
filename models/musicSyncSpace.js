const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  createrId: String,
});

const MusicSyncSpace = mongoose.model("musicSyncSpace", userSchema);
module.exports = MusicSyncSpace;
