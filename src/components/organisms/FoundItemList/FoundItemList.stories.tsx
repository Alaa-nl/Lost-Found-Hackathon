import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { FoundItemList } from "./FoundItemList";

const meta = {
  title: "Organisms/FoundItemList",
  component: FoundItemList,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: {
      include: ["items"],
    },
  },
  args: {
    items: [
      {
        id: 1,
        createdAt: new Date("2026-09-21T10:00:00.000Z"),
        name: "Black iPhone",
        location: "Lobby",
        roomNumber: "204",
        notes: "Cracked screen",
        status: "waiting",
        claimedAt: null,
      },
      {
        id: 2,
        createdAt: new Date("2026-09-20T10:00:00.000Z"),
        name: "Blue umbrella",
        location: "Bar",
        roomNumber: null,
        notes: null,
        status: "claimed",
        claimedAt: new Date("2026-09-21T09:00:00.000Z"),
      },
    ],
    onAdd: fn(),
    onSetStatus: fn(),
    onDelete: fn(),
  },
  argTypes: {
    onAdd: { table: { disable: true } },
    onSetStatus: { table: { disable: true } },
    onDelete: { table: { disable: true } },
  },
} satisfies Meta<typeof FoundItemList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Mark claimed" }));
  },
};
