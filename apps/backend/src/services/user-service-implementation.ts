import { PrismaClient } from "@prisma/client";

import { User, UserService } from "@playloggd/domain";
import { PasswordHasher } from "@/adapters/password-hasher";

export class UserServiceImplementation implements UserService {
  private db: PrismaClient;
  private readonly passwordHasher: PasswordHasher;

  constructor(db: PrismaClient, passwordHasher: PasswordHasher) {
    this.db = db;
    this.passwordHasher = passwordHasher;
  }

  async getById(id: string): Promise<User | undefined> {
    const result = await this.db.user.findUnique({
      where: {
        id,
      },
    });

    if (!result) return;
    return result;
  }

  async getByEmail(email: string): Promise<User | undefined> {
    const result = await this.db.user.findUnique({
      where: {
        email,
      },
    });

    if (!result) return;
    return result;
  }

  async create(
    userData: Omit<
      User,
      "id" | "passwordHash" | "avatarUrl" | "createdAt" | "updatedAt" | "bio"
    > & {
      password: string;
      bio?: string;
    }
  ): Promise<User> {
    const { email, password, username, bio = "" } = userData;
    const hashedPassword = await this.passwordHasher.hash(password);
    const user = await this.db.user.create({
      data: {
        email,
        username,
        passwordHash: hashedPassword,
        avatarUrl: "",
        bio,
      },
    });

    return user;
  }

  async update({
    user,
    data,
  }: {
    user: string;
    data: Partial<
      Omit<User, "id" | "createdAt" | "updatedAt" | "passwordHash">
    >;
  }): Promise<User> {
    const newUser = await this.db.user.update({
      where: {
        id: user,
      },
      data,
    });

    return newUser;
  }

  async deleteUser(userId: string): Promise<boolean> {
    const deletedUser = await this.db.user.delete({
      where: {
        id: userId,
      },
    });

    return deletedUser ? true : false;
  }

  async updatePassword(
    userId: string,
    newPasswordHash: string
  ): Promise<boolean> {
    const newUser = await this.db.user.update({
      where: {
        id: userId,
      },
      data: {
        passwordHash: newPasswordHash,
      },
    });

    return newUser ? true : false;
  }
}
