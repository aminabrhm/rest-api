const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	email: { type: String, required: true },
	password: { type: String, required: true, select: false },
	name: { type: String, required: true },
	following: [{ type: Schema.Types.ObjectId, ref: "user" }]
});

UserSchema.methods.encryptPassword = async (password) => {
	const salt = await bcrypt.genSalt(5);
	const hash = await bcrypt.hash(password, salt);
	return hash;
};

UserSchema.methods.validPassword = async function (condidatePassword) {
	const result = await bcrypt.compare(condidatePassword, this.password);
	// const result = condidatePassword == this.password ? true : false;
	return result;
};

module.exports = mongoose.model("user", UserSchema);
