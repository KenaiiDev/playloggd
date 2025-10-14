import { faker } from "@faker-js/faker";
import type { Game } from "../game";

export const createMockGame = (overrides: Partial<Game> = {}): Game => {
  return {
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),

    externalId: faker.string.uuid(),
    title: faker.word.words({ count: { min: 1, max: 4 } }),
    description: faker.lorem.paragraph(),
    releaseDate: faker.date.past({ years: 10 }),
    developer: faker.company.name(),
    publisher: faker.company.name(),
    coverUrl: faker.image.urlLoremFlickr({ category: "game" }),
    genres: faker.helpers.arrayElements(
      ["Action", "Adventure", "RPG", "Simulation", "Strategy", "Shooter"],
      { min: 1, max: 3 }
    ),
    platforms: faker.helpers.arrayElement([
      "PC",
      "PlayStation 5",
      "Xbox Series X",
      "Nintendo Switch",
      "Mobile",
    ]),
    rating: faker.number.float({ min: 0, max: 10 }),
    ...overrides,
  };
};
