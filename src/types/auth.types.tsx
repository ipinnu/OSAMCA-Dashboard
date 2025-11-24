// src/types/auth.types.ts
export interface SignUpData {
  lastName: string;
  middleName: string;
  firstName: string;
  country: string;
  phoneNumber: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  phoneNumber: string;
}
