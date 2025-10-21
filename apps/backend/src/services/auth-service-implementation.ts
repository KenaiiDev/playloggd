import { AuthService } from "@playloggd/domain";
import { PasswordHasher } from "@/adapters/password-hasher";
import { TokenManager } from "@/adapters/token-manager";
import { UserServiceImplementation } from "./user-service-implementation";

export class AuthServiceImplementation implements AuthService {
  private readonly PasswordHasher: PasswordHasher;
  private readonly accessTokenManager: TokenManager;
  private readonly refreshTokenManager: TokenManager;
  private readonly userService: UserServiceImplementation;

  constructor(
    passwordHasher: PasswordHasher,
    accessTokenManager: TokenManager,
    refreshTokenManager: TokenManager,
    userService: UserServiceImplementation
  ) {
    this.PasswordHasher = passwordHasher;
    this.accessTokenManager = accessTokenManager;
    this.refreshTokenManager = refreshTokenManager;
    this.userService = userService;
  }

  async verifyPassword(
    password: string,
    passwordHash: string
  ): Promise<boolean> {
    return await this.PasswordHasher.compare(password, passwordHash);
  }

  async generateToken(userId: string): Promise<{
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
  }> {
    const accessToken = this.accessTokenManager.sign({ userId });
    const refreshToken = this.refreshTokenManager.sign({ userId });
    return {
      accessToken,
      refreshToken,
      tokenType: "Bearer",
      expiresIn: parseInt(String(this.accessTokenManager.getExpiration())),
    };
  }

  async verifyToken(token: string): Promise<{ userId: string } | null> {
    const payload = this.accessTokenManager.verify(token);
    if (payload && typeof payload === "object" && "userId" in payload) {
      return { userId: payload.userId as string };
    }
    return null;
  }

  async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
  }> {
    const payload = this.refreshTokenManager.verify(refreshToken);
    if (!payload || typeof payload !== "object" || !("userId" in payload)) {
      throw new Error("Invalid refresh token");
    }
    const userId = payload.userId as string;
    return this.generateToken(userId);
  }

  async changePassword({
    userId,
    currentPassword,
    newPassword,
  }: {
    userId: string;
    currentPassword: string;
    newPassword: string;
  }): Promise<boolean> {
    const user = await this.userService.getById(userId);
    if (!user) throw new Error("User not found");

    const isPasswordValid = await this.PasswordHasher.compare(
      currentPassword,
      user.passwordHash
    );
    if (!isPasswordValid) throw new Error("Current password is incorrect");

    const passwordError = this.validatePassword(newPassword);
    if (passwordError) throw new Error(passwordError.message);

    const newPasswordHash = await this.PasswordHasher.hash(newPassword);
    await this.userService.updatePassword(userId, newPasswordHash);

    return true;
  }

  validatePassword(password: string): Error | null {
    if (password.length < 8) {
      return new Error("Password must be at least 8 characters long");
    }

    if (!/[A-Z]/.test(password)) {
      return new Error("Password must contain at least one uppercase letter");
    }

    if (!/[a-z]/.test(password)) {
      return new Error("Password must contain at least one lowercase letter");
    }

    if (!/[0-9]/.test(password)) {
      return new Error("Password must contain at least one number");
    }

    return null;
  }
}
