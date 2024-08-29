const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");

module.exports.registerUser = async (req, res) => {
  try {
    let { password, email, fullname } = req.body;

    let user = await userModel.findOne({ email: email });
    if (user) {
      req.flash("error", "user already exist, please login!");
      return res.redirect("/");
    }

    if (!password || !email || !fullname) {
      req.flash("error", "detail must be require");
      return res.redirect("/");
    };

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) return res.send(err.message);
        else {
          let user = await userModel.create({
            fullname,
            email,
            password: hash,
          });

          let token = generateToken(user);
          res.cookie("token", token);
          res.redirect("/shop");
        }
      })
    })

  } catch (error) {
    res.send(error.message);
  }
}

module.exports.loginUser = async function (req, res) {
  let { email, password } = req.body;

  let user = await userModel.findOne({ email: email });

  if (!email || !password) {
    req.flash("error", "input require");
    return res.redirect("/")
  }
  else {
    if (!user) {
      req.flash("error", "invalid detail");
      return res.redirect("/")
    }
    else {
      bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
          let token = generateToken(user);
          res.cookie("token", token);
          res.redirect("/shop")
        }
        else {
          req.flash("invalid details");
          return res.redirect("/");
        }
      })
    }
  }
};

module.exports.logout = function (req, res) {
  res.cookie("token", "");
  res.redirect("/");
}