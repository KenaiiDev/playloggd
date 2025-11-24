import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import GameActionButtons from "./GameActionButtons";
import { GameStatus, GameStatusEnum } from "@playloggd/domain";

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
    currentStatus: GameStatusEnum.BACKLOG,
    onStatusChange: (value: GameStatus) => {
      alert(`Status change with value: ${value}`);
    },
  },
};
