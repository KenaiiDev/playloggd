import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Toaster } from "./sonner";
import { toast } from "sonner";
import { Button } from "./button";

const meta: Meta<typeof Toaster> = {
  title: "Components/UI/Toaster",
  component: Toaster,
  tags: ["autodocs"],

  decorators: [
    (Story) => (
      <div className="flex flex-col gap-4">
        <Story />
        <Toaster />
      </div>
    ),
  ],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Button onClick={() => toast("Default notification")}>Show Toast</Button>
  ),
};

export const Success: Story = {
  render: () => (
    <Button onClick={() => toast.success("Success notification")}>
      Show Success Toast
    </Button>
  ),
};

export const Error: Story = {
  render: () => (
    <Button onClick={() => toast.error("Error notification")}>
      Show Error Toast
    </Button>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast("Notification with description", {
          description:
            "This is a more detailed description of the notification",
        })
      }
    >
      Show Toast with Description
    </Button>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast("Notification with action", {
          action: {
            label: "Undo",
            onClick: () => console.log("Undo clicked"),
          },
        })
      }
    >
      Show Toast with Action
    </Button>
  ),
};

export const Promise: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast.promise(
          () =>
            new window.Promise<void>((resolve: () => void) => {
              setTimeout(resolve, 2000);
            }),
          {
            loading: "Loading...",
            success: "Successfully completed",
            error: "Something went wrong",
          }
        )
      }
    >
      Show Promise Toast
    </Button>
  ),
};

export const CustomDuration: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast("Custom duration notification", {
          duration: 5000,
        })
      }
    >
      Show 5s Duration Toast
    </Button>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast("Notification with icon", {
          icon: "🎮",
        })
      }
    >
      Show Toast with Icon
    </Button>
  ),
};
