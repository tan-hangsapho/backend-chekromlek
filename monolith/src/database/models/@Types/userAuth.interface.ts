export interface userAuthTypes {
    username: string;
    email: string;
    password: string;
    isVerified?: boolean;
    googleId?: string;
    createdAt?: Date;
    updateAt?: Date;
}