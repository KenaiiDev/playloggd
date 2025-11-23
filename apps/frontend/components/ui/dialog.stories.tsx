"use client";

import { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./dialog";
import { Button } from "@/components/ui/button";

const meta: Meta<typeof Dialog> = {
  title: "Components/UI/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};
export default meta;

type Story = StoryObj<typeof Dialog>;

export const Basic: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Basic Dialog</DialogTitle>
          <DialogDescription>This is a simple modal dialog.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const WithoutCloseButton: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog (No Close Icon)</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>No Close Button</DialogTitle>
          <DialogDescription>
            This dialog does not include the top-right close icon.
          </DialogDescription>
        </DialogHeader>
        <p>You can still close it using a footer button or ESC key.</p>
      </DialogContent>
    </Dialog>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Long Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Long Content</DialogTitle>
          <DialogDescription>
            This dialog contains scrollable content.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[300px] overflow-y-auto space-y-2">
          {Array.from({ length: 20 }).map((_, i) => (
            <p key={i}>Item {i + 1} - Lorem ipsum dolor sit amet.</p>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const CustomSize: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Large Dialog</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Custom Width</DialogTitle>
          <DialogDescription>
            This dialog uses a custom max-width (`max-w-3xl`).
          </DialogDescription>
        </DialogHeader>
        <p>You can customize the width and layout as needed.</p>
      </DialogContent>
    </Dialog>
  ),
};
