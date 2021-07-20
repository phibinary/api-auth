if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
require("./config/db");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App running at ${port}`);
});
