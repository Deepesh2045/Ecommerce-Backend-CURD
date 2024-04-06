import mongoose from "mongoose";
import { object } from "yup";

// set rule
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    max_length: 25,
  },
  lastName: { type: String, required: true, trim: true, max_length: 25 },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    max_length: 25,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  // dob: {
  //   type: Date,
  //   required: true,
  //   default: null,
  // },
  // gender: {
  //   type: String,
  //   required: true,
  //   trim: true,
  //   enum: ["male", "female", "other"],
  // },
  role: {
    type: String,
    required: true,
    trim: true,
    enum: ["buyer", "seller"],
  },
  image: {
    type: [String],
    required: false,
    trim: true,
    // default: null,
  },
});
userSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

// create table
const User = mongoose.model("User", userSchema);

export default User;
