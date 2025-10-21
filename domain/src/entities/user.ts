import type { BaseEntity } from "@/utils/types/";

export interface User extends BaseEntity {
  username: string;
  passwordHash: string;
  email: string;
  avatarUrl: string;
  bio: string;
}
