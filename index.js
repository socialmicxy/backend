require("dotenv").config();
const express = require("express");
const app = express();
const expressSession = require("express-session");
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const MongoStore = require("connect-mongo");
const PORT = process.env.PORT || 4000;
app.use(cors());
const authRouter = require("./routes/auth");
const SpotifymusicToken = require("./routes/SpotifymusicToken");
const AppleMusicToken = require("./routes/AppleMusicToken");
const playListRouter = require("./routes/playListRouter");
const MusicSyncSpace = require("./routes/musicSpaceRoute");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  expressSession({
    name: process.env.NAME,
    secret: process.env.SECRET,
    store: MongoStore.create({
      mongoUrl: process.env.DB,
      stringify: false,
      ttl: 14 * 24 * 60 * 60 * 60 * 60 * 60 * 60,
      autoRemove: "native",
    }),
    saveUninitialized: false,
    resave: false,
    cookie: {
      sameSite: true,
      maxAge: 100000000000000,
    },
  })
);
app.use("/api/auth", authRouter);
app.use("/api", SpotifymusicToken);
app.use("/api", AppleMusicToken);
app.use("/api", playListRouter);
app.use("/api", MusicSyncSpace);

app.listen(PORT);
