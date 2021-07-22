if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
require("./config/db");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const userRoutes = require("./routes/users");
const catchAsyncErrors = require("./utils/errorHandlers/catchAsyncErrors");
const cors = require("cors");

const app = express();

const whitelist = [
  "http://localhost:3000",
  "http://localhost:4030",
  /\.phibinary\.com$/,
];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error(`origin: ${origin} Not allowed by CORS`));
    }
  },
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));

app.use(passport.initialize());
//app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/api/user", userRoutes);

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).send(`error ${err}`);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Auth API running at ${port}`);
});
