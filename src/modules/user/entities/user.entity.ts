export class User {
  id?: number;
  email: string;
  password: string;
  resetPasswordToken?: string;
  resetPasswordTokenExpiry?: Date;
}
