export interface AuthService {
  verifyPassword: (
    plainPassword: string,
    passwordHash: string
  ) => Promise<boolean>;
  generateToken: (userId: string) => Promise<string>;
  verifyToken: (token: string) => Promise<{ userId: string } | null>;
}
