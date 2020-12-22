const redis = require('redis');
const session = require('express-session');
let RedisStore = require('connect-redis')(session);
// let redisClient
// if (process.env.REDISTOGO_URL) {
//     // inside if statement
//     var rtg   = require("url").parse(process.env.REDISTOGO_URL);
//     redisClient = require("redis").createClient(rtg.port, rtg.hostname);

//     redis.auth(rtg.auth.split(":")[1]);
//   } else {
//     redisClient = require("redis").createClient();
//   }
let redisClient = redis.createClient(process.env.REDIS_URL);
const bluebird = require('bluebird'); //Import Bluebird to make redis get/set-Async calls promises
bluebird.promisifyAll(redis.RedisClient.prototype);

module.exports = { redisClient, RedisStore };