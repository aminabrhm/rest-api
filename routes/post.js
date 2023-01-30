const express = require("express");
const postController = require("../controllers/postController");
const uploadImage = require("../middlewares/multer");
const { hasDescription } = require("../validations/validator");
const router = express.Router();
const passportJWT = require("../middlewares/passportJWT")();

router.get("/test", postController.test);
router.get("/", postController.index);
router.get("/:id", postController.show);
router.post("/", passportJWT.authenticate(), uploadImage("posts").single("image"), hasDescription, postController.store);
router.patch("/:id", passportJWT.authenticate(), hasDescription, postController.update);
router.delete("/:id",  passportJWT.authenticate(),postController.delete);

module.exports = router;
