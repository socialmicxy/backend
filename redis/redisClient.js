const redis = require("redis");
const { endpointUri, password } = require("./config").redis;
console.log(endpointUri);
const redisClient = redis.createClient(`redis://${endpointUri}`, { password });

module.exports = redisClient;
