import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { ExternalLinkIcon } from "lucide-react";

const meta: Meta<typeof Tooltip> = {
  title: "Components/UI/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This is a tooltip</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const WithDelay: Story = {
  render: () => (
    <Tooltip delayDuration={500}>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover with delay</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Tooltip appears after 500ms</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const WithCustomContent: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover for details</Button>
      </TooltipTrigger>
      <TooltipContent className="max-w-[200px]">
        <p>
          A tooltip can contain longer text that wraps across multiple lines
        </p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const OnIcon: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon">
          ℹ️
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Help information</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const WithHTMLContent: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Show stats</Button>
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex flex-col gap-1">
          <p className="font-bold">Game Stats</p>
          <p>⭐ Rating: 9.5/10</p>
          <p>🎮 Hours: 120+</p>
        </div>
      </TooltipContent>
    </Tooltip>
  ),
};

export const WithOpenIcon: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon">
          <ExternalLinkIcon className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Open in new window</p>
      </TooltipContent>
    </Tooltip>
  ),
};
