const jwt = require("jwt-simple");
const config = require("../config");

const User = require("../models/user");

const validationHandler = require("../validations/validationHandler");

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
		// let secret64 = Buffer.from(config.jwtSecret, "utf8").toString("base64");

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
		console.log(req.user);
		const user = await User.findById(req.user);
		return res.send({ user });
	} catch (error) {
		next(error);
	}
};