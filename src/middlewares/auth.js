const JWT = require("jsonwebtoken");

const authToken = async (req, res, next) => {
  try {
    const token = req?.cookies?.token;
    if (!token) {
      return res.status(200).json({
        message: "Please Login...!",
        error: true,
        success: false,
      });
    }
    const data = JWT.verify(token, process.env.TOKEN_SECRET_KEY);
    req.user = data._id;
    next();
  } catch (error) {
    res.status(400).json({
      message: err.message || err,
      data: [],
      error: true,
      success: false,
    });
  }
};

const authRole = (roles) => async (req, res, next) => {
  try {
    const user = req.user;
    if (roles.includes(user.role)) next();
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized",
      data: [],
      error: true,
      success: false,
    });
  }
};

module.exports = { authToken, authRole };
