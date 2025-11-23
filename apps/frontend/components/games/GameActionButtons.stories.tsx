import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import GameActionButtons from "./GameActionButtons";
import { GAME_STATUS, UserList } from "@/types";

const meta: Meta<typeof GameActionButtons> = {
  title: "Components/Games/GameActionButtons",
  component: GameActionButtons,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof GameActionButtons>;

export default meta;
type Story = StoryObj<typeof GameActionButtons>;

export const Default: Story = {
  args: {
    lists: [
      {
        id: 0,
        checked: false,
        name: "Likes",
        createdAt: new Date(),
      },
    ],
    currentStatus: GAME_STATUS.BACKLOG,
    onAddToList: (id: UserList["id"]) => {
      alert(`Add to list with id: ${id}`);
    },
    onStatusChange: (value: any) => {
      alert(`Status change with value: ${value}`);
    },
    onCreateNewList: (name: string) => {
      alert(`New list created: ${name}`);
    },
  },
};
