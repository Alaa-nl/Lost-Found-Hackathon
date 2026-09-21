import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn } from "storybook/test";
import { TodoPage } from "./TodoPage";

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
  title: "Pages/TodoPage",
  component: TodoPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    initialTodos: sampleTodos,
    createTodo: fn(async (input) => ({
      id: 100,
      createdAt: new Date("2026-01-17T00:00:00.000Z"),
      title: input.title,
      description: input.description,
    })),
    updateTodo: fn(async (input) => ({
      id: input.id,
      createdAt: new Date("2026-01-15T00:00:00.000Z"),
      title: input.title,
      description: input.description,
    })),
    deleteTodo: fn(async () => {}),
  },
  argTypes: {
    initialTodos: { table: { disable: true } },
    createTodo: { table: { disable: true } },
    updateTodo: { table: { disable: true } },
    deleteTodo: { table: { disable: true } },
  },
} satisfies Meta<typeof TodoPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(
      canvas.getByRole("textbox", { name: "Title" }),
      "Make sauce",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Add" }));
    await expect(canvas.getByText("Make sauce")).toBeVisible();
  },
};
