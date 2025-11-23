import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GameCardsContainer } from "./GameCardsContainer";
import { GAME_STATUS, Game } from "@/types";

const meta: Meta<typeof GameCardsContainer> = {
  title: "Components/Games/GameCardsContainer",
  component: GameCardsContainer,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    games: { control: "object" },
    onStatusChange: { action: "status changed" },
    getUserGameStatus: { action: "get user game status" },
  },
};

export default meta;
type Story = StoryObj<typeof GameCardsContainer>;

// Mock games data
const mockGames: Game[] = [
  {
    externalId: "1",
    title: "The Legend of Zelda: Breath of the Wild",
    description:
      "Step into a world of discovery, exploration, and adventure in The Legend of Zelda: Breath of the Wild.",
    releaseDate: new Date("2017-03-03"),
    developer: "Nintendo",
    publisher: "Nintendo",
    coverUrl:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co3p2d.jpg",
    genres: ["Action", "Adventure", "RPG"],
    platforms: ["Nintendo Switch", "Wii U"],
    rating: 97,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    externalId: "2",
    title: "God of War",
    description:
      "His vengeance against the Gods of Olympus years behind him, Kratos now lives as a man in the realm of Norse Gods and monsters.",
    releaseDate: new Date("2018-04-20"),
    developer: "Santa Monica Studio",
    publisher: "Sony Interactive Entertainment",
    coverUrl:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7h.jpg",
    genres: ["Action", "Adventure"],
    platforms: ["PlayStation 4", "PC (Microsoft Windows)"],
    rating: 94,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    externalId: "3",
    title: "Red Dead Redemption 2",
    description:
      "America, 1899. The end of the Wild West era has begun. After a robbery goes badly wrong in the western town of Blackwater, Arthur Morgan and the Van der Linde gang are forced to flee.",
    releaseDate: new Date("2018-10-26"),
    developer: "Rockstar Games",
    publisher: "Rockstar Games",
    coverUrl:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co1q1f.jpg",
    genres: ["Action", "Adventure", "Shooter"],
    platforms: ["PlayStation 4", "Xbox One", "PC (Microsoft Windows)"],
    rating: 93,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    externalId: "4",
    title: "Hades",
    description:
      "Defy the god of the dead as you hack and slash out of the Underworld in this rogue-like dungeon crawler.",
    releaseDate: new Date("2020-09-17"),
    developer: "Supergiant Games",
    publisher: "Supergiant Games",
    coverUrl:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co2i8y.jpg",
    genres: ["Indie", "Rogue-like", "Action"],
    platforms: ["PC (Microsoft Windows)", "Nintendo Switch", "PlayStation 4"],
    rating: 93,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    externalId: "5",
    title: "Celeste",
    description:
      "Help Madeline survive her inner demons on her journey to the top of Celeste Mountain, in this super-tight platformer.",
    releaseDate: new Date("2018-01-25"),
    developer: "Maddy Makes Games",
    publisher: "Maddy Makes Games",
    coverUrl:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co1zbh.jpg",
    genres: ["Platformer", "Indie"],
    platforms: ["PC (Microsoft Windows)", "Nintendo Switch", "PlayStation 4"],
    rating: 88,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    externalId: "6",
    title: "Hollow Knight",
    description:
      "Forge your own path in Hollow Knight! An epic action adventure through a vast ruined kingdom of insects and heroes.",
    releaseDate: new Date("2017-02-24"),
    developer: "Team Cherry",
    publisher: "Team Cherry",
    coverUrl:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co1rgi.jpg",
    genres: ["Platformer", "Indie", "Metroidvania"],
    platforms: ["PC (Microsoft Windows)", "Nintendo Switch", "PlayStation 4"],
    rating: 87,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    externalId: "7",
    title: "Stardew Valley",
    description:
      "You've inherited your grandfather's old farm plot in Stardew Valley. Armed with hand-me-down tools and a few coins, you set out to begin your new life.",
    releaseDate: new Date("2016-02-26"),
    developer: "ConcernedApe",
    publisher: "ConcernedApe",
    coverUrl:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co49x5.jpg",
    genres: ["Simulation", "RPG", "Indie"],
    platforms: ["PC (Microsoft Windows)", "Nintendo Switch", "PlayStation 4"],
    rating: 89,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    externalId: "8",
    title: "Portal 2",
    description:
      "The sequel to 2007's Game of the Year, Portal 2 is a hilariously mind-bending adventure that challenges you to use portals in new, creative ways.",
    releaseDate: new Date("2011-04-19"),
    developer: "Valve",
    publisher: "Valve",
    coverUrl:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co1rs4.jpg",
    genres: ["Puzzle", "Platformer"],
    platforms: ["PC (Microsoft Windows)", "PlayStation 3", "Xbox 360"],
    rating: 95,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    externalId: "9",
    title: "Undertale",
    description:
      "A small child falls into the Underground, where monsters have long been banished by humans and are hunting every human that they find.",
    releaseDate: new Date("2015-09-15"),
    developer: "Toby Fox",
    publisher: "Toby Fox",
    coverUrl:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co49yf.jpg",
    genres: ["RPG", "Indie"],
    platforms: ["PC (Microsoft Windows)", "PlayStation 4", "Nintendo Switch"],
    rating: 92,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    externalId: "10",
    title: "The Witcher 3: Wild Hunt",
    description:
      "As war rages on throughout the Northern Realms, you take on the greatest contract of your life — tracking down the Child of Prophecy.",
    releaseDate: new Date("2015-05-19"),
    developer: "CD Projekt Red",
    publisher: "CD Projekt",
    coverUrl:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg",
    genres: ["RPG", "Action", "Adventure"],
    platforms: ["PC (Microsoft Windows)", "PlayStation 4", "Xbox One"],
    rating: 93,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    externalId: "11",
    title: "Minecraft",
    description:
      "Minecraft is a game about placing blocks and going on adventures. Explore randomly generated worlds and build amazing things.",
    releaseDate: new Date("2011-11-18"),
    developer: "Mojang",
    publisher: "Mojang",
    coverUrl:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co49yt.jpg",
    genres: ["Sandbox", "Adventure", "Survival"],
    platforms: ["PC (Microsoft Windows)", "PlayStation 4", "Xbox One"],
    rating: 93,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    externalId: "12",
    title: "Dark Souls III",
    description:
      "Dark Souls continues to push the boundaries with the latest, ambitious chapter in the critically-acclaimed and genre-defining series.",
    releaseDate: new Date("2016-04-12"),
    developer: "FromSoftware",
    publisher: "Bandai Namco Entertainment",
    coverUrl:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co1vbn.jpg",
    genres: ["RPG", "Action"],
    platforms: ["PC (Microsoft Windows)", "PlayStation 4", "Xbox One"],
    rating: 89,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    externalId: "13",
    title: "Cuphead",
    description:
      "A classic run and gun action game heavily focused on boss battles. Inspired by cartoons of the 1930s.",
    releaseDate: new Date("2017-09-29"),
    developer: "Studio MDHR",
    publisher: "Studio MDHR",
    coverUrl:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co1irx.jpg",
    genres: ["Platformer", "Indie", "Shooter"],
    platforms: ["PC (Microsoft Windows)", "Xbox One", "Nintendo Switch"],
    rating: 86,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    externalId: "14",
    title: "Sekiro: Shadows Die Twice",
    description:
      "Carve your own clever path to vengeance in an all-new adventure from developer FromSoftware.",
    releaseDate: new Date("2019-03-22"),
    developer: "FromSoftware",
    publisher: "Activision",
    coverUrl:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co1irw.jpg",
    genres: ["Action", "Adventure"],
    platforms: ["PC (Microsoft Windows)", "PlayStation 4", "Xbox One"],
    rating: 90,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    externalId: "15",
    title: "Elden Ring",
    description:
      "A new fantasy action RPG. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring.",
    releaseDate: new Date("2022-02-25"),
    developer: "FromSoftware",
    publisher: "Bandai Namco Entertainment",
    coverUrl:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg",
    genres: ["RPG", "Action", "Adventure"],
    platforms: ["PC (Microsoft Windows)", "PlayStation 4", "PlayStation 5"],
    rating: 96,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Create more games for pagination testing
const largeGameList: Game[] = Array.from({ length: 50 }, (_, index) => ({
  ...mockGames[index % mockGames.length],
  externalId: `${index + 1}`,
  title: `${mockGames[index % mockGames.length].title} ${index + 1}`,
}));

export const Default: Story = {
  args: {
    games: mockGames,
    onStatusChange: (gameId: string, status: string) => {
      console.log(`Game ${gameId} status changed to ${status}`);
    },
    getUserGameStatus: (gameId: string) => {
      // Simulate some games having status
      const statuses: Record<
        string,
        (typeof GAME_STATUS)[keyof typeof GAME_STATUS]
      > = {
        "1": GAME_STATUS.PLAYING,
        "2": GAME_STATUS.COMPLETED,
        "3": GAME_STATUS.WISHLIST,
      };
      return statuses[gameId];
    },
  },
};

export const WithManyGames: Story = {
  args: {
    games: largeGameList,
    onStatusChange: (gameId: string, status: string) => {
      console.log(`Game ${gameId} status changed to ${status}`);
    },
    getUserGameStatus: (gameId: string) => {
      // Simulate some games having status
      const num = parseInt(gameId);
      if (num % 3 === 0) return GAME_STATUS.COMPLETED;
      if (num % 5 === 0) return GAME_STATUS.PLAYING;
      if (num % 7 === 0) return GAME_STATUS.WISHLIST;
    },
  },
};

export const Empty: Story = {
  args: {
    games: [],
    onStatusChange: (gameId: string, status: string) => {
      console.log(`Game ${gameId} status changed to ${status}`);
    },
  },
};

export const FewGames: Story = {
  args: {
    games: mockGames.slice(0, 3),
    onStatusChange: (gameId: string, status: string) => {
      console.log(`Game ${gameId} status changed to ${status}`);
    },
  },
};
