import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EditProfileDialog } from "./EditProfileDialog";

const meta: Meta<typeof EditProfileDialog> = {
  title: "Components/Profile/EditProfileDialog",
  component: EditProfileDialog,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
  },
  argTypes: {
    open: { control: "boolean" },
    onOpenChange: { action: "openChange" },
  },
};

export default meta;
type Story = StoryObj<typeof EditProfileDialog>;

export const Closed: Story = {
  args: {
    open: false,
    onOpenChange: (open: boolean) => {
      console.log("Dialog open state changed:", open);
    },
  },
};

export const Open: Story = {
  args: {
    open: true,
    onOpenChange: (open: boolean) => {
      console.log("Dialog open state changed:", open);
    },
  },
};
