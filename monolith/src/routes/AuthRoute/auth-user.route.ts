import express, { Request, Response, NextFunction } from "express";
import { UserAuthController } from "../../controllers/AuthController/auth-user.controller";
import { validate } from "../../middlewares/validate";
import { AuthUserSignUpSchema } from "../../schemas/auth-user.schemas";
import { StatusCode } from "../../utils/consts";
import { userAuthTypes } from "../../database/models/@Types/userAuth.interface";
import CustomError from "../../errors/custom-erorrs";

export const userRouter = express.Router();
const controllers = new UserAuthController();

userRouter.post(
  "/signup",
  validate(AuthUserSignUpSchema), // Validate request body against the schema
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestBody = req.body;

      await controllers.SignUpUser(requestBody);

      return res.status(StatusCode.Created).send({ message: "Create Success" });
    } catch (error) {
      res.status(StatusCode.Found).send({ message: error.message });
    }
  }
);

userRouter.get(
  "/verify",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.query.token as string; // Assuming the token is passed as a query parameter
      await controllers.VerifyEmail(token);
      return res.status(StatusCode.Found).json("Successfully verifiy");
    } catch (error: any) {
      res.status(StatusCode.BadRequest).json({ message: error.message });
    }
  }
);
