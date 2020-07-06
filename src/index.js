const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("lol");
});

require("./app/controllers/index")(app); //todos os controllers criados sao importados automaticamente

app.listen(3000);