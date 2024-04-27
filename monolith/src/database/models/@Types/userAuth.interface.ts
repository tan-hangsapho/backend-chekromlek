export interface userAuthTypes {
  username: string;
  email: string;
  password: string;
  isVerified?: boolean;
  facebookId?: string;
  googleId?: string;
  profile?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthUserTypeDoc extends Document {
  username: string;
  email: string;
  password?: string;
}
