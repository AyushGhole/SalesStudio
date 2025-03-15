const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(" Authorization Header from Frontend:", authHeader); // Debugging log

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log(" No token found in headers");
    return res
      .status(401)
      .json({ message: "Unauthorized - No Token Provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log(" Extracted Token from Frontend:", token); //  Debugging log

  // Check if the token has three parts (header.payload.signature)
  if (token.split(".").length !== 3) {
    console.log(" Token format is incorrect (not a valid JWT)");
    return res.status(401).json({ message: "Unauthorized - Malformed Token" });
  }

  try {
    console.log("🛠 JWT_SECRET in Middleware:", process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET); //  Ensure token is verified
    console.log("Decoded Token Data:", decoded); // Check if it contains user info

    req.user = decoded; // Attach user to request
    next(); // Proceed to next middleware
  } catch (error) {
    console.error(" Token Verification Failed:", error.message);
    return res.status(401).json({ message: "Unauthorized - Invalid Token" });
  }
};

module.exports = authMiddleware;
