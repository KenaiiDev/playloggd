import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Label } from "./label";
import { Input } from "./input";
import { Textarea } from "./textarea";

const meta: Meta<typeof Label> = {
  title: "Components/UI/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  render: (args) => <Label {...args}>Default Label</Label>,
};

export const WithInput: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email" {...args}>
        Email
      </Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  ),
};

export const WithTextarea: Story = {
  render: (args) => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message" {...args}>
        Your message
      </Label>
      <Textarea placeholder="Type your message here." id="message" />
    </div>
  ),
};

export const Required: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="username" {...args}>
        Username <span className="text-destructive">*</span>
      </Label>
      <Input type="text" id="username" placeholder="Username" required />
    </div>
  ),
};

export const WithHelperText: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="password" {...args}>
        Password
      </Label>
      <Input type="password" id="password" />
      <p className="text-sm text-muted-foreground">
        Must be at least 8 characters long
      </p>
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5" data-disabled>
      <Label htmlFor="disabled-input" {...args}>
        Disabled Field
      </Label>
      <Input type="text" id="disabled-input" disabled placeholder="Disabled" />
    </div>
  ),
};

export const MultipleFields: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="firstname" {...args}>
          First Name <span className="text-destructive">*</span>
        </Label>
        <Input type="text" id="firstname" placeholder="John" required />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="lastname" {...args}>
          Last Name <span className="text-destructive">*</span>
        </Label>
        <Input type="text" id="lastname" placeholder="Doe" required />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="bio" {...args}>
          Bio
        </Label>
        <Textarea id="bio" placeholder="Tell us a little bit about yourself" />
        <p className="text-sm text-muted-foreground">
          You can use up to 500 characters.
        </p>
      </div>
    </div>
  ),
};

export const WithError: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email-error" {...args}>
        Email
      </Label>
      <Input
        type="email"
        id="email-error"
        placeholder="Email"
        className="border-destructive"
        aria-invalid
      />
      <p className="text-sm text-destructive">Please enter a valid email.</p>
    </div>
  ),
};

export const FormExample: Story = {
  render: (args) => (
    <form className="grid w-full max-w-sm gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="game-title" {...args}>
          Game Title <span className="text-destructive">*</span>
        </Label>
        <Input
          type="text"
          id="game-title"
          placeholder="The Legend of Zelda"
          required
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="rating" {...args}>
          Rating
        </Label>
        <Input
          type="number"
          id="rating"
          placeholder="0-10"
          min="0"
          max="10"
          step="0.1"
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="review" {...args}>
          Review
        </Label>
        <Textarea
          id="review"
          placeholder="Share your thoughts about this game..."
        />
      </div>
    </form>
  ),
};
