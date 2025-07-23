
const jwt = require('jsonwebtoken');



const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader) return res.status(401).json({ msg: "No token, authorization denied" });

    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ msg: "Token is not valid" });
    }
  };




const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'You are not an admin' });
    next();
};

const isUser = (req, res, next) => {
    if (req.user.role !== 'user') return res.status(403).json({ msg: 'You are not a user' });
    next();
};

// Export all middlewares
module.exports = { authMiddleware, isAdmin, isUser };
