import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { TodoItem } from "./TodoItem";

const sampleTodo = {
  id: 1,
  createdAt: new Date("2026-01-15T00:00:00.000Z"),
  title: "Buy peppers",
  description: "Habanero and jalapeño",
};

const meta = {
  title: "Molecules/TodoItem",
  component: TodoItem,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    todo: sampleTodo,
    onUpdate: fn(),
    onDelete: fn(),
  },
  argTypes: {
    onUpdate: { table: { disable: true } },
    onDelete: { table: { disable: true } },
  },
} satisfies Meta<typeof TodoItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Edit" }));
  },
};
