const spotifyConfig = require("../utility/config");
async function aboutMe(token) {
  const spotifyApi = spotifyConfig(token);
  return new Promise((resolve, reject) => {
    (async () => {
      const me = await spotifyApi.getMe();
      resolve(me.body);
    })().catch((err) => {
      reject(err);
    });
  });
}
module.exports = aboutMe;
