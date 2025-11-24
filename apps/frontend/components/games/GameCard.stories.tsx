import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GameCard } from "./GameCard";
import { GameStatusEnum as GAME_STATUS, GameStatus } from "@playloggd/domain";

const meta: Meta<typeof GameCard> = {
  title: "Components/Games/GameCard",
  component: GameCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    title: { control: "text" },
    genre: { control: "text" },
    rating: { control: "number" },
    imageUrl: { control: "text" },
    description: { control: "text" },
    recommended: { control: "boolean" },
    genres: { control: "object" },
    currentStatus: {
      control: "select",
      options: Object.values(GAME_STATUS),
    },
  },
};

export default meta;
type Story = StoryObj<typeof GameCard>;

export const Recommended: Story = {
  args: {
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
    currentStatus: GAME_STATUS.BACKLOG,
    onStatusChange: (value: GameStatus) => {
      alert(`Status change with value: ${value}`);
    },
  },
};

export const NotRecommended: Story = {
  args: {
    ...Recommended.args,
    title: "Farming Simulator 2020",
    rating: 4.8,
    description:
      "An attempt at realism that falls short due to repetitive gameplay and lack of innovation.",
    recommended: false,
  },
};
