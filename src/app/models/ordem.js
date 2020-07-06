const mongoose = require("../../database");
const bcrypt = require('bcryptjs')

const OrdemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true
  },
  acoes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Acao'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Ordem = mongoose.model("Ordem", OrdemSchema);

module.exports = Ordem;
