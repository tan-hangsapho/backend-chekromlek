import dotenv from "dotenv";
import { app } from "./app";
import { connectMongoDB } from "./utils/dbconnection";
dotenv.config();
const port = process.env.PORT || 3001;


connectMongoDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});