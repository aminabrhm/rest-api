const validationHandler = require("../validations/validationHandler")
const Post = require("../models/post")

exports.index = async (req, res, next) => {
    try {
        const posts = await Post.find()
        res.send(posts)
    } catch (error) {
        next(error)

    }
}

exports.show = async (req, res, next) => {
    try {
        const post = await Post.findOne({
            _id: req.params.id
        })
        res.send(post)
    } catch (error) {
        next(error)
    }
}


exports.store = async (req, res, next) => {
    try {
        validationHandler(req)
        let post = new Post()
        post.image = req.file.filename
        post.description = req.body.description

        post = await post.save()
        res.send(post)

    } catch (err) {
        next(err)
    }

}

exports.update = async (req, res, next) => {
    try {
        validationHandler(req)
        let post = await Post.findById(req.params.id)
        post.description = req.body.description

        post = await post.save()
        res.send(post)
    } catch (err) {
        next(err)
    }
}

exports.delete = async (req, res, next) => {
    try {
        let post = await Post.findById(req.params.id)
        post = await post.delete()
        res.send({messege : "Success"})
    } catch (err) {
        next(err)
    }
}