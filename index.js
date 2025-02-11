const express = require("express");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Welcome to Circle API");
});

app.listen(PORT, () => {
  console.log(`Server running in port http://localhost:${PORT}`);
});
