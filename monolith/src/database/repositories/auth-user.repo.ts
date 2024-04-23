import { UserAuth } from "../models/authentication-user.models";
import { AuthCreateUserRepository } from "./@types/auth-user.types";

export class UserAuthRpository {
    

  // Create User Account
  async createAuthUser(user: AuthCreateUserRepository) {
    try {
      const existingUser = await this.FindUser({ email: user.email });
      if (existingUser) {
        throw new Error("Email is already exists");
      }

      const newAuthUser = new UserAuth(user);
      const UserResult = await newAuthUser.save();
      return UserResult;
    } catch (error: any) {}
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
}
