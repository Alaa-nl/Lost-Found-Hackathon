import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
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

test("empty list shows No todos yet and the form", async () => {
  const screen = await render(
    <TodoList
      todos={[]}
      onAdd={vi.fn()}
      onUpdate={vi.fn()}
      onDelete={vi.fn()}
    />,
  );
  await expect.element(screen.getByText("No todos yet.")).toBeVisible();
  await expect
    .element(screen.getByRole("button", { name: "Add" }))
    .toBeVisible();
});

test("non-empty list shows titles and not the empty message", async () => {
  const screen = await render(
    <TodoList
      todos={sampleTodos}
      onAdd={vi.fn()}
      onUpdate={vi.fn()}
      onDelete={vi.fn()}
    />,
  );
  await expect.element(screen.getByText("Buy peppers")).toBeVisible();
  await expect.element(screen.getByText("Label bottles")).toBeVisible();
  await expect.element(screen.getByText("No todos yet.")).not.toBeInTheDocument();
});
