import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CollectionGameCard } from "./CollectionGameCard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
  },
});

const meta: Meta<typeof CollectionGameCard> = {
  title: "Components/Games/CollectionGameCard",
  component: CollectionGameCard,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
  },
  argTypes: {
    gameId: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof CollectionGameCard>;

export const Default: Story = {
  args: {
    gameId: "1",
  },
};

export const Loading: Story = {
  args: {
    gameId: "999999", // Non-existent game to show loading state
  },
  parameters: {
    // In a real scenario, you'd mock the API to return loading state
  },
};

export const WithPopularGame: Story = {
  args: {
    gameId: "1020", // The Legend of Zelda: Breath of the Wild
  },
};
