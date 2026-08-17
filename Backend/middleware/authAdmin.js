const jwt = require("jsonwebtoken");

// =====================
// ADMIN AUTHENTICATION
// =====================
const authAdmin = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // No token
  if (!token) {
    return res.status(401).json({
      message: "No token, authorization denied",
    });
  }

  try {
    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Save decoded user
    req.user = decoded;

    // Check admin role
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied: Admins only",
      });
    }

    // Admin authenticated
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

module.exports = authAdmin;