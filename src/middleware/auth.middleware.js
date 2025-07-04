import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Access token is missing or malformed" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !user.role) {
      return res.status(403).json({ message: "Role not found in token" });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: "Access denied: customer only" });
    }

    next();
  };
};
