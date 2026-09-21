import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { FoundItemCard } from "./FoundItemCard";

const meta = {
  title: "Molecules/FoundItemCard",
  component: FoundItemCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: {
      include: ["item"],
    },
  },
  args: {
    item: {
      id: 1,
      createdAt: new Date("2026-09-21T10:00:00.000Z"),
      name: "Black iPhone",
      location: "Lobby",
      roomNumber: "204",
      notes: "Cracked screen",
      status: "waiting",
      claimedAt: null,
    },
    onSetStatus: fn(),
    onDelete: fn(),
  },
  argTypes: {
    onSetStatus: { table: { disable: true } },
    onDelete: { table: { disable: true } },
  },
} satisfies Meta<typeof FoundItemCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Mark claimed" }));
  },
};
