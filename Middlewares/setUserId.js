const setUserId = (req, res, next) => {
  req.body.user = req.user.id;
  next();
};

module.exports = setUserId;
