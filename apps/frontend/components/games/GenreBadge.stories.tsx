import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { GenreBadge } from './GenreBadge';

const meta = {
  component: GenreBadge,
} satisfies Meta<typeof GenreBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    genre: "genre"
  }
};