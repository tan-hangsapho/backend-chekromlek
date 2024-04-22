import dotenv from "dotenv";
import mongoose from "mongoose";
import { app } from "./app";
dotenv.config();

const port = process.env.PORT;
const dbs = process.env.MONGO_URL;

// Connect to mongoDB and create server
if (dbs) {
  mongoose
    .connect(dbs) // connection options
    .then(() => {
      // listen to sever
      app.listen(port, () => {
        console.log(
          `Server is running on port ${port} & connect to DB`
        );
      });
    })
    .catch((err) => console.log(err));
} else {
  console.error("MONGO_URI environment variable is not set"); // Handle the missing variable
}
