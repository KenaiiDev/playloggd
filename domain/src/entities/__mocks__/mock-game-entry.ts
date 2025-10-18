import { faker } from "@faker-js/faker";
import { type GameEntry, GameStatusEnum } from "../game-entry";
import { createMockGame } from "./mock-game";
import { createMockUser } from "./mock-user";

export const createMockGameEntry = (
  override?: Partial<GameEntry>
): GameEntry => {
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
