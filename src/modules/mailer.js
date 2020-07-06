const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

const { host, port, user, pass } = require("../config/mail.json");

var transport = nodemailer.createTransport({
  host,
  port,
  auth: { user, pass }
});

const exphbs = require('express-handlebars')
transport.use(
  'compile',
  hbs({
    viewEngine: exphbs.create({
      layoutsDir: path.resolve('./src/resources/mail/'),
      partialsDir: path.resolve('./src/resources/mail/'),
      defaultLayout: '',
      extname: '.html',
    }),
    viewPath: path.resolve('./src/resources/mail/'),
    extName: '.html',
  })
);

module.exports = transport;
