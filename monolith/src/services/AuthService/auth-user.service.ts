import { userAuthTypes } from "../../database/models/@Types/userAuth.interface";
import VerificationModel from "../../database/models/verification-request.model";
import { UserAuthRpository } from "../../database/repositories/AuthRepo/auth-user.repo";
import CustomError from "../../errors/custom-erorrs";
import { AuthUserSignUpSchema } from "../../schemas/auth-user.schemas";
import { StatusCode } from "../../utils/consts";
import { generatePassword } from "../../utils/jwt";
import { generateEmailVerificationToken } from "../../utils/verification-token";
import { VerificationService } from "../verification.service";

export class UserAuthService {
  private userRepo: UserAuthRpository;
  private verfication: VerificationService;
  constructor() {
    this.userRepo = new UserAuthRpository();
    this.verfication = new VerificationService();
  }
  async SignUp(user: userAuthTypes) {
    try {
      const hashedPassword =
        user.password && (await generatePassword(user.password));
      let newUserAuth = { ...user };
      if (hashedPassword) {
        newUserAuth = { ...newUserAuth, password: hashedPassword };
      }
      const existingUser = await this.userRepo.FindUser({ email: user.email });

      if (existingUser) {
        throw new CustomError(
          "Email address is already in use",
          StatusCode.Found
        );
      }

      const savedUser = await this.userRepo.createAuthUser(newUserAuth);
      return savedUser;
    } catch (error: unknown) {
      throw error;
    }
  }
  async SendEmailToken({ userId }: { userId: string }) {
    try {
      const existedUser = await this.userRepo.FindUserById({ id: userId });
      if (!existedUser) {
        throw new CustomError("User does not exist!", StatusCode.NotFound);
      }
      const timestamp = new Date();

      const generateToken = generateEmailVerificationToken();
      const verification = new VerificationModel({
        userId,
        token: generateToken,
        expiredDate: timestamp,
      });
      await verification.save();
      return this.verfication.sendVerificationEmail(existedUser, generateToken);
    } catch (error) {
      throw error;
    }
  }
}
