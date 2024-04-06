import express from "express";
import {
  passwordValidationSchema,
  userEmailValidationSchema,
  verifyOtpValidationSchema,
} from "./user validation.js";
import User from "./user.model.js";
import {  otpGenerators } from "./test.js";
import { sendEmailOTP } from "./email.service.js";
import Otp from "../otp/otp.model.js";
import bcrypt from "bcrypt";
import otpGenerator from 'otp-generator'


const router = express.Router();

// send email otp
router.post(
  "/otp/send-email",
  async (req, res, next) => {
    // extract new values from req.body
    const newValues = req.body;
    // validate new values using Yup schema
    try {
      const validatedData = await userEmailValidationSchema.validate(newValues);
      req.body = validatedData;
    } catch (error) {
      //if validation fails,throw error
      return res.status(400).send({ message: error.message });
    }
    // call next function
    next();
  },
  async (req, res) => {
    // extract email from req.body
    const { email } = req.body;
    console.log(email);

    // find user using email
    const user = await User.findOne({ email });
    // if not user,throw error
    if (!user) {
      return res.status(404).send({ message: "Email does not exist" });
    }
    // generate and send OPT
    // const otp = generateOtp();
     
   const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets:false }); 
    
    console.log(otp)

    //send email
    await sendEmailOTP(user.firstName, otp,email);
    await Otp.deleteMany();
    await Otp.create({ otp, email });
    return res.status(200).send({ message: "Otp is send to your email." });
  }
);

// verify otp
router.post(
  "/otp/verify",
  async (req, res, next) => {
    // extract new values from req.body
    const newValues = req.body;
    // validate new values using Yup schema
    try {
      const validatedData = await verifyOtpValidationSchema.validate(newValues);
      req.body = validatedData;
    } catch (error) {
      //if validation fails,throw error
      return res.status(400).send({ message: error.message });
    }
    // call next function
    next();
  },
  async (req, res) => {
    // extract verification data from req.body
    const verificationData = req.body;

    //find otp using email
    const otpDoc = await Otp.findOne({ email: verificationData.email });
    console.log(otpDoc);

    // if not otp, throw error
    if (!otpDoc) {
      return res.status(404).send({ message: "Something went wrong" });
    }

    // check if otp matches
    const isOtpMatch = verificationData.otp === otpDoc.otp;

    // if otp does not match, throw error
    if (!isOtpMatch) {
      return res.status(404).send({ message: "Invalid otp code" });
    }

    // set is verify to true
    await Otp.updateOne(
      { email: verificationData.email },
      {
        $set: {
          isVerified: true,
        },
      }
    );
    return res.status(200).send({ message: "Otp is verified successfully" });
  }
);

// change password
router.put(
  "/otp/change-password",
  async (req, res, next) => {
    const newValues = req.body;
    // validate new values using Yup schema
    try {
      const validatedData = await passwordValidationSchema.validate(newValues);
      req.body = validatedData;
    } catch (error) {
      //if validation fails,throw error
      return res.status(400).send({ message: error.message });
    }
    // call next function
    next();
  },
  async (req, res) => {
    // extract new password from req.body
    const { email, newPassword } = req.body;
    // find otp document using this email
    const otpDoc = await Otp.findOne({ email });
    // if not otp doc,throw error
    if (!otpDoc) {
      return res.status(404).send({ message: "Something went wrong" });
    }

    // if otp code is not verified, throw error
    if (!otpDoc.isVerified) {
      return res.status(404).send({ message: "Otp is not verified.Try again." });
    }
    // let user change password

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ email }, { $set: { password: hashedPassword } });

    // remove otp doc for this email
    await Otp.deleteMany({ email });

    res.status(200).send({ message: "Password is changed successfully" });
  }
);

export default router;
