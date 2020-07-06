const mongoose = require("../../database");
const bcrypt = require('bcryptjs')

const AcaoSchema = new mongoose.Schema({
  ordem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ordem',
    require: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true
  },
  acao: {
    type: mongoose.Schema.Types.String,
    require: true
  },
  dtCompra: {
    type: mongoose.Schema.Types.String,
    require: true
  },
  dtVenda: {
    type: mongoose.Schema.Types.String,
    require: false
  },
  precoUnitario: {
    type: mongoose.Schema.Types.String,
    require: true
  },
  precoVenda: {
    type: mongoose.Schema.Types.String,
    require: false
  },
  qtdAcao: {
    type: mongoose.Schema.Types.String,
    require: true
  },
  qtdDias: {
    type: mongoose.Schema.Types.String,
    require: false
  },
  lucro: {
    type: mongoose.Schema.Types.String,
    require: false
  },
  totalVenda: {
    type: mongoose.Schema.Types.String,
    require: false
  },

});

const Acao = mongoose.model("Acao", AcaoSchema);

module.exports = Acao;