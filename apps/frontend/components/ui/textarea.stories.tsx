import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Textarea } from "./textarea";

const meta: Meta<typeof Textarea> = {
  title: "Components/UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    value: "",
    placeholder: "Enter large text",
  },
};
export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: "",
  },
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: "Enter text",
  },
};

export const WithDefaultValue: Story = {
  args: {
    value: "Default text",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    "aria-readonly": "true",
    value: "Read only text",
  },
};
