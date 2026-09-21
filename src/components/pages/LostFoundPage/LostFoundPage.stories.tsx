import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { LostFoundPage } from "./LostFoundPage";

const item = {
  id: 1,
  createdAt: new Date("2026-09-21T10:00:00.000Z"),
  name: "Black iPhone",
  location: "Lobby",
  roomNumber: "204",
  notes: "Cracked screen",
  status: "waiting",
  claimedAt: null,
};

const meta = {
  title: "Pages/LostFoundPage",
  component: LostFoundPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    controls: {
      include: ["initialItems"],
    },
  },
  args: {
    initialItems: [item],
    createFoundItem: fn(async () => item),
    setFoundItemStatus: fn(async () => ({
      ...item,
      status: "claimed",
      claimedAt: new Date("2026-09-22T10:00:00.000Z"),
    })),
    deleteFoundItem: fn(async () => {}),
  },
  argTypes: {
    createFoundItem: { table: { disable: true } },
    setFoundItemStatus: { table: { disable: true } },
    deleteFoundItem: { table: { disable: true } },
  },
} satisfies Meta<typeof LostFoundPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Mark claimed" }));
  },
};
