import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { TodoForm } from "./TodoForm";

const meta = {
  title: "Molecules/TodoForm",
  component: TodoForm,
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
} satisfies Meta<typeof TodoForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(
      canvas.getByRole("textbox", { name: "Title" }),
      "Buy peppers",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Add" }));
  },
};
