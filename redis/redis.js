const redis = require('redis');
const session = require('express-session');
let RedisStore = require('connect-redis')(session);
// To use Redis on Heroku add the Heroku Redis add-on and point the redis client to an automatically created
// environment variable called `process.env.REDIS_URL`

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
let redisClient = redis.createClient(redisUrl);
// let redisClient = redis.createClient();

const bluebird = require('bluebird'); //Import Bluebird to make redis get/set-Async calls promises
bluebird.promisifyAll(redis.RedisClient.prototype);

module.exports = { redisClient, RedisStore };