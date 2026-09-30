const jwt = require("jsonwebtoken");
 
const protect = (req, res, next) => {

  try {

    const authHeader = req.headers.authorization;
 
    if (!authHeader) {

      return res.status(401).json({

        success: false,

        message: "Authorization header missing",

      });

    }
 
    // Expected:

    // Authorization: Bearer <token>
 
    const parts = authHeader.split(" ");
 
    if (parts.length !== 2 || parts[0] !== "Bearer") {

      return res.status(401).json({

        success: false,

        message: "Invalid authorization format",

      });

    }
 
    const token = parts[1];
 
    // Verify token

    const decoded = jwt.verify(

      token,

      process.env.JWT_SECRET

    );
 
    // Attach decoded data to request

    req.user = decoded;
 
    next();

  } catch (error) {

    return res.status(401).json({

      success: false,

      message: "Invalid or expired token",

    });

  }

};
 
module.exports = protect;
 