export interface AuthCreateUserRepository {
  username: string;
  email: string;
  password?: string;
  googleId?: string;
}
