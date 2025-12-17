// helpers/mailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true para 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_USER, // Tu correo de Gmail
    pass: process.env.EMAIL_PASS, // Tu contraseña de aplicación de Gmail
  },
});

transporter.verify().then(() => {
    console.log('Listo para enviar correos');
}).catch((err) => {
    console.log('❌ Error al configurar el mailer:', err);
});

module.exports = {
    transporter
}