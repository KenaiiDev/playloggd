import { faker } from "@faker-js/faker";
import type { User } from "../user";

export const createMockUser = (overrides: Partial<User> = {}): User => {
  return {
    id: faker.string.uuid(),
    username: faker.internet.username(),
    email: faker.internet.email(),
    passwordHash: `$2b$10$${faker.string.alphanumeric({ length: 53 })}`,
    avatarUrl: faker.image.avatar(),
    bio: faker.lorem.sentence(),
    createdAt: faker.date.past({ years: 1 }),
    updatedAt: faker.date.recent({ days: 7 }),
    ...overrides,
  };
};
