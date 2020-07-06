const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const mailer = require("../../modules/mailer");
const authConfig = require("../../config/auth");
const cors = require('cors');

const User = require("../models/user");
const { send } = require("process");

const router = express.Router();

//gera o token tanto quando o user se cadastra ou se autentica
function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: "10000day"
  });
}

router.post("/register", async (req, res) => {
  try {
    const { email } = req.body;

    if (await User.findOne({ email }))
      return res.status(400).send({ error: "User already existis" });

    const user = await User.create(req.body);
    // console.log("--->", req.body);

    //limpa o pwd do retorno
    user.password = undefined;

    return res.send({
      user,
      token: generateToken({ id: user.id })
    });
  } catch (erro) {
    return res.status(400).send({ error: "registration failed" });
  }
});


router.post("/authenticate", async (req, res) => {
  
  const { email, password } = req.body;

  //verifica se o user existe no bd
  const user = await User.findOne({ email }).select("+password");

  if (!user) return res.status(400).send({ error: "User not found" });

  //verifica a senha informada pelo user; .compare(senha informada, senha existente no bd)
  if (!(await bcrypt.compare(password, user.password)))
    return res.status(400).send({ error: "Invalid password" });

  //limpa o pwd do retorno
  user.password = undefined;

  res.send({
    user,
    token: generateToken({ id: user.id })
  });
});

router.post("/forgot_password", async (req, res) => {
  const { email } = req.body;

  try {
    //verifica se o email esta cadstrado no bd
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send({ erro: "user not found" });

    //gera token para acessar o reset de senha
    const tokenReset = crypto.randomBytes(20).toString("hex");

    //tempo de expiracao
    const expiresTime = new Date();
    expiresTime.setHours(expiresTime.getHours() + 1);

    //salva o token junto ao model de user
    await User.findByIdAndUpdate(user.id, {
      $set: {
        passwordResetToken: tokenReset,
        passwordResetExpires: expiresTime
      }
    });

    mailer.sendMail(
      {
        to: email,
        from: "gustavo@email.com",
        template: "auth/forgot_password",
        context: { tokenReset }
      },
      err => {
        if (err)
          // console.log("====>", err);
          return res
            .status(400)
            .send({ erro: "cannot send forgot password email" });

        return res.send();
      }
    );
  } catch (erro) {
    console.log(erro);

    res.status(400).send({ erro: "erro on forgot password, try again" });
  }
});

router.post("/reset_password", async (req, res) => {
  const { email, token, password } = req.body;

  try {
    const user = await User.findOne({ email })
    .select("+passwordResetToken passwordResetExpires");

    if(!user) return res.status(400).send({error: "user not found"});

    //verifica se os tokens sao iguais
    if(token !== user.passwordResetToken) return res.status(400).send({error: "token invalid"})

    const now = new Date();
    if(now > user.passwordResetExpires) return res.statuts(400).send({error: "token expired, generate a new one"})
    
    user.password = password
    await user.save();

    res.send();
    
  } catch (err) {
    res.status(400).send({ error: "cannot reset password, try again" });
  }
});


module.exports = app => {
  app.use(cors());
  app.use("/auth", router)
} ;
