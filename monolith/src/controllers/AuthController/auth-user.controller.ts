import { Body, Post, Query, Route, SuccessResponse, Tags, Get } from "tsoa";
import { StatusCode } from "../../utils/consts";
import { UserAuthService } from "../../services/AuthService/auth-user.service";
import CustomError from "../../errors/custom-erorrs";
import { userAuthTypes } from "../../database/models/@Types/userAuth.interface";
import { VerificationService } from "../../services/verification.service";
import { generateSignature } from "../../utils/jwt";

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
}
