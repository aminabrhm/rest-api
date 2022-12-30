const express = require("express")
const router = express.Router()
const followingController = require("../controllers/followingController")


router.post("/:id", followingController.follow)

module.exports = router