import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChangePasswordDialog } from "./ChangePasswordDialog";

const meta: Meta<typeof ChangePasswordDialog> = {
  title: "Components/Profile/ChangePasswordDialog",
  component: ChangePasswordDialog,
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
type Story = StoryObj<typeof ChangePasswordDialog>;

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
