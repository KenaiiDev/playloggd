import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Alert, AlertTitle, AlertDescription } from "./alert";
import { Terminal, AlertCircle, CheckCircle2, Info } from "lucide-react";

const meta: Meta<typeof Alert> = {
  title: "Components/UI/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  render: (args) => (
    <Alert {...args}>
      <Terminal />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the cli.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: (args) => (
    <Alert variant="destructive" {...args}>
      <AlertCircle />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
  ),
};

export const WithIcon: Story = {
  render: (args) => (
    <Alert {...args}>
      <Info />
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        This is an informational message with an icon.
      </AlertDescription>
    </Alert>
  ),
};

export const Success: Story = {
  render: (args) => (
    <Alert
      className="border-green-500 text-green-700 dark:text-green-400"
      {...args}
    >
      <CheckCircle2 />
      <AlertTitle>Success!</AlertTitle>
      <AlertDescription>
        Your changes have been saved successfully.
      </AlertDescription>
    </Alert>
  ),
};

export const TitleOnly: Story = {
  render: (args) => (
    <Alert {...args}>
      <Info />
      <AlertTitle>Quick notification</AlertTitle>
    </Alert>
  ),
};

export const DescriptionOnly: Story = {
  render: (args) => (
    <Alert {...args}>
      <AlertDescription>
        This is a simple alert with only a description.
      </AlertDescription>
    </Alert>
  ),
};

export const LongContent: Story = {
  render: (args) => (
    <Alert {...args}>
      <Info />
      <AlertTitle>Update Available</AlertTitle>
      <AlertDescription>
        A new version of the application is available. This update includes bug
        fixes, performance improvements, and new features. We recommend updating
        to the latest version to ensure the best experience. The update will
        download automatically in the background.
      </AlertDescription>
    </Alert>
  ),
};

export const GameSaved: Story = {
  render: (args) => (
    <Alert
      className="border-green-500 text-green-700 dark:text-green-400"
      {...args}
    >
      <CheckCircle2 />
      <AlertTitle>Game Added!</AlertTitle>
      <AlertDescription>
        &ldquo;The Legend of Zelda: Breath of the Wild&rdquo; has been added to
        your library.
      </AlertDescription>
    </Alert>
  ),
};

export const GameDeleted: Story = {
  render: (args) => (
    <Alert variant="destructive" {...args}>
      <AlertCircle />
      <AlertTitle>Game Removed</AlertTitle>
      <AlertDescription>
        The game has been removed from your library. This action cannot be
        undone.
      </AlertDescription>
    </Alert>
  ),
};

export const ReviewPosted: Story = {
  render: (args) => (
    <Alert
      className="border-blue-500 text-blue-700 dark:text-blue-400"
      {...args}
    >
      <CheckCircle2 />
      <AlertTitle>Review Posted</AlertTitle>
      <AlertDescription>
        Your review has been published and is now visible to other users.
      </AlertDescription>
    </Alert>
  ),
};

export const SyncWarning: Story = {
  render: (args) => (
    <Alert
      className="border-yellow-500 text-yellow-700 dark:text-yellow-400"
      {...args}
    >
      <AlertCircle />
      <AlertTitle>Sync Issue</AlertTitle>
      <AlertDescription>
        Unable to sync your game progress. Please check your internet connection
        and try again.
      </AlertDescription>
    </Alert>
  ),
};

export const MultipleAlerts: Story = {
  render: (args) => (
    <div className="space-y-4 max-w-2xl">
      <Alert
        className="border-green-500 text-green-700 dark:text-green-400"
        {...args}
      >
        <CheckCircle2 />
        <AlertTitle>Achievement Unlocked!</AlertTitle>
        <AlertDescription>
          You&apos;ve completed all games in your backlog. Great job!
        </AlertDescription>
      </Alert>
      <Alert {...args}>
        <Info />
        <AlertTitle>Maintenance Scheduled</AlertTitle>
        <AlertDescription>
          The platform will undergo maintenance on Saturday from 2:00 AM to 4:00
          AM EST.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive" {...args}>
        <AlertCircle />
        <AlertTitle>Error Saving Progress</AlertTitle>
        <AlertDescription>
          Failed to save your game progress. Please try again later.
        </AlertDescription>
      </Alert>
    </div>
  ),
};
