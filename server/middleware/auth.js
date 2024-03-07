const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  // const authHeader = req.headers["authorization"]; // get the token (Bearer + token) from client. Usually is sended in the headers
  // const token = authHeader && authHeader.split(" ")[1]; // get only the token (excluding Bearer )

  if (token === null) {
    // if token field is empty or doesn't exist return 401
    console.log("Token needed");
    return res.satus(401).json({ accepted: false, message: "Token needed" });
  } else {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res
          .satus(401)
          .json({ accepted: false, message: "Authentication Error" });
      } else {
        req.user = decoded.email; // add user to req object
        next();
      }
    });
  }
};

exports.authenticateToken = authenticateToken;
