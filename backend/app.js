const dotenv = require("dotenv");
const express = require("express");
const app = express();

dotenv.config({ path: "../.env" });
console.log(process.env.PORT);
app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}`);
});
