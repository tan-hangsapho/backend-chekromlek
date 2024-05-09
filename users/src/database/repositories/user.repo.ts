import { IUser, UserModel } from "../models/user.model";
import { UserUpdate } from "./@types/user.types";

export class UserRepository {
  async createUser(userData: IUser) {
    try {
      const existingUser = await UserModel.findOne({ email: userData.email });
      if (existingUser) {
        // throw new CustomError("Email already exist", StatusCode.Found);
      }
      //new user and create user
      const user = await UserModel.create(userData);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findUserById({ id }: { id: string }) {
    return await UserModel.findById(id);
  }

  async UpdateUserbyId({ id, update }: { id: string; update: UserUpdate }) {
    return await UserModel.findByIdAndUpdate(id, update, { new: true });
  }

  async deleteUser({ id }: { id: string }) {
    try {
      return await UserModel.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  // Additional methods to handle other operations
}
