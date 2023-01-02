const User = require("../models/user");
const redis = require("redis");

exports.follow = async (req, res, next) => {
    try {
        req.user.following.push(req.params.id)
        req.user.save()
        const client = redis.createClient(redisConfig);
		await client.connect();
		await client.hDel("users", req.user.id);
        return res.send({ user: req.user });
    } catch (error) {
        next(error);
    }
};