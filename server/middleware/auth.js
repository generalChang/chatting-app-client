const { User } = require("../models/User");

function auth(req, res, next) {
  let token = req.cookies.x_auth; //쿠키에서 토큰 추출.

  User.findByToken(token, (err, user) => {
    if (err) return next(err);
    if (!user) return res.send({ isAuth: false, error: true });

    req.token = token;
    req.user = user;
    next();
  });
}

module.exports = auth;
