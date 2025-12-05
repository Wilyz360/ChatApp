const express = require("express");
const { createServer } = require("node:http");
const { initSocket } = require("./socketSetup");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./middlewares/authMiddleware");
require("dotenv").config();

// database connection
require("./database/database").connect();

//import routes
const signupRoute = require("./routers/signupRoute");
const loginRoute = require("./routers/loginRoute");
const userRoute = require("./routers/userRoute");
const chatRoute = require("./routers/chatRoute");
const messageRoute = require("./routers/msgRoute");
const guessRoute = require("./routers/guessRoute");

const app = express();
const PORT = process.env.PORT || 4000;
const server = createServer(app); // Create HTTP server

// Initialize Socket.io
initSocket(server);

app.use(cookieParser()); // Use cookie-parser middleware

// Middleware to log request details
app.use((req, res, next) => {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();
  const time = h + ":" + m + ":" + s;
  console.log(
    `Time: ${time} - ${req.method} - ${req.ip} - ${req.path} request for ${req.url}`
  );
  next();
});

let corsOptions = {
  origin: "http://localhost:5173", // allow to server to accept request from different origin
  credentials: true,
};

app.use(cors(corsOptions)); // Use CORS middleware with options

app.use(express.json()); // parse json body

app.use(express.urlencoded({ extended: true })); // parse urlencoded body

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode:block");
  next();
});

// public routes
app.use("/api/signup", signupRoute);
app.use("/api/login", loginRoute);
app.use("/guess", guessRoute);

// private routes
app.use("/api/user", authMiddleware, userRoute);
app.use("/api/chats", authMiddleware, chatRoute);
app.use("/api/messages", authMiddleware, messageRoute);

// Serve static files from the React app
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
