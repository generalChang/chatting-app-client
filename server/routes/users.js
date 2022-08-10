const express = require("express");
const { User } = require("../models/User");

const router = express.Router();
const auth = require("../middleware/auth");
router.post("/login", (req, res) => {
  /// 1. 해당 유저가 데이터베이스에 있는지 검사
  /// 2. 비밀번호가 일치하는지 검사.
  /// 3. 데이타베이스와 cookie에 토큰생성.

  const { email, password } = req.body;

  User.findOne({
    email,
  }).exec((err, userInfo) => {
    if (err) return res.send({ loginSuccess: false, err });

    if (!userInfo) {
      return res.send({
        loginSuccess: false,
        message: "Failed to Login. email not found",
      });
    }

    userInfo.comparePassword(password, (err, isMatch) => {
      if (err) return res.send({ loginSuccess: false, err });

      if (!isMatch) {
        return res.send({
          loginSuccess: false,
          message: "Failed to Login. Wrong password",
        });
      }

      userInfo.generateToken((err, user) => {
        if (err) return res.send({ loginSuccess: false, err });
        res.cookie("x_auth", user.token);
        res.send({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

router.post("/register", (req, res) => {
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.send({ success: false, err });
    return res.send({ success: true, userInfo });
  });
});

router.get("/auth", auth, (req, res) => {
  return res.send({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    image: req.user.image,
  });
});

router.get("/logout", auth, (req, res) => {
  User.findOneAndUpdate(
    {
      _id: req.user._id,
    },
    {
      token: "",
    }
  ).exec((err, userInfo) => {
    if (err) return res.send({ success: false, err });
    return res.send({ success: true });
  });
});
module.exports = router;
