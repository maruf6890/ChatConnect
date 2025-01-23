import jwt from "jsonwebtoken";
export  const verifyAuth = (req, res, next) => {
  const token = req.cookies.accessToken; 
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.AUTH_SECRET); 
 
    req.user = decoded; 
    next(); 
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};
