const jwt = require("jsonwebtoken");

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
  console.log("Auth middleware called");
  //console.log("Request Headers:", req.headers);
  //console.log("Request Cookies:", req.cookies);
  //console.log("Signed Cookies:", req.signedCookies);

  // Check for token in headers or cookies
  const token =
    req.cookies.token ||
    req.signedCookies.token ||
    req.headers.authorization?.split(" ")[1];
  if (!token) {
    // No token found
    console.log("No token provided");
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });
  }
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("Token verified. User:", req.user);
    next();
  } catch (error) {
    // Invalid token
    console.error("Token verification failed:", error);
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = authMiddleware;
// Compare this snippet from server/routers/signupRoute.js:
