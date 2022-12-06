const redis = require('redis');
const session = require('express-session');
let RedisStore = require('connect-redis')(session);
// To use Redis on Heroku add the Heroku Redis add-on and point the redis client to an automatically created
// environment variable called `process.env.REDIS_URL`

// const redisUrl = process.env.REDIS_URL || 6379;
let redisClient = redis.createClient({
    url : 'us1-aware-sunbeam-37058.upstash.io',
    port : '37058',
    password: 'fc81697a3a79424882bded43c1488522',
    tls: {}
});
// let redisClient = redis.createClient();

redisClient.on("error", (err) => {
    console.log({err})
})

const bluebird = require('bluebird'); //Import Bluebird to make redis get/set-Async calls promises
bluebird.promisifyAll(redis.RedisClient.prototype);

module.exports = { redisClient, RedisStore };