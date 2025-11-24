import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Skeleton } from "./skeleton";
import { Card, CardContent, CardHeader } from "./card";

const meta: Meta<typeof Skeleton> = {
  title: "Components/UI/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  render: (args) => <Skeleton className="h-12 w-64" {...args} />,
};

export const Circle: Story = {
  render: (args) => <Skeleton className="size-12 rounded-full" {...args} />,
};

export const Square: Story = {
  render: (args) => <Skeleton className="size-12 rounded-md" {...args} />,
};

export const Text: Story = {
  render: (args) => (
    <div className="space-y-2">
      <Skeleton className="h-4 w-64" {...args} />
      <Skeleton className="h-4 w-48" {...args} />
      <Skeleton className="h-4 w-56" {...args} />
    </div>
  ),
};

export const Paragraph: Story = {
  render: (args) => (
    <div className="space-y-2 max-w-md">
      <Skeleton className="h-4 w-full" {...args} />
      <Skeleton className="h-4 w-full" {...args} />
      <Skeleton className="h-4 w-3/4" {...args} />
    </div>
  ),
};

export const UserProfile: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Skeleton className="size-12 rounded-full" {...args} />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" {...args} />
        <Skeleton className="h-3 w-24" {...args} />
      </div>
    </div>
  ),
};

export const GameCard: Story = {
  render: (args) => (
    <Card className="w-64 p-0">
      <CardHeader className="p-0">
        <Skeleton className="h-96 w-full rounded-t-lg" {...args} />
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <Skeleton className="h-6 w-32" {...args} />
          <Skeleton className="h-6 w-12 rounded-full" {...args} />
        </div>
        <Skeleton className="h-4 w-full" {...args} />
        <Skeleton className="h-4 w-3/4" {...args} />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" {...args} />
          <Skeleton className="h-6 w-20 rounded-full" {...args} />
          <Skeleton className="h-6 w-14 rounded-full" {...args} />
        </div>
      </CardContent>
    </Card>
  ),
};

export const GameCardGrid: Story = {
  render: (args) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="w-full p-0">
          <CardHeader className="p-0">
            <Skeleton className="aspect-3/4 w-full rounded-t-lg" {...args} />
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            <Skeleton className="h-5 w-3/4" {...args} />
            <Skeleton className="h-4 w-full" {...args} />
            <Skeleton className="h-4 w-2/3" {...args} />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" {...args} />
              <Skeleton className="h-5 w-20 rounded-full" {...args} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
};

export const ReviewCard: Story = {
  render: (args) => (
    <Card className="max-w-md">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Skeleton className="size-10 rounded-full" {...args} />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24" {...args} />
              <Skeleton className="h-3 w-16" {...args} />
            </div>
            <Skeleton className="h-4 w-20" {...args} />
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" {...args} />
              <Skeleton className="h-3 w-full" {...args} />
              <Skeleton className="h-3 w-2/3" {...args} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

export const UserList: Story = {
  render: (args) => (
    <div className="space-y-4 max-w-md">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="size-12 rounded-full" {...args} />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" {...args} />
            <Skeleton className="h-3 w-48" {...args} />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const FormSkeleton: Story = {
  render: (args) => (
    <div className="space-y-4 max-w-md">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" {...args} />
        <Skeleton className="h-10 w-full" {...args} />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" {...args} />
        <Skeleton className="h-10 w-full" {...args} />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" {...args} />
        <Skeleton className="h-24 w-full" {...args} />
      </div>
      <Skeleton className="h-10 w-32" {...args} />
    </div>
  ),
};

export const TableSkeleton: Story = {
  render: (args) => (
    <div className="space-y-2 max-w-2xl">
      <div className="flex gap-4 border-b pb-2">
        <Skeleton className="h-4 w-32" {...args} />
        <Skeleton className="h-4 w-48" {...args} />
        <Skeleton className="h-4 w-24" {...args} />
        <Skeleton className="h-4 w-20" {...args} />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-4 w-32" {...args} />
          <Skeleton className="h-4 w-48" {...args} />
          <Skeleton className="h-4 w-24" {...args} />
          <Skeleton className="h-4 w-20" {...args} />
        </div>
      ))}
    </div>
  ),
};

export const GameDetailsSkeleton: Story = {
  render: (args) => (
    <div className="max-w-4xl space-y-6">
      <div className="flex gap-6">
        <Skeleton className="h-96 w-64 rounded-lg" {...args} />
        <div className="flex-1 space-y-4">
          <Skeleton className="h-8 w-3/4" {...args} />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" {...args} />
            <Skeleton className="h-6 w-24 rounded-full" {...args} />
            <Skeleton className="h-6 w-16 rounded-full" {...args} />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" {...args} />
            <Skeleton className="h-4 w-full" {...args} />
            <Skeleton className="h-4 w-full" {...args} />
            <Skeleton className="h-4 w-2/3" {...args} />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-10 w-32" {...args} />
            <Skeleton className="h-10 w-32" {...args} />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-32" {...args} />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-4 w-full" {...args} />
          <Skeleton className="h-4 w-full" {...args} />
          <Skeleton className="h-4 w-full" {...args} />
          <Skeleton className="h-4 w-full" {...args} />
        </div>
      </div>
    </div>
  ),
};

export const StatsSkeleton: Story = {
  render: (args) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6 space-y-2">
            <Skeleton className="h-4 w-24" {...args} />
            <Skeleton className="h-8 w-16" {...args} />
            <Skeleton className="h-3 w-32" {...args} />
          </CardContent>
        </Card>
      ))}
    </div>
  ),
};
