const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  profileUrl: String,
  email: String,
  googleId: String,
  connectedAccounts: [
    {
      accountType: String,
      token: String,
      refreshToken: String,
      id: String,
      expiresIn: Number,
    },
  ],
  musicsyncspace: Boolean,
});

const User = mongoose.model("authUsers", userSchema);
module.exports = User;
