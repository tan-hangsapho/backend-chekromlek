import mongoose from "mongoose";
import dotenv from "dotenv";
import CustomError from "../errors/custom-erorrs";
dotenv.config();

async function connectMongoDB() {
  try {
    const dbs = process.env.MONGO_URL;
    await mongoose.connect(`${dbs}`);
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1);
  }
}

export { connectMongoDB };
