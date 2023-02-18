const spotifyConfig = require("../utility/config");

async function getPlaylistTrack(token, playlistId) {
  const spotifyApi = spotifyConfig(token);
  const data = await spotifyApi.getPlaylistTracks(playlistId, {
    offset: 0,
    limit: 100,
    fields: "items",
  });
  let tracks = [];

  for (let track_obj of data.body.items) {
    const track = track_obj.track;
    tracks.push(track);
  }
  return tracks;
}

module.exports = getPlaylistTrack;
