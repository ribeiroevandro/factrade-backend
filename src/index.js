const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors")

const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("lol");
});

require("./app/controllers/index")(app); //todos os controllers criados sao importados automaticamente

app.listen(process.env.PORT || 3000);
