import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "66913a94ffeedb",
    pass: "1083865da3ee0d",
  },
});

// async..await is not allowed in global scope, must use a wrapper
export const sendEmailOTP = async (firstName,otp,email) => {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: 'rdonlineshop@gmail.com', // sender address
    to: "rddesign64@gmail.com", // list of receivers
    subject: "Reset password otp", // Subject line
    text: "Hello world?", // plain text body
    html: `<div><h3>Forget password otp</h3><br/> <p>Dear ${firstName},</p><br/> <p>Your otp for rd online shop app is ${otp}</p> <p>If you did not request to change password, you can ignore this message</p></div>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
};

