const {body}  = require("express-validator")


exports.hasDescription = body("description")
.isLength({min: 5})
.withMessage("Nin length 5 char")

exports.isEmail = body("email")
.isEmail({min: 5})
.withMessage("Enter a correct email")

exports.hasPassword = body("password")
.exists()
.withMessage("Password cannt  be empty")

exports.hasName = body("name")
.isLength({min: 5})
.withMessage("NAme must be  5 chars")