import jwt, { SignOptions } from "jsonwebtoken";
import { TokenManager } from "./token-manager";

export class JwtAdapter implements TokenManager {
  private readonly secret: string;
  private readonly expiresIn: number | string;

  constructor(secret: string, expiresIn: number | string) {
    if (typeof expiresIn !== "string" && typeof expiresIn !== "number") {
      throw new Error("expiresIn must be a string or number");
    }
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  sign(payload: object): string {
    const options: SignOptions = {};

    if (typeof this.expiresIn === "string") {
      options.expiresIn = this.expiresIn as SignOptions["expiresIn"];
    } else if (typeof this.expiresIn === "number") {
      options.expiresIn = this.expiresIn;
    }

    return jwt.sign(payload, this.secret, options);
  }

  verify(token: string): object | null {
    try {
      return jwt.verify(token, this.secret) as object;
    } catch {
      return null;
    }
  }

  getExpiration(): number | string {
    return this.expiresIn;
  }
}
