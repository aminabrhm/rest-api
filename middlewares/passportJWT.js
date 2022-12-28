const passport = require("passport");
const passportJWT = require("passport-jwt");
const User = require("../models/user");
const config = require("../config");

const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const params = {
	secretOrKey: config.jwtSecret,
	// jwtFromRequest: ExtractJwt.fromBodyField("token"),
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

module.exports = () => {
	const strategy = new Strategy(params, async (payload, done) => {
		console.log({ payload });
		const user = await User.findById(payload.id);
		if (!user) return done(new Error("User not found"));
		return done(null, user);
	});
	passport.use(strategy);

	return {
		initialize: () => {
			return passport.initialize();
		},
		authenticate: () => {
			return passport.authenticate(strategy, { session: false });
		},
	};
};
