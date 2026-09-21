import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { FilterBar } from "./FilterBar";

const meta = {
  title: "Molecules/FilterBar",
  component: FilterBar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: {
      include: ["status", "search"],
    },
  },
  args: {
    status: "all",
    search: "",
    onStatusChange: fn(),
    onSearchChange: fn(),
  },
  argTypes: {
    status: {
      control: "radio",
      options: ["all", "waiting", "claimed"],
    },
    onStatusChange: { table: { disable: true } },
    onSearchChange: { table: { disable: true } },
  },
} satisfies Meta<typeof FilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("tab", { name: "Waiting" }));
  },
};
