const path = require("path");
const express = require("express");
const cors = require("cors");

const passportJWT = require("./middlewares/passportJWT")();
const errorHandler = require("./middlewares/errorHandler");
const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/rest-api-node", { useNewUrlParser: true }).then(() => console.log("Connected!"));

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);
app.use(express.static(path.join(__dirname, "public")));
app.use(passportJWT.initialize());

app.use(function (req, res, next) {
	console.log(req.method, req.originalUrl);
	let body = req.body;
	console.log({ body });
	console.log(req["headers"]);
	next();
});

app.use("/api/auth", authRoutes);
app.use("/api/post", passportJWT.authenticate(), postRoutes);

app.use(errorHandler);

app.listen(8000, () => {
	console.log("App is  listening  at port 8000");
});
