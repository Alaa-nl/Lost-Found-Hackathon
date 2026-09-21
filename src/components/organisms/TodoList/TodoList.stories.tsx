import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn } from "storybook/test";
import { TodoList } from "./TodoList";

const sampleTodo = {
  id: 1,
  createdAt: new Date("2026-01-15T00:00:00.000Z"),
  title: "Buy peppers",
  description: "Habanero and jalapeño",
};

const sampleTodos = [
  sampleTodo,
  {
    id: 2,
    createdAt: new Date("2026-01-16T00:00:00.000Z"),
    title: "Label bottles",
    description: null,
  },
];

const meta = {
  title: "Organisms/TodoList",
  component: TodoList,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    todos: sampleTodos,
    onAdd: fn(),
    onUpdate: fn(),
    onDelete: fn(),
  },
  argTypes: {
    onAdd: { table: { disable: true } },
    onUpdate: { table: { disable: true } },
    onDelete: { table: { disable: true } },
  },
} satisfies Meta<typeof TodoList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.type(
      canvas.getByRole("textbox", { name: "Title" }),
      "Buy peppers",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Add" }));
    expect(args.onAdd).toHaveBeenCalled();
  },
};
