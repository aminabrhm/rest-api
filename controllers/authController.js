const jwt = require("jwt-simple");
const config = require("../config");
const User = require("../models/user");
const validationHandler = require("../validations/validationHandler");
const redisClient = require("../config/redis").getClient();
const redis = require("redis");

exports.login = async (req, res, next) => {
	try {
		const email = req.body.email;
		const password = req.body.password;

		const user = await User.findOne({ email }).select("+password");
		if (!user) {
			const error = new Error("Wrong Credentials 1");
			error.statusCode = 401;
			throw error;
		}
		const validPassword = await user.validPassword(password);
		if (!validPassword) {
			const error = new Error("Wrong Credentials 2");
			error.statusCode = 401;
			throw error;
		}
		const token = jwt.encode({ id: user.id }, config.jwtSecret);
		return res.send({ user, token });
	} catch (error) {
		next(error);
	}
};
exports.signup = async (req, res, next) => {
	try {
		validationHandler(req);

		const existingUser = await User.findOne({ email: req.body.email });
		if (existingUser) {
			const error = new Error("Email already used");
			error.statusCode = 403;
			throw error;
		}
		let user = new User();
		user.email = req.body.email;
		user.password = await user.encryptPassword(req.body.password);
		user.name = req.body.name;
		user = await user.save();

		const token = jwt.encode({ id: user.id }, config.jwtSecret);
		return res.send({ user, token });
	} catch (error) {
		next(error);
	}
};
exports.me = async (req, res, next) => {
	try {
		const client = redis.createClient(redisConfig);
		await client.connect();

		const cacheValue = await client.hGet("users", req.user.id);
		if (cacheValue) {
			console.log("returned from redis");
			const doc = JSON.parse(cacheValue);
			const cacheUser = new User(doc);
			return res.send(cacheUser)
		}
		console.log("returned from db");
		const user = await User.findById(req.user);
		client.HSET("users", req.user.id, JSON.stringify(user));
		return res.send(user);
	} catch (error) {
		next(error);
	}
};



/*  Course code	

		const cacheValue = await redisClient.hGet("users", req.user.id);
		console.log(cacheValue);
		if(cacheValue){
			console.log("returned from redis");
			const doc = JSON.parse(cacheValue);
			const cacheUser = new User(doc);
			return res.send(cacheUser)
		}
		console.log("returned from db");
		const user = await User.findById(req.user);
		redisClient.HSET("users", req.user.id, JSON.stringify(user));
		return res.send(user );

*/