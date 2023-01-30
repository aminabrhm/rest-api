const validationHandler = require("../validations/validationHandler");
const Post = require("../models/post");

exports.test = async (req, res, next) => {
	try {
		const test = "test";
		res.send({
			id: "sambosa",
			data: {
				title: "abdullascript",
			},
		});
	} catch (error) {
		next(error);
	}
};

exports.index = async (req, res, next) => {
	try {
		const pagination = (req?.query?.pageSize ? parseInt(req.query.pageSize) : 10);; 
		const page = (req?.query?.page ? parseInt(req.query.page) : 1);
		const posts = req?.user ? await Post.find({
			user: { $in: [...req.user.following, req.user.id] }
		}).skip((page - 1) * pagination)
		.limit(pagination)
		.populate("user").sort({ createdAt: -1 }) : await Post.find()
			.skip((page - 1) * pagination)
			.limit(pagination)
			.populate("user").sort({ createdAt: -1 });

		const rowCount = await Post.countDocuments();

		res.send({posts, rowCount});
	} catch (error) {
		next(error);
	}
};

exports.show = async (req, res, next) => {
	try {
		const post = await Post.findOne({
			_id: req.params.id,
			user: { $in: [...req.user.following, req.user.id] }
		}).populate("user");
		res.send(post);
	} catch (error) {
		next(error);
	}
};

exports.store = async (req, res, next) => {
	try {
		validationHandler(req);
		let post = new Post();
		post.image = req.file.filename;
		post.description = req.body.description;
		post.user = req.user;
		post = await post.save();
		res.send(post);
	} catch (err) {
		next(err);
	}
};

exports.update = async (req, res, next) => {
	try {
		validationHandler(req);
		let post = await Post.findById(req.params.id);
		if (!post || post.user != req.user.id) {
			const error = new Error("Wrong request")
			error.statusCode = 400;
			throw error
		}
		post.description = req.body.description;
		post = await post.save();
		res.send(post);
	} catch (err) {
		next(err);
	}
};

exports.delete = async (req, res, next) => {
	try {
		let post = await Post.findById(req.params.id);
		if (!post || post.user != req.user.id) {
			const error = new Error("Wrong request")
			error.statusCode = 400;
			throw error
		}
		post = await post.delete();
		res.send({ messege: "Success" });
	} catch (err) {
		next(err);
	}
};
