const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

// import routes
const signupRouter = require("./routers/signup");
const loginRouter = require("./routers/login");
const searchRouter = require("./routers/search");
const verifyRouter = require("./routers/verify");

const app = express();
const PORT = 4000;

app.get("/", (req, res) => {
  res.send("Auth API");
});

// Set up middleware
app.use((req, res, next) => {
  console.log(req.method + " " + req.path + " " + req.ip);
  next();
});
// Set up CORS and JSON middlewares
let corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser()); // used for authentication
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// make routes avalible
app.use("/v1/signup", signupRouter);
app.use("/v1/login", loginRouter);
app.use("/v1/search", searchRouter);
app.use("/v1/verify", verifyRouter);

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
