const spotifyConfig = require("../utility/config");
function addTracksToPlaylist(token, playlistId, trackUri) {
  return new Promise(function (resolve, reject) {
    const spotifyApi = spotifyConfig(token);
    spotifyApi
      .addTracksToPlaylist(playlistId, [trackUri], {
        position: 0,
      })
      .then(function (data) {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = addTracksToPlaylist;
