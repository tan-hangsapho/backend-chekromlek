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
import { VerificationService } from "../services/verification.service";
import { generateSignature } from "../utils/jwt";
import validateInput from "../middlewares/validate-input";
import AuthUserSignInSchema, {
  AuthUserSignUpSchema,
} from "../schemas/auth-user.schemas";

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
  private verfication: VerificationService;
  constructor() {
    this.userService = new UserAuthService();
    this.verfication = new VerificationService();
  }
  @SuccessResponse(StatusCode.Created, "Created")
  @Post("/signup")
  @Middlewares(validateInput(AuthUserSignUpSchema))
  public async SignUpUser(
    @Body() reqBody: SignUpRequestBody
  ): Promise<userAuthTypes> {
    try {
      const { username, email, password } = reqBody;
      const newUser = await this.userService.SignUp({
        username,
        email,
        password,
      });
      const userId = newUser._id.toString();

      await this.userService.SendEmailToken({
        userId,
      });
      return newUser;
    } catch (error) {
      throw error;
    }
  }
  @SuccessResponse(StatusCode.OK, "OK")
  @Get("/verify")
  public async VerifyEmail(@Query() token: string): Promise<{ token: string }> {
    try {
      // Verify the email token
      const user = await this.verfication.VerifyEmailToken(token);

      // Generate JWT for the verified user
      const jwtToken = await generateSignature({
        userId: user._id,
      });
      return { token: jwtToken };
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
      console.log(jwtToken);
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
  @Get("/auth/google/callback")
  async GoogleOAuth(@Body() code: string): Promise<any> {
    try {
      return await this.userService.SignInWithGoogleCallback(code);
    } catch (error) {
      throw error;
    }
  }
}
