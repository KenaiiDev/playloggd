import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GameCard } from "./GameCard";

const meta: Meta<typeof GameCard> = {
  title: "Components/Games/GameCard",
  component: GameCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
  },
  argTypes: {
    gameId: { control: "text" },
    title: { control: "text" },
    genre: { control: "text" },
    rating: { control: "number" },
    imageUrl: { control: "text" },
    description: { control: "text" },
    recommended: { control: "boolean" },
    genres: { control: "object" },
    showActions: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof GameCard>;

export const Recommended: Story = {
  args: {
    gameId: "1",
    title: "Stardew Valley",
    genre: "Simulation",
    rating: 9.1,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/f/fd/Logo_of_Stardew_Valley.png",
    description:
      "Build your dream farm, form relationships, and uncover mysteries in this beloved indie game.",
    recommended: true,
    genres: [
      "Farm life sim",
      "Indie",
      "Adventure",
      "Farm",
      "Cozy",
      "Adventure",
      "Mining",
    ],
    showActions: false,
  },
};

export const NotRecommended: Story = {
  args: {
    gameId: "2",
    title: "Farming Simulator 2020",
    genre: "Simulation",
    rating: 4.8,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/f/fd/Logo_of_Stardew_Valley.png",
    description:
      "An attempt at realism that falls short due to repetitive gameplay and lack of innovation.",
    recommended: false,
    genres: [
      "Farm life sim",
      "Indie",
      "Adventure",
      "Farm",
      "Cozy",
      "Adventure",
      "Mining",
    ],
    showActions: false,
  },
};

export const WithActions: Story = {
  args: {
    gameId: "3",
    title: "The Legend of Zelda: Breath of the Wild",
    genre: "Action-Adventure",
    rating: 9.7,
    imageUrl:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co3p2d.jpg",
    description:
      "Step into a world of discovery, exploration, and adventure in The Legend of Zelda: Breath of the Wild.",
    recommended: true,
    genres: ["Action", "Adventure", "RPG"],
    showActions: true,
  },
};
