const path = require("path");
const express = require("express");
const cors = require("cors");

const passportJWT = require("./middlewares/passportJWT")();
const errorHandler = require("./middlewares/errorHandler");
const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth");
const followRoutes = require("./routes/following");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");

const app = express();
app.use(cors());
const limiter = rateLimit({
	windowMs: 10 * 1000, 
	max: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(limiter)

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

app.use("/api/auth", authRoutes);
app.use("/api/post", passportJWT.authenticate(), postRoutes);
app.use("/api/follow", passportJWT.authenticate(), followRoutes);

app.use(errorHandler);

app.listen(8000, () => {
	console.log("App is  listening  at port 8000");
});
