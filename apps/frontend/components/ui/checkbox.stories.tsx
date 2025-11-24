import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Checkbox } from "./checkbox";
import { Label } from "./label";

const meta: Meta<typeof Checkbox> = {
  title: "Components/UI/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: (args) => <Checkbox {...args} />,
};

export const Checked: Story = {
  render: (args) => <Checkbox defaultChecked {...args} />,
};

export const Disabled: Story = {
  render: (args) => <Checkbox disabled {...args} />,
};

export const DisabledChecked: Story = {
  render: (args) => <Checkbox disabled defaultChecked {...args} />,
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" {...args} />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};

export const WithLabelChecked: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox id="newsletter" defaultChecked {...args} />
      <Label htmlFor="newsletter">Subscribe to newsletter</Label>
    </div>
  ),
};

export const WithDescription: Story = {
  render: (args) => (
    <div className="flex items-start space-x-2">
      <Checkbox id="marketing" className="mt-1" {...args} />
      <div className="grid gap-1.5 leading-none">
        <Label htmlFor="marketing">Marketing emails</Label>
        <p className="text-sm text-muted-foreground">
          Receive emails about new products, features, and more.
        </p>
      </div>
    </div>
  ),
};

export const MultipleCheckboxes: Story = {
  render: (args) => (
    <div className="grid gap-3">
      <div className="flex items-center space-x-2">
        <Checkbox id="option1" {...args} />
        <Label htmlFor="option1">Option 1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="option2" defaultChecked {...args} />
        <Label htmlFor="option2">Option 2</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="option3" {...args} />
        <Label htmlFor="option3">Option 3</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="option4" disabled {...args} />
        <Label htmlFor="option4">Option 4 (disabled)</Label>
      </div>
    </div>
  ),
};

export const GameGenresFilter: Story = {
  render: (args) => (
    <div className="space-y-4">
      <div>
        <h3 className="mb-3 text-sm font-medium">Filter by Genre</h3>
        <div className="grid gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="action" defaultChecked {...args} />
            <Label htmlFor="action">Action</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="adventure" defaultChecked {...args} />
            <Label htmlFor="adventure">Adventure</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="rpg" {...args} />
            <Label htmlFor="rpg">RPG</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="strategy" {...args} />
            <Label htmlFor="strategy">Strategy</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="indie" {...args} />
            <Label htmlFor="indie">Indie</Label>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const GameStatusFilter: Story = {
  render: (args) => (
    <div className="space-y-4">
      <div>
        <h3 className="mb-3 text-sm font-medium">Filter by Status</h3>
        <div className="grid gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="playing" defaultChecked {...args} />
            <Label htmlFor="playing">Currently Playing</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="completed" defaultChecked {...args} />
            <Label htmlFor="completed">Completed</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="wishlist" {...args} />
            <Label htmlFor="wishlist">Wishlist</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="backlog" {...args} />
            <Label htmlFor="backlog">Backlog</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="dropped" {...args} />
            <Label htmlFor="dropped">Dropped</Label>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const FormExample: Story = {
  render: (args) => (
    <form className="space-y-4">
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Privacy Settings</h3>
        <div className="flex items-start space-x-2">
          <Checkbox id="profile-public" defaultChecked {...args} />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="profile-public">Public profile</Label>
            <p className="text-sm text-muted-foreground">
              Make your gaming profile visible to other users
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <Checkbox id="show-activity" defaultChecked {...args} />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="show-activity">Show activity</Label>
            <p className="text-sm text-muted-foreground">
              Display your recent gaming activity on your profile
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <Checkbox id="allow-friend-requests" {...args} />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="allow-friend-requests">Allow friend requests</Label>
            <p className="text-sm text-muted-foreground">
              Let other users send you friend requests
            </p>
          </div>
        </div>
      </div>
    </form>
  ),
};

export const WithError: Story = {
  render: (args) => (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox id="accept-error" aria-invalid {...args} />
        <Label htmlFor="accept-error">I accept the terms and conditions</Label>
      </div>
      <p className="text-sm text-destructive">
        You must accept the terms and conditions to continue
      </p>
    </div>
  ),
};
