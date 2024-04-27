import express, { Request, Response, NextFunction } from "express";
import { UserAuthController } from "../../controllers/auth-user.controller";
import { validate } from "../../middlewares/validate";
import AuthUserSignInSchema, {
  AuthUserSignUpSchema,
} from "../../schemas/auth-user.schemas";
import { StatusCode } from "../../utils/consts";
import CustomError from "../../errors/custom-erorrs";
import { OauthConfig } from "../../utils/oath-config";

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
userRouter.post("/login", validate(AuthUserSignInSchema), async (req, res) => {
  try {
    const requestBody = req.body;
    await controllers.LoginWithEmail(requestBody);
    return res.status(StatusCode.OK).json({ message: "Login Success" });
  } catch (error: any) {
    let statusCode = StatusCode.BadRequest; // Default status code for validation errors
    if (error instanceof CustomError) {
      statusCode = error.statusCode; // Use the status code from the CustomError if available
    }
    res.status(statusCode).json({ message: error.message });
  }
});

userRouter.get(
  "/auth/google",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const redirect = "http://localhost:3000/auth/google/callback";
      const clientId = process.env.CLIENT_ID as string;
      const googleConfig = await OauthConfig.getInstance();
      const authUrl = await googleConfig.GoogleConfigUrl(clientId, redirect);
      res.redirect(authUrl);
    } catch (error) {
      next(error);
    }
  }
);

userRouter.get(
  "/auth/google/callback",
  async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.query;
    try {
      const queryCode = code as string;
      const userInfoResponse = await controllers.GoogleOAuth(queryCode);

      res.status(StatusCode.OK).json({
        success: true,
        user: userInfoResponse.newUser,
        token: userInfoResponse.jwtToken,
      });
    } catch (error) {
      next(error);
    }
  }
);
