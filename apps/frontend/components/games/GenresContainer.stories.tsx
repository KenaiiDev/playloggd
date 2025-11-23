import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import GenresContainer from './GenresContainer';

const meta = {
  component: GenresContainer,
} satisfies Meta<typeof GenresContainer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    genres: []
  }
};