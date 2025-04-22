const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, userPayload) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }

    req.user = {
      id: userPayload.id,
      role: userPayload.role,
    };
    next();
  });
};

module.exports = authenticateToken;
