const express = require("express");
const authMiddleware = require("../middlewares/auth");
const Odem = require("../models/ordem");
const Acao = require("../models/acao");

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (req, res) => {
  try {
    const ordens = await Odem.find().populate(["user", "acoes"]); // traz todas as informacoes do user que cadastrou o projeto
    return res.send({ ordens });
  } catch (err) {
    return res.status(400).send({ error: "error loading ordens" });
  }
});

router.get("/:ordemId", async (req, res) => {
  try {
    const ordem = await Odem.findById(req.params.ordemId).populate(["user", "acoes"]);
    return res.send({ ordem });
  } catch (err) {
    return res.status(400).send({ error: "error loading ordem" });
  }
});

router.get("/acao/:userId", async (req, res) => {
  
  try {
    const user = await Odem.find({ user: req.params.userId }).populate(["user", "acoes"]);    
    return res.send({ user });
  } catch (err) {
    console.log(err);
     
    return res.status(400).send({ error: "error loading ordem" });
  }
});

router.post("/", async (req, res) => {
  try {
    // const { acoes } = req.body;
    const { acoes } = req.body;

    const ordem = await Odem.create({ user: acoes[0].assignedTo });


    //percorre as acoes para add ao projeto
    await Promise.all(acoes.map(async acao => {      
      const ordemAcao = new Acao({ ...acao, ordem: ordem._id });


      await ordemAcao.save();
      
      ordem.acoes.push(ordemAcao);
    }));

    await ordem.save();

    return res.send({ ordem });
  } catch (err) {
    console.log(err);
    
    return res.status(400).send({ error: "error creating new ordem" });
  }
});

router.put("/:ordemId", async (req, res) => {
  try {
    const { acoes } = req.body;
    console.log('req', req.body);

    const ordem = await Odem.findByIdAndUpdate(req.params.ordemId, { new: true}); //new true, retorna o projeto atualizado

    //deleta as acoes antigas relacionadas antes de criar novamente
    ordem.acoes = [];
    await Acao.remove({ordem: ordem._id});

    //percorre as acoes para add ao projeto
    await Promise.all(acoes.map(async acao => {
      const ordemAcao = new Acao({ ...acao, ordem: ordem._id });

      await ordemAcao.save();
      
      ordem.acoes.push(ordemAcao);
    }));

    await ordem.save();

    return res.send({ ordem });
  } catch (err) {
    console.log(err);
    
    return res.status(400).send({ error: "error updating new ordem" });
  }

});

router.delete("/:ordemId", async (req, res) => {
  console.log(req.params.ordemId);
  
  try {
    await Odem.findByIdAndDelete(req.params.ordemId);
    return res.send();
  } catch (err) {
    return res.status(400).send({ error: "error delete ordem" });
  }
});



module.exports = app => app.use("/ordens", router);
