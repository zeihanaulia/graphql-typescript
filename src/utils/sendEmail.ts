import * as nodemailer from "nodemailer";

export const sendEmail = async (recipient: string, url: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "kaia12@ethereal.email",
      pass: "BeJfTAY9TEeufVb1hu"
    }
  });

  let message = {
    from: "Sender Name <sender@example.com>",
    to: `Recipient <${recipient}>`,
    subject: "Nodemailer is unicode friendly",
    text: "hello to myself",
    html: `<html>
            <body>
                <p> testing nodemailer - the world awesome email service! </p>
                <a href="${url}" >confirm email</a>
            </body>
        </html>`
  };

  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log("Error occured. " + err.message);
    }
    console.log("message send: %s", info.messageId);
    console.log("Preview url: %s", nodemailer.getTestMessageUrl(info));
  });
};
