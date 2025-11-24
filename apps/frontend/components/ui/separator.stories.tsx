import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Separator } from "./separator";

const meta: Meta<typeof Separator> = {
  title: "Components/UI/Separator",
  component: Separator,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  render: (args) => (
    <div className="w-64">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
        <p className="text-sm text-muted-foreground">
          An open-source UI component library.
        </p>
      </div>
      <Separator className="my-4" {...args} />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  ),
};

export const Vertical: Story = {
  render: (args) => (
    <div className="flex h-20 items-center space-x-4">
      <div>Item 1</div>
      <Separator orientation="vertical" {...args} />
      <div>Item 2</div>
      <Separator orientation="vertical" {...args} />
      <div>Item 3</div>
    </div>
  ),
};

export const InList: Story = {
  render: (args) => (
    <div className="w-64 space-y-0">
      <div className="p-4">
        <p className="text-sm font-medium">Item 1</p>
      </div>
      <Separator {...args} />
      <div className="p-4">
        <p className="text-sm font-medium">Item 2</p>
      </div>
      <Separator {...args} />
      <div className="p-4">
        <p className="text-sm font-medium">Item 3</p>
      </div>
      <Separator {...args} />
      <div className="p-4">
        <p className="text-sm font-medium">Item 4</p>
      </div>
    </div>
  ),
};

export const GameCardSection: Story = {
  render: (args) => (
    <div className="w-80 border rounded-lg p-4">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">The Legend of Zelda</h3>
        <p className="text-sm text-muted-foreground">Action, Adventure</p>
      </div>
      <Separator className="my-4" {...args} />
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Rating</span>
          <span className="font-medium">9.5/10</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Release Date</span>
          <span className="font-medium">2017</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Platform</span>
          <span className="font-medium">Nintendo Switch</span>
        </div>
      </div>
    </div>
  ),
};

export const UserProfile: Story = {
  render: (args) => (
    <div className="w-80 border rounded-lg p-6">
      <div className="flex items-center gap-4">
        <div className="size-12 rounded-full bg-primary/10" />
        <div>
          <h3 className="font-semibold">ProGamer123</h3>
          <p className="text-sm text-muted-foreground">Level 42</p>
        </div>
      </div>
      <Separator className="my-4" {...args} />
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Games Played</span>
          <span className="font-medium">156</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Completed</span>
          <span className="font-medium">89</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Achievements</span>
          <span className="font-medium">542</span>
        </div>
      </div>
    </div>
  ),
};

export const Navigation: Story = {
  render: (args) => (
    <div className="flex items-center space-x-4 text-sm">
      <a href="#" className="hover:underline">
        Home
      </a>
      <Separator orientation="vertical" className="h-4" {...args} />
      <a href="#" className="hover:underline">
        Games
      </a>
      <Separator orientation="vertical" className="h-4" {...args} />
      <a href="#" className="hover:underline">
        Reviews
      </a>
      <Separator orientation="vertical" className="h-4" {...args} />
      <a href="#" className="hover:underline">
        Profile
      </a>
    </div>
  ),
};

export const SectionDivider: Story = {
  render: (args) => (
    <div className="max-w-2xl space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Currently Playing</h2>
        <p className="text-muted-foreground">
          Games you&apos;re actively playing right now
        </p>
      </div>
      <Separator {...args} />
      <div>
        <h2 className="text-2xl font-bold mb-2">Completed Games</h2>
        <p className="text-muted-foreground">
          Games you&apos;ve finished and conquered
        </p>
      </div>
      <Separator {...args} />
      <div>
        <h2 className="text-2xl font-bold mb-2">Wishlist</h2>
        <p className="text-muted-foreground">Games you want to play next</p>
      </div>
    </div>
  ),
};

export const FormSections: Story = {
  render: (args) => (
    <div className="max-w-md space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Game Information</h3>
        <div className="space-y-2">
          <div>
            <label className="text-sm">Title</label>
            <div className="h-10 border rounded-md" />
          </div>
          <div>
            <label className="text-sm">Genre</label>
            <div className="h-10 border rounded-md" />
          </div>
        </div>
      </div>
      <Separator {...args} />
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Your Review</h3>
        <div className="space-y-2">
          <div>
            <label className="text-sm">Rating</label>
            <div className="h-10 border rounded-md" />
          </div>
          <div>
            <label className="text-sm">Comments</label>
            <div className="h-24 border rounded-md" />
          </div>
        </div>
      </div>
    </div>
  ),
};

export const StatsCard: Story = {
  render: (args) => (
    <div className="w-64 border rounded-lg p-4">
      <h3 className="font-semibold mb-3">Gaming Stats</h3>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm">Completion Rate</span>
            <span className="text-sm font-medium">72%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full w-[72%] bg-primary" />
          </div>
        </div>
        <Separator {...args} />
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm">Average Rating</span>
            <span className="text-sm font-medium">8.5/10</span>
          </div>
        </div>
        <Separator {...args} />
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm">Hours Played</span>
            <span className="text-sm font-medium">1,247h</span>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const FilterPanel: Story = {
  render: (args) => (
    <div className="w-64 border rounded-lg p-4">
      <h3 className="font-semibold mb-3">Filters</h3>
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-2">Genre</p>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div>Action</div>
            <div>Adventure</div>
            <div>RPG</div>
          </div>
        </div>
        <Separator {...args} />
        <div>
          <p className="text-sm font-medium mb-2">Platform</p>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div>PC</div>
            <div>PlayStation</div>
            <div>Xbox</div>
          </div>
        </div>
        <Separator {...args} />
        <div>
          <p className="text-sm font-medium mb-2">Status</p>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div>Playing</div>
            <div>Completed</div>
            <div>Wishlist</div>
          </div>
        </div>
      </div>
    </div>
  ),
};
