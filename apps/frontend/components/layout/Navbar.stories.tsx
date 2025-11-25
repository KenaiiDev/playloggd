import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Navbar } from "./Navbar";

const meta: Meta<typeof Navbar> = {
  title: "Components/Layout/Navbar",
  component: Navbar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Default: Story = {};

export const Authenticated: Story = {
  parameters: {
    // Mock the auth store to show authenticated state
    // Note: In a real scenario, you'd need to mock the Zustand store
  },
};

export const Guest: Story = {
  parameters: {
    // Mock the auth store to show guest/unauthenticated state
  },
};
