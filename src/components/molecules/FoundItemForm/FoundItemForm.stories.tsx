import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { FoundItemForm } from "./FoundItemForm";

const meta = {
  title: "Molecules/FoundItemForm",
  component: FoundItemForm,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    onAdd: fn(),
  },
  argTypes: {
    onAdd: { table: { disable: true } },
  },
} satisfies Meta<typeof FoundItemForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(
      canvas.getByRole("textbox", { name: "Item name" }),
      "Black iPhone",
    );
    await userEvent.type(
      canvas.getByRole("textbox", { name: "Found at" }),
      "Lobby",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Add" }));
  },
};
