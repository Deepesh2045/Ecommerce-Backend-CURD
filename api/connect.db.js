import mongoose from "mongoose";

const dbName = process.env.DB_NAME
const dbUserName = process.env.DB_USER_NAME
const dbPassword = process.env.DB_PASSWORD
const connectDb = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${dbUserName}:${dbPassword}@cluster0.71vcmho.mongodb.net/${dbName}?retryWrites=true&w=majority`
    );
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Database connection failed");
    console.log(error.message);
  }
};
export default connectDb;
