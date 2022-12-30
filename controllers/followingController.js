const User = require("../models/user");

exports.follow = async (req, res, next) => {
    try {
        req.user.following.push(req.params.id)
        req.user.save()
        return res.send({ user: req.user });
    } catch (error) {
        next(error);
    }
};