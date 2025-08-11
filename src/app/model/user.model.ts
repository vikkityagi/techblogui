export interface User {
  email: string;
  password: string;
  role: 'admin' | 'user';
  isVerify?: boolean;
  message?: string;
  otpReference?: string;
  otpExpirationTime?:number;
}