import * as dotenv from "dotenv";

dotenv.config();

export const emailConfig = {
  user: process.env.USER,
  pass: process.env.PASS,
};
