const util = require("util");
const redis = require("redis");
const config = require("../config/index");


let client;
module.exports = {
    getClient: async () => {
        if (!client) {
            redisConfig = {
                host: config.redisHOST,
                port: config.redisPORT
            };
            if(process.env.NODE_ENV === "production"){
                redisConfig.password = config.redisPassword;
            };
            client = redis.createClient(redisConfig);
            client.hGet = util.promisify(client.hGet);
        }
        return client;
    }
};