const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config(); // now you can use process.env in any document since this is the root file

// Connect to mongo DB
require("./database/database").connect();

// import routes
const signupRoute = require("./routers/signupRoute");
const loginRoute = require("./routers/loginRoute");
const authRoute = require("./routers/authRoute");
const userRoute = require("./routers/userRoute");
const logoutRoute = require("./routers/logoutRoute");

const app = express();
const PORT = 4000;

app.get("/", (req, res) => {
  res.send("Chat API");
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
app.use("/v1/signup", signupRoute);
app.use("/v1/login", loginRoute);
app.use("/v1/user", userRoute);
app.use("/v1/auth", authRoute);
app.use("/v1/logout", logoutRoute);

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
