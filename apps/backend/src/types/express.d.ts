import { JwtPayload } from "@/utils/types/jwt-payload";

declare global {
  namespace Express {
    export interface Request {
      user?: { id: JwtPayload["userId"] };
    }
  }
}
