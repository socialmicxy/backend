function spotifyApi(token) {
  const SpotifyWebApi = require("spotify-web-api-node");
  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(token);
  return spotifyApi;
}
module.exports = spotifyApi;
