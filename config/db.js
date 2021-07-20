if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const mongoose = require("mongoose");

const dbURL = process.env.MON_DB;
mongoose
  .connect(dbURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("mongodb connected!");
  })
  .catch((err) => {
    console.log(err);
  });
