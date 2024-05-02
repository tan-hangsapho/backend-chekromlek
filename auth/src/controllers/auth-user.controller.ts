import {
  Body,
  Post,
  Query,
  Route,
  SuccessResponse,
  Tags,
  Get,
  Middlewares,
} from "tsoa";
import { StatusCode } from "../utils/consts";
import { UserAuthService } from "../services/auth-user.service";
import CustomError from "../errors/custom-erorrs";
import { userAuthTypes } from "../database/models/@Types/userAuth.interface";
import { generateSignature } from "../utils/jwt";
import validateInput from "../middlewares/validate-input";
import AuthUserSignInSchema, {
  AuthUserSignUpSchema,
} from "../schemas/auth-user.schemas";
import { use } from "passport";
import { publishDirectMessage } from "../queues/auth-producer";
import { authChannel } from "../server";
import { logger } from "../utils/logger";
import APIError from "../errors/api-error";
import { IAuthUserMessageDetails } from "../queues/@types/auth.types";
import axios from "axios";

interface LoginRequestBody {
  email: string;
  password: string;
}
interface SignUpRequestBody {
  username: string;
  email: string;
  password: string;
}

@Route("auth")
@Tags("Authentication")
export class UserAuthController {
  private userService: UserAuthService;
  constructor() {
    this.userService = new UserAuthService();
  }
  @SuccessResponse(StatusCode.Created, "Created")
  @Post("/signup")
  @Middlewares(validateInput(AuthUserSignUpSchema))
  public async SignUpUser(@Body() reqBody: SignUpRequestBody): Promise<any> {
    try {
      const { username, email, password } = reqBody;
      const newUser = await this.userService.SignUp({
        username,
        email,
        password,
      });
      const verificationToken = await this.userService.SendEmailToken({
        userId: newUser._id.toString(),
      });
      const messageDetails = {
        receiverEmail: newUser.email,
        verifyLink: `${verificationToken.token}`,
        template: "verifyEmail",
      };
      await publishDirectMessage(
        authChannel,
        "chekromlek-email-notification",
        "auth-email",
        JSON.stringify(messageDetails),
        "Verify email message has been sent to notification service"
      );
      return {
        message: "Sign up successfully. Please verify your email.",
        data: newUser,
      };
    } catch (error) {
      throw error;
    }
  }
  @SuccessResponse(StatusCode.OK, "OK")
  @Get("/verify")
  public async VerifyEmail(
    @Query() token: string
  ): Promise<{ message: string; token: string }> {
    try {
      // Verify the email token
      const user = await this.userService.VerifyEmailToken({ token });

      // Generate JWT for the verified user
      const jwtToken = await generateSignature({
        userId: user._id,
      });

      const userDetail = await this.userService.FindUserByEmail({
        email: user.email,
      });
      if (!userDetail) {
        logger.error(
          `AuthController VerifyEmail() method error: user not found`
        );
        throw new APIError(
          `Something went wrong`,
          StatusCode.InternalServerError
        );
      }

      const messageDetails: IAuthUserMessageDetails = {
        username: userDetail.username,
        email: userDetail.email,
        type: "auth",
      };

      await publishDirectMessage(
        authChannel,
        "microsample-user-update",
        "user-applier",
        JSON.stringify(messageDetails),
        "User details sent to user service"
      );

      return { message: "User verify email successfully", token: jwtToken };
    } catch (error) {
      throw error;
    }
  }
  @SuccessResponse(StatusCode.OK, "OK")
  @Post("/login")
  @Middlewares(validateInput(AuthUserSignInSchema))
  public async LoginWithEmail(
    @Body() requestBody: LoginRequestBody
  ): Promise<{ token: string }> {
    try {
      const { email, password } = requestBody;
      // Call the userService to perform the login operation
      const jwtToken = await this.userService.Login({ email, password });
      if (!jwtToken) {
        // Handle failed login with a specific error
        throw new CustomError(
          "email or password is incorrect",
          StatusCode.Unauthorized
        );
      }
      // Return the JWT token in the response
      return {
        token: jwtToken,
      };
    } catch (error) {
      // Handle specific error types
      if (error instanceof CustomError) {
        // More fine-grained status codes based on CustomError type
        throw error;
      } else {
        console.error("Unexpected error:", error);
        throw new CustomError("Login failed", StatusCode.InternalServerError);
      }
    }
  }
  @SuccessResponse(StatusCode.OK, "OK")
  @Get("/google")
  public async GoogleAuth() {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.CLIENT_URL}&response_type=code&scope=profile email`;
    return { url };
  }
  @SuccessResponse(StatusCode.OK, "OK")
  @Get("/google/callback")
  public async GoogleAuthCallback(@Query() code: string) {
    try {
      const { data } = await axios.post("https://oauth2.googleapis.com/token", {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
        redirect_uri: process.env.CLIENT_URL,
        grant_type: "authorization_code",
      });
      // Fetch user profile
      const profile = await axios.get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        {
          headers: { Authorization: `Bearer ${data.access_token}` },
        }
      );
      const existingUser = await this.userService.FindUserByEmail({
        email: profile.data.email,
      });
      if (existingUser) {
        // User Exists, link the Google account if it's not already linked
        if (!existingUser.googleId) {
          await this.userService.UpdateUser({
            id: existingUser._id.toString(),
            updates: { googleId: profile.data.id, isVerified: true },
          });
        }

        // Now, proceed to log the user in
        const jwtToken = await generateSignature({
          userId: existingUser._id,
        });

        return {
          token: jwtToken,
        };
      }
      // No user exists with this email, create a new user
      const newUser = await this.userService.SignUp({
        username: profile.data.name,
        email: profile.data.email,
        isVerified: true,
        googleId: profile.data.id,
      });

      const jwtToken = await generateSignature({
        userId: newUser._id,
      });

      return {
        token: jwtToken,
      };
    } catch (error) {
      throw new error();
    }
  }
}