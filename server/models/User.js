const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    maxlength: 50,
    unique: 1,
    trim: true,
  },
  password: {
    type: String,
    minlength: 5,
  },
  gender: {
    type: Number,
    default: 1,
  },
  age: {
    type: Number,
  },
  image: {
    type: String,
  },
  role: {
    type: Number,
    default: 0,
  },
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

userSchema.pre("save", function (next) {
  let user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function (err, result) {
    if (err) return cb(err);
    return cb(null, result);
  });
};

userSchema.methods.generateToken = function (cb) {
  let user = this;
  let token = jwt.sign(user._id.toHexString(), "secret");

  user.token = token;
  user.save((err, userInfo) => {
    if (err) return cb(err);
    return cb(null, userInfo);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  jwt.verify(token, "secret", function (err, decode) {
    User.findOne({
      token: token,
      _id: decode,
    }).exec((err, user) => {
      if (err) return cb(err);
      return cb(null, user);
    });
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
