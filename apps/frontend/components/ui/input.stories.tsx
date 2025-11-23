import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "./input";

const meta: Meta<typeof Input> = {
  title: "Components/UI/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  render: () => <Input placeholder="Enter your name" />,
};

export const Password: Story = {
  render: () => <Input type="password" placeholder="Enter your password" />,
};

export const Disabled: Story = {
  render: () => <Input disabled placeholder="Disabled input" />,
};

export const Invalid: Story = {
  render: () => (
    <Input aria-invalid="true" placeholder="This input has an error" />
  ),
};

export const WithValue: Story = {
  render: () => <Input defaultValue="Kenaii" />,
};

export const FileUpload: Story = {
  render: () => <Input type="file" />,
};
