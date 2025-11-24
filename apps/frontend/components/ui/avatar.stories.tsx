import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";

const meta: Meta<typeof Avatar> = {
  title: "Components/UI/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

export const WithFallback: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://invalid-url.com/image.png" alt="User" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

export const FallbackOnly: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  ),
};

export const CustomSize: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Avatar className="size-6" {...args}>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback className="text-xs">XS</AvatarFallback>
      </Avatar>
      <Avatar className="size-8" {...args}>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback className="text-sm">SM</AvatarFallback>
      </Avatar>
      <Avatar className="size-12" {...args}>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar className="size-16" {...args}>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback className="text-lg">LG</AvatarFallback>
      </Avatar>
      <Avatar className="size-24" {...args}>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback className="text-2xl">XL</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const WithColoredFallback: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Avatar {...args}>
        <AvatarFallback className="bg-primary text-primary-foreground">
          AB
        </AvatarFallback>
      </Avatar>
      <Avatar {...args}>
        <AvatarFallback className="bg-destructive text-destructive-foreground">
          CD
        </AvatarFallback>
      </Avatar>
      <Avatar {...args}>
        <AvatarFallback className="bg-green-500 text-white">EF</AvatarFallback>
      </Avatar>
      <Avatar {...args}>
        <AvatarFallback className="bg-blue-500 text-white">GH</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const UserList: Story = {
  render: (args) => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Avatar {...args}>
          <AvatarImage src="https://github.com/shadcn.png" alt="John Doe" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">John Doe</p>
          <p className="text-xs text-muted-foreground">john@example.com</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Avatar {...args}>
          <AvatarImage
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jane"
            alt="Jane Smith"
          />
          <AvatarFallback>JS</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">Jane Smith</p>
          <p className="text-xs text-muted-foreground">jane@example.com</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Avatar {...args}>
          <AvatarFallback className="bg-primary text-primary-foreground">
            AB
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">Alice Brown</p>
          <p className="text-xs text-muted-foreground">alice@example.com</p>
        </div>
      </div>
    </div>
  ),
};

export const GameProfile: Story = {
  render: (args) => (
    <div className="flex items-center gap-4 p-4 border rounded-lg">
      <Avatar className="size-16" {...args}>
        <AvatarImage
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Gamer"
          alt="Gamer Profile"
        />
        <AvatarFallback className="bg-primary text-primary-foreground text-xl">
          GP
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h3 className="font-semibold text-lg">ProGamer123</h3>
        <p className="text-sm text-muted-foreground">Level 42 • 156 Games</p>
        <div className="flex gap-2 mt-2">
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
            Top Reviewer
          </span>
          <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">
            Achievement Hunter
          </span>
        </div>
      </div>
    </div>
  ),
};

export const AvatarGroup: Story = {
  render: (args) => (
    <div className="flex items-center">
      <Avatar className="border-2 border-background" {...args}>
        <AvatarImage
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=User1"
          alt="User 1"
        />
        <AvatarFallback>U1</AvatarFallback>
      </Avatar>
      <Avatar className="-ml-2 border-2 border-background" {...args}>
        <AvatarImage
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=User2"
          alt="User 2"
        />
        <AvatarFallback>U2</AvatarFallback>
      </Avatar>
      <Avatar className="-ml-2 border-2 border-background" {...args}>
        <AvatarImage
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=User3"
          alt="User 3"
        />
        <AvatarFallback>U3</AvatarFallback>
      </Avatar>
      <Avatar className="-ml-2 border-2 border-background" {...args}>
        <AvatarFallback className="bg-muted text-muted-foreground">
          +5
        </AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const WithStatus: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Avatar {...args}>
          <AvatarImage
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Online"
            alt="Online User"
          />
          <AvatarFallback>ON</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 block size-3 rounded-full bg-green-500 ring-2 ring-background" />
      </div>
      <div className="relative">
        <Avatar {...args}>
          <AvatarImage
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Away"
            alt="Away User"
          />
          <AvatarFallback>AW</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 block size-3 rounded-full bg-yellow-500 ring-2 ring-background" />
      </div>
      <div className="relative">
        <Avatar {...args}>
          <AvatarImage
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Offline"
            alt="Offline User"
          />
          <AvatarFallback>OF</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 block size-3 rounded-full bg-gray-400 ring-2 ring-background" />
      </div>
    </div>
  ),
};

export const ReviewerAvatar: Story = {
  render: (args) => (
    <div className="flex items-start gap-3 p-4 border rounded-lg max-w-md">
      <Avatar className="size-10" {...args}>
        <AvatarImage
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Reviewer"
          alt="Reviewer"
        />
        <AvatarFallback>RV</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm">GameReviewer2023</span>
          <span className="text-xs text-muted-foreground">2 days ago</span>
        </div>
        <div className="flex items-center gap-1 mb-2">
          <span className="text-yellow-500">★★★★★</span>
          <span className="text-sm font-medium">10/10</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Amazing game! The story is incredible and the gameplay mechanics are
          top-notch. Highly recommended!
        </p>
      </div>
    </div>
  ),
};
