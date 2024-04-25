import CustomError from "../../../errors/custom-erorrs";
import { StatusCode } from "../../../utils/consts";
import { userAuthTypes } from "../../models/@Types/userAuth.interface";
import { UserAuth } from "../../models/AuthModels/authentication-user.models";
import {
  AuthCreateUserRepository,
  AuthUpdateUserRepository,
} from "../@types/auth-user.types";

export class UserAuthRpository {
  // Create User Account
  async createAuthUser(user: AuthCreateUserRepository) {
    try {
      const existingUser = await this.FindUser({ email: user.email });
      if (existingUser) {
        throw new CustomError("Email already exist", StatusCode.Found);
      }
      //new user and create user
      const newAuthUser = new UserAuth(user);
      const userResult = await newAuthUser.save();
      return userResult;
    } catch (error: any) {
      if (error instanceof CustomError) {
        throw Error;
      }
      throw new CustomError(error.message, StatusCode.BadRequest);
    }
  }
  // Find User Account
  async FindUser({ email }: { email: string }) {
    try {
      const existingUser = await UserAuth.findOne({ email: email });
      return existingUser;
    } catch (error: any) {
      throw new Error("error is not found");
    }
  }
  async FindUserById({ id }: { id: string }) {
    try {
      const existingUser = await UserAuth.findById(id);
      return existingUser;
    } catch (error) {
      throw new CustomError("user is not found", StatusCode.NotFound);
    }
  }
  async UpdateUserbyId({
    id,
    update,
  }: {
    id: string;
    update: AuthUpdateUserRepository;
  }) {
    const isExist = await this.FindUserById({ id });
    if (!isExist) {
      throw new CustomError("User does not exist", StatusCode.NotFound);
    }
    try {
      const existingUser = await UserAuth.findByIdAndUpdate(id, update, {
        new: true,
      });
      return existingUser;
    } catch (error: any) {
      throw new CustomError(error.message, StatusCode.BadRequest);
    }
  }
  async checkUniqueUsername(username: string) {
    try {
      // Replace 'UserAuth' with your actual Mongoose model name
      const existingUser = await UserAuth.findOne({ username });
      return !existingUser;
    } catch (error) {
      throw new CustomError(error.message, StatusCode.BadRequest);
    }
  }
  async findUserByUsernameOrEmail(
    usernameOrEmail: string
  ): Promise<userAuthTypes | null> {
    // Search for a user by username or email
    const user = await UserAuth.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    return user;
  }
}
