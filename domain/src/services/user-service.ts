import { User } from "@/entities/user";

export interface UserService {
  getById: (id: string) => Promise<User | undefined>;
  getByEmail: (email: string) => Promise<User | undefined>;
}
