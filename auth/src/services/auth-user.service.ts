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
// import { VerificationService } from "./verification.service";
import { UserSignInSchemaType } from "../schemas/@types/auth.types";
import { VerificationRepository } from "../database/repositories/verification-request.repo";
import APIError from "../errors/api-error";
import DuplicateError from "../errors/duplicate-error";
import { logger } from "../utils/logger";
import { publishDirectMessage } from "../queues/auth-producer";
import { authChannel } from "../server";

export class UserAuthService {
  private userRepo: UserAuthRpository;
  private verificationRepo: VerificationRepository;
  constructor() {
    this.userRepo = new UserAuthRpository();
    // this.verification = new VerificationService();
    this.verificationRepo = new VerificationRepository();
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
        if (!existingUser.isVerified) {
          throw new CustomError(
            "Email not verified, please verify your email address",
            StatusCode.BadRequest
          );
        }
        throw new CustomError(
          "Email address is already in use",
          StatusCode.Found
        );
      }

      const savedUser = await this.userRepo.createAuthUser(newUserAuth);
      return savedUser;
    } catch (error) {
      if (error instanceof DuplicateError) {
        const existedUser = await this.userRepo.FindUser({
          email: user.email,
        });
        if (!existedUser?.isVerified) {
          const token = await this.verificationRepo.FindVerificationTokenById({
            id: existedUser!._id.toString(),
          });

          if (!token) {
            logger.error(`UserService Create() method error: token not found!`);
            throw new APIError(
              `Something went wrong!`,
              StatusCode.InternalServerError
            );
          }
          const messageDetails = {
            receiverEmail: existedUser!.email,
            verifyLink: `${token.token}`,
            template: "verifyEmail",
          };

          await publishDirectMessage(
            authChannel,
            "email-notification",
            "auth-email",
            JSON.stringify(messageDetails),
            "Verify email message has been sent to notification service"
          );
          throw new APIError(
            "A user with this email already exists. Verification email resent.",
            StatusCode.Conflict
          );
        } else {
          throw new APIError(
            "A user with this email already exists. Please login.",
            StatusCode.Conflict
          );
        }
      }
      throw error;
    }
  }
  async SendEmailToken({ userId }: { userId: string }) {
    try {
      const timestamp = new Date();

      const emailVerificationToken = generateEmailVerificationToken();
      const verification = new VerificationModel({
        userId,
        token: emailVerificationToken,
        expiredDate: timestamp,
      });
      const existedUser = await this.userRepo.FindUserById({ id: userId });
      if (!existedUser) {
        throw new CustomError("User does not exist!", StatusCode.NotFound);
      }
      return await verification.save();
    } catch (error) {
      throw error;
    }
  }

  // TODO:
  // 1. find token is the token exist or not
  // 2. find users is the users exist or not
  // 3. If the user exist then mark the user to true
  // 4. save user in database
  // 5. delete the token from database
  async VerifyEmailToken({ token }: { token: string }) {
    const isTokenExisting =
      await this.verificationRepo.FindAccountVerificationToken({ token });
    if (!isTokenExisting) {
      throw new APIError(
        "Verification token is invalid",
        StatusCode.BadRequest
      );
    }
    const users = await this.userRepo.FindUserById({
      id: isTokenExisting.userId.toString(),
    });
    if (!users) {
      throw new APIError("User does not exist", StatusCode.NotFound);
    }
    users.isVerified = true;
    await users.save();
    await this.verificationRepo.deleteAccountVerificationToken({
      token,
    });
    return users;
  }

  async Login(userDetail: UserSignInSchemaType) {
    const auth = await this.userRepo.FindUser({ email: userDetail.email });
    if (!auth) {
      throw new CustomError("User not exist", StatusCode.NotFound);
    }
    if (!auth.isVerified) {
      throw new CustomError(
        "Email not verified, please verify your email address",
        StatusCode.BadRequest
      );
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
  async FindUserByEmail({ email }: { email: string }) {
    try {
      const user = await this.userRepo.FindUser({ email });
      return user;
    } catch (error) {
      throw error;
    }
  }
  async UpdateUser({ id, updates }: { id: string; updates: object }) {
    try {
      const user = await this.userRepo.FindUserById({ id });
      if (!user) {
        throw new APIError("User does not exist", StatusCode.NotFound);
      }
      const updatedUser = await this.userRepo.UpdateUserbyId({
        id,
        update: updates,
      });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
}