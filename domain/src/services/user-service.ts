import { User } from "@/entities/user";

export interface UserService {
  getById: (id: string) => Promise<User | undefined>;
  getByEmail: (email: string) => Promise<User | undefined>;
  create: (
    userData: Omit<
      User,
      "id" | "passwordHash" | "avatarUrl" | "createdAt" | "updatedAt" | "bio"
    > & {
      password: string;
      bio?: string;
    }
  ) => Promise<User>;
}
