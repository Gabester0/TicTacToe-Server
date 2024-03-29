const Redis = require('ioredis');
const session = require('express-session');
let RedisStore = require('connect-redis')(session);

let redisClient = new Redis(`rediss://default:${process.env.REDIS_TOKEN}@us1-great-salmon-38664.upstash.io:38664`);

redisClient.on("error", (err) => {
    console.log({err})
    throw err;
});

redisClient.set("ticTacToe", "is connecting to redis without exposing password")

// TODO: Verify this is redundant and remove
// const bluebird = require('bluebird'); //Import Bluebird to make redis get/set-Async calls promises
// bluebird.promisifyAll(redisClient);

module.exports = { redisClient, RedisStore };