import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PaginationControls } from './PaginationControls';

const meta = {
  component: PaginationControls,
} satisfies Meta<typeof PaginationControls>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentPage: 0,
    totalPages: 0,
    onPageChange: () => {}
  }
};