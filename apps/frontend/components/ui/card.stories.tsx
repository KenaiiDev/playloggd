import { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "./card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const meta: Meta<typeof Card> = {
  title: "Components/UI/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Default Card</CardTitle>
        <CardDescription>A standard card layout</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the content of the card.</p>
      </CardContent>
    </Card>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card with Action</CardTitle>
        <CardDescription>Includes a button in the header</CardDescription>
        <CardAction>
          <Button size="sm">Action</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>This card has an action button in the top right.</p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card with Footer</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This card includes a footer with actions.</p>
      </CardContent>
      <CardFooter>
        <Button variant="secondary">Cancel</Button>
        <Button className="ml-auto">Confirm</Button>
      </CardFooter>
    </Card>
  ),
};

export const Compact: Story = {
  render: () => (
    <Card className="text-sm">
      <CardHeader>
        <CardTitle>Compact Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This card uses smaller font sizes.</p>
      </CardContent>
    </Card>
  ),
};

export const OnlyContent: Story = {
  render: () => (
    <Card>
      <CardContent>
        <p>This card only has content, no header or footer.</p>
      </CardContent>
    </Card>
  ),
};

export const AccentCard: Story = {
  render: () => (
    <Card className="bg-accent text-accent-foreground">
      <CardHeader>
        <CardTitle>Accent Themed</CardTitle>
        <CardDescription>This card uses the accent color</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Useful for highlighting call-to-action content.</p>
      </CardContent>
    </Card>
  ),
};

export const MutedCard: Story = {
  render: () => (
    <Card className="bg-muted text-muted-foreground">
      <CardHeader>
        <CardTitle>Muted Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This card has a more subtle appearance.</p>
      </CardContent>
    </Card>
  ),
};

export const CardWithImage: Story = {
  render: () => (
    <Card className="overflow-hidden p-0">
      <Image
        src="https://placehold.co/400x600"
        alt="Card Image"
        width={400}
        height={600}
        className="w-full h-auto object-cover"
      />
      <CardHeader className="px-4 pt-4">
        <CardTitle>Game Card</CardTitle>
        <CardDescription>Game of the month</CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <p>
          Dive into the adventure with our most recommended title this season.
        </p>
      </CardContent>
    </Card>
  ),
};

export const InteractiveCard: Story = {
  render: () => (
    <Card className="transition-all hover:shadow-lg hover:ring-2 hover:ring-primary cursor-pointer">
      <CardHeader>
        <CardTitle>Interactive Card</CardTitle>
        <CardDescription>Hover to see effect</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card visually responds to user interaction.</p>
      </CardContent>
    </Card>
  ),
};
