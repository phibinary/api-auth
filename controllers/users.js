if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const User = require("../models/user");
const jwt = require("jsonwebtoken");

module.exports.register = async (req, res, next) => {
  try {
    //Create user in the database
    let { email, username = "none", password, firstName, lastName } = req.body;
    if (username === "none") {
      username = email;
    }
    const user = new User({ email, username, firstName, lastName });
    const registeredUser = await User.register(user, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);

      //Create JWT token
      const token = jwt.sign(
        {
          _id: registeredUser._id,
          firstName,
          email,
        },
        process.env.JWT_Secret,
        {
          expiresIn: process.env.Session_Duration,
        }
      );
      res.header("x-access-token", token).send(token);
      //res.status(200).send(`${registeredUser._id}`);
    });
  } catch (e) {
    res.send(e);
  }
};

module.exports.login = async (req, res) => {
  //Create JWT token
  const token = await jwt.sign(
    {
      _id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
    },
    process.env.JWT_Secret,
    {
      expiresIn: process.env.Session_Duration,
    }
  );
  res.header("x-access-token", token).send(token);
};

module.exports.verify = async (req, res) => {
  try {
    const token = req.body.token || req.headers["x-access-token"];

    const decoded = await jwt.verify(token, process.env.JWT_Secret);
    res.send({ _id: decoded._id });
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

module.exports.logout = (req, res) => {
  req.logout();
  // req.session.destroy();
  res.status(200).send("/blogs");
};
