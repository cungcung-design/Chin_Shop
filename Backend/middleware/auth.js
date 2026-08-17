const jwt = require("jsonwebtoken");

// =====================
// AUTHENTICATE USER
// =====================
const authenticateToken = (req, res, next) => {
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

    // Save decoded user information
    req.user = decoded;

    // Continue to next middleware/controller
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

// =====================
// REQUIRE ADMIN
// =====================
const requireAdmin = (req, res, next) => {
  // Check user role
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  // User is admin
  next();
};

// =====================
// EXPORT
// =====================
module.exports = {
  authenticateToken,
  requireAdmin,
};