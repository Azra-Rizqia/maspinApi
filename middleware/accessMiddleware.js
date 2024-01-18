const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const validateAccountMiddleware = asyncHandler(async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - No token found',
      });
    }

    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.statusValidate) {
      return res.status(403).json({
        success: false,
        message: 'Account not validated',
      });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

module.exports = validateAccountMiddleware;
