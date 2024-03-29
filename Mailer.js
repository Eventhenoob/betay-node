const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "otp1873@gmail.com",
    pass: "lzza bsft dukg glrf",
  },
});

const sendMail = async (name, email, message) => {
  return await transporter.sendMail({
    from: `${email}`,
    to: `cbhrat50@gmail.com`,
    subject: "From Contact Us",
    text: `
    name: ${name},
    email: ${email},
    message: ${message}
    `,
  });
};

module.exports = sendMail;
