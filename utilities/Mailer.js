const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const { email, subject, message } = options;
  // create the mail transporter
  const mailTransporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_HOST_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // configure mail options
  const mailOptions = {
    from: "Anthony Mwenyo, <zedtours@anthony.com>",
    to: email,
    subject: subject,
    text: message,
  };
  // send email
 await mailTransporter.sendMail(mailOptions);
};

module.exports = sendEmail;
