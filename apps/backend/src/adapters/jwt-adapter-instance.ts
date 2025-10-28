import { JwtAdapter } from "./jwt-adapter";

if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_ACCESS_EXPIRES) {
  throw new Error(
    "Environment variables JWT_ACCESS_SECRET and JWT_ACCESS_EXPIRES must be defined"
  );
}

if (!process.env.JWT_REFRESH_SECRET || !process.env.JWT_REFRESH_EXPIRES) {
  throw new Error(
    "Environment variables JWT_REFRESH_SECRET and JWT_REFRESH_EXPIRES must be defined"
  );
}

export const accessTokenManager = new JwtAdapter(
  process.env.JWT_ACCESS_SECRET!,
  process.env.JWT_ACCESS_EXPIRES!
);
export const refreshTokenManager = new JwtAdapter(
  process.env.JWT_REFRESH_SECRET!,
  process.env.JWT_REFRESH_EXPIRES!
);
