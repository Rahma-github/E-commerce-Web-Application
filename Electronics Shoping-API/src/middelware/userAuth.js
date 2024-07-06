const jwt = require("jsonwebtoken");
const User = require("../models/users");
const userAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    // iat: Math.floor(Date.now() / 1000) - 30 }
    const user = await User.findById({ _id: decode._id });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send(err);
  }
};
module.exports = userAuth;
