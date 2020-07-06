const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth.json");

module.exports = (req, res, next) => {
  //aconselha-se fazer pequenas verificacoes de token antes da verificacao maior/final, a fim de diminuir processamento no backend
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).send({ error: "no token provided" });

  //verifica/valida a formacao/estrutura do token
  const parts = authHeader.split(" ");

  if (!parts.lenght === 2)
    return res.status(401).send({ error: "token error" });

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme))
    return res.status(401).send({ error: "token malformatted" });

  jwt.verify(token, authConfig.secret, (erro, decoded) => {
    //decoded - representa o id do user se o token estiver certo
    if (erro) return res.status(401).send({ error: "invalid token" });

    //passa o decoded para as prox reqs
    req.userId = decoded.id;
    return next();
  });
};
