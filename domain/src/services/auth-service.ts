export interface AuthService {
  verifyPassword: (
    plainPassword: string,
    passwordHash: string
  ) => Promise<boolean>;
  generateToken: (userId: string) => Promise<{
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
  }>;
  verifyToken: (token: string) => Promise<{ userId: string } | null>;
  refreshToken: (refreshToken: string) => Promise<{
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
  }>;
}
