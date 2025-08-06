import { Permission } from "./role.interface";

export interface AuthUserStateModel {
  email: string;
  password: string;
}

export interface AuthModel {
  email: string;
  token: string | string;
  access_token: string | null;
  permissions: Permission[];
}

export interface AuthUserForgotModel {
  email: string;
}

export interface VerifyEmailOtpModel {
  email: string;
  otp: number;
  token: string;
}

export interface UpdatePasswordModel {
  password: string;
  password_confirmation: string;
  email: string;
  token: string;
}
