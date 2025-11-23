import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ViewToggle } from './ViewToggle';

const meta = {
  component: ViewToggle,
} satisfies Meta<typeof ViewToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    view: "grid",
    onViewChange: () => {}
  }
};