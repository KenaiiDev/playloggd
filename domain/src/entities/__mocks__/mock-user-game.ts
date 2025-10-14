import { faker } from "@faker-js/faker";
import { type UserGame, GameStatusEnum } from "../user-game";
import { createMockGame } from "./mock-game";
import { createMockUser } from "./mock-user";

export const createMockUserGame = (override?: Partial<UserGame>): UserGame => {
  const mockUser = createMockUser();
  const mockGame = createMockGame();

  return {
    id: faker.string.uuid(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    userId: mockUser.id,
    gameExternalId: mockGame.externalId,
    status: faker.helpers.arrayElement(Object.values(GameStatusEnum)),
    ...override,
  };
};
