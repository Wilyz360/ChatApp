const jwt = require("jsonwebtoken");

const authToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    // if token field is empty or doesn't exist return 401
    console.log("Token needed");
    return res.status(401).json({ accepted: false, message: "Token needed" });
  } else {
    jwt.verify(token, process.env.JWTKEY, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ accepted: false, message: "Authentication Error" });
      } else {
        req.email = decoded.email; // add user to req object
        next();
      }
    });
  }
};

module.exports = authToken;
