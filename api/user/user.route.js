import express from "express";
import {
  loginUserValidationSchema,
  registerUserValidationSchema,
} from "./user validation.js";
import User from "./user.model.js";
import { generateHashPassword } from "../utils/password.function.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

// register
router.post(
  "/user/register",
  async (req, res, next) => {
    const newUser = req.body;
    try {
      const validatedData = await registerUserValidationSchema.validate(
        newUser
      );
      req.body = validatedData;
      next();
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  },

  async (req, res) => {
    // extract new user from req.body
    const newUser = req.body;
    // find user with email
    const user = await User.findOne({ email: newUser.email });
    // if user, throw error
    if (user) {
      return res.status(409).send({ message: "Email already exist" });
    }
    // hash password
    const hashedPassword = await generateHashPassword(newUser.password);
    // create user
    newUser.password = hashedPassword;

    await User.create(newUser);
    // send response
    return res.status(200).send({ message: "User is register successfully." });
  }
);
//login
router.post(
  "/user/login",
  async (req, res, next) => {
    //extract login credentials from req.body
    const loginCredentials = req.body;
    // validate
    try {
      const validatedData = await loginUserValidationSchema.validate(
        loginCredentials
      );
      req.body = validatedData;
      next();
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  },
  async (req, res, next) => {
    //extract login credentials from req.body
    const loginCredentials = req.body;
    // find user with using email
    const user = await User.findOne({ email: loginCredentials.email });
    // if not user email throw error
    if (!user) {
      return res.status(404).send({ message: "Invalid Credentials" });
    }
    // check for password match
    const isPasswordMatch = await bcrypt.compare(
      loginCredentials.password,
      user.password
    );
    // if not password match throw error
    if (!isPasswordMatch) {
      return res.status(404).send({ message: "Invalid Credentials" });
    }
    // generate token
    const payload = { userId: user._id };
    const token = jwt.sign(
      payload,
      "51183235e087ca9aad763b18c5e68c6ca93ae29c435ffe683d05f39c98c81cc4ebe75f9d3aa5d0e873d623da17ae7211b29d969b0700fbb8e8789a5c224fafdc",
      {
        expiresIn: "1d",
      }
    );
    console.log(token);

    // send response
    return res
      .status(200)
      .send({ message: "Success", token: token, user: user });
  },
  async (req, res) => {}
);

export default router;
