import { faker } from "@faker-js/faker";
import type { GameReview } from "../game-review";

export const createMockGameReview = (
  overrides: Partial<GameReview> = {}
): GameReview => {
  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    gameExternalId: faker.string.uuid(),
    rating: faker.number.int({ min: 1, max: 5 }),
    content: faker.lorem.paragraph(),
    hoursPlayed: faker.number.int({ min: 1, max: 1000 }),
    playedAt: faker.date.past(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...overrides,
  };
};
