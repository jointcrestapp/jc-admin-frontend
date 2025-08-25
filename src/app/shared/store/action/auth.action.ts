import { 
  AuthUserForgotModel, 
  AuthUserStateModel, 
  UpdatePasswordModel, 
  VerifyEmailOtpModel 
} from "../../interface/auth.interface";


export class LoginSuccess {
  static readonly type = '[Auth] Login Success';
  constructor(public payload: {
    token: string;
    expiry: number;
    user: any; // adjust type if you have a User interface
  }) {}
}

export class Login {
  static readonly type = "[Auth] Login";
  constructor(public payload: AuthUserStateModel) {}
}

export class ForgotPassWord {
  static readonly type = '[Auth] Forgot Password';
  constructor(public payload: { email: string }) {}
}

export class ForgotPasswordSuccess {
  static readonly type = '[Auth] Forgot Password Success';
  constructor(public payload: any) {}
}

export class ForgotPasswordFailed {
  static readonly type = '[Auth] Forgot Password Failed';
  constructor(public payload: any) {}
}

export class VerifyEmailOtp {
  static readonly type = "[Auth] VerifyEmailOtp";
  constructor(public payload: VerifyEmailOtpModel) {}
}

export class VerifyEmailOtpSuccess {
  static readonly type = '[Auth] Verify Email OTP Success';
  constructor(public payload: any) {}
}

export class VerifyEmailOtpFailed {
  static readonly type = '[Auth] Verify Email OTP Failed';
  constructor(public payload: any) {}
}


export class UpdatePassword {
  static readonly type = "[Auth] UpdatePassword";
  constructor(public payload: UpdatePasswordModel) {}
}

export class Logout {
  static readonly type = "[Auth] Logout";
  
}

export class AuthClear {
  static readonly type = "[Auth] Clear";
}

export class SetToken {
  static readonly type = '[Auth] Set Token';
  constructor(public payload: { token: string; expiry: number }) {}
}

export class ClearToken {
  static readonly type = '[Auth] Clear Token';
}


