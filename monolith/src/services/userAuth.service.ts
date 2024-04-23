import { userAuthTypes } from "../database/models/@Types/userAuth.interface";
import { UserAuthRpository } from "../database/repositories/auth-user.repo";
import { generatePassword } from "../utils/jwt";

export class UserAuthService {
  constructor(private readonly authService: UserAuthRpository) {}

  async SignUp(user: userAuthTypes) {
    try {
      // TODO:
      // 1. Hash The Password If Register With Email
      // 2. Save User to DB
      // 3. If Error, Check Duplication

      // STEP 1 : HASH PASSWORD
      const hashedPassword = user.password &&  (await generatePassword(user.password));
      let newUserAuth = {...user}
      if (hashedPassword) {
        newUserAuth = {...newUserAuth, password: hashedPassword}
      }

      // STEP 2 : SAVE USER TO DB
      const savedUser = await this.authService.createAuthUser(newUserAuth);
      return savedUser;
    
   
    } catch (error: any) {}
  }
}
