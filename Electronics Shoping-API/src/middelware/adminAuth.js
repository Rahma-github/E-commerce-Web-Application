const requireAdmin = async (req, res, next) => {
  if (req.user.roles != "admin") {
    res.status(401).send({ error: "Not Admin" });
  } else {
    next();
  }
};
module.exports = requireAdmin;