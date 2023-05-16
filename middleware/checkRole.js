// checkRole("admin")
const CheckRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.sendStatus(403).json({ message: "Error Forbiden Role" }); // error forbidden
    }

    next(); // lanjut
  };
};

module.exports = CheckRole;
