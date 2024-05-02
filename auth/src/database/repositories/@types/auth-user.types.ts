export interface AuthCreateUserRepository {
  username: string;
  email: string;
  password?: string;
  isVerified?: boolean;
  googleId?: string;
  profile?: string;
}
export interface AuthUpdateUserRepository {
  username?: string;
  email?: string;
  password?: string;
  googleId?: string;
}
