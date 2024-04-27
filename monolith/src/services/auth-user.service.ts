import { userAuthTypes } from "../database/models/@Types/userAuth.interface";
import VerificationModel from "../database/models/verification-request.model";
import { UserAuthRpository } from "../database/repositories/auth-user.repo";
import CustomError from "../errors/custom-erorrs";
import { StatusCode } from "../utils/consts";
import {
  generatePassword,
  generateSignature,
  validationPassword,
} from "../utils/jwt";
import { generateEmailVerificationToken } from "../utils/verification-token";
import { VerificationService } from "./verification.service";
import { UserSignInSchemaType } from "../schemas/@types/auth.types";
import { OauthConfig } from "../utils/oath-config";
import { VerificationRepository } from "../database/repositories/verification-request.repo";

export class UserAuthService {
  private userRepo: UserAuthRpository;
  private verification: VerificationService;
  constructor() {
    this.userRepo = new UserAuthRpository();
    this.verification = new VerificationService();
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
      if (!existingUser.isVerified) {
        throw new CustomError("Email not verified", StatusCode.BadRequest);
      }

      const savedUser = await this.userRepo.createAuthUser(newUserAuth);
      return savedUser;
    } catch (error: unknown) {
      throw error;
    }
  }
  async SendEmailToken({ userId }: { userId: string }) {
    try {
      const timestamp = new Date();

      const generateToken = generateEmailVerificationToken();
      const verification = new VerificationModel({
        userId,
        token: generateToken,
        expiredDate: timestamp,
      });
      await verification.save();
      const existedUser = await this.userRepo.FindUserById({ id: userId });
      if (!existedUser) {
        throw new CustomError("User does not exist!", StatusCode.NotFound);
      }
      return this.verification.sendVerificationEmail(
        existedUser,
        generateToken
      );
    } catch (error) {
      throw error;
    }
  }
  async Login(userDetail: UserSignInSchemaType) {
    const auth = await this.userRepo.FindUser({ email: userDetail.email });
    if (!auth) {
      throw new CustomError("User not exist", StatusCode.NotFound);
    }
    const isPwdCorrect = await validationPassword({
      enterPassword: userDetail.password,
      savedPassword: auth.password as string,
    });
    if (!isPwdCorrect) {
      throw new CustomError(
        "Email or Password is incorrect",
        StatusCode.BadRequest
      );
    }
    const token = await generateSignature({ userId: auth._id });
    return token;
  }
  async SignInWithGoogleCallback(code: string) {
    try {
      const googleConfig = await OauthConfig.getInstance();
      const tokenResponse = await googleConfig.GoogleStrategy(code);
      const accessToken = tokenResponse.accessToken;
      const userInfoResponse = await googleConfig.GoogleAccessInfo(accessToken);
      const { username, email, googleId, isVerified, profile } =
        userInfoResponse.data;
      const user = await this.userRepo.FindUser(email);
      if (user) {
        const jwtToken = await generateSignature({ payload: googleId });
        return { jwtToken };
      }
      const newUser = await this.userRepo.CreateOauthUser({
        username: username,
        email: email,
        googleId: googleId,
        isVerified: isVerified,
        profile: profile,
      });

      const timestamp = new Date();

      const generateToken = generateEmailVerificationToken();
      const verification = new VerificationModel({
        userId: newUser._id,
        token: generateToken,
        expiredDate: timestamp,
      });
      await verification.save();
      const existedUser = await this.userRepo.FindUserById({ id: newUser.id });
      if (!existedUser) {
        throw new CustomError("User does not exist!", StatusCode.NotFound);
      }
      return this.verification.sendVerificationEmail(
        existedUser,
        generateToken
      );
    } catch (error) {
      throw error;
    }
  }
}
