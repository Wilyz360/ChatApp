const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  console.log("Auth middleware called");
  console.log("Request Headers:", req.headers);
  console.log("Request Cookies:", req.cookies);
  console.log("Signed Cookies:", req.signedCookies);

  const token =
    req.cookies.token ||
    req.signedCookies.token ||
    req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("Token verified. User:", req.user);
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = authMiddleware;
// Compare this snippet from server/routers/signupRoute.js:
