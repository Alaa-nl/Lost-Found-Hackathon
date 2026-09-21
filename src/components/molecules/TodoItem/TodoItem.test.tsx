import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { TodoItem } from "./TodoItem";

const sampleTodo = {
  id: 1,
  createdAt: new Date("2026-01-15T00:00:00.000Z"),
  title: "Buy peppers",
  description: "Habanero and jalapeño",
};

test("renders the todo title", async () => {
  const screen = await render(
    <TodoItem todo={sampleTodo} onUpdate={vi.fn()} onDelete={vi.fn()} />,
  );
  await expect.element(screen.getByText("Buy peppers")).toBeVisible();
});

test("Delete calls onDelete with the todo id", async () => {
  const onDelete = vi.fn();
  const screen = await render(
    <TodoItem todo={sampleTodo} onUpdate={vi.fn()} onDelete={onDelete} />,
  );
  await screen.getByRole("button", { name: "Delete" }).click();
  expect(onDelete).toHaveBeenCalledWith(1);
});

test("Edit then Save calls onUpdate with the updated todo", async () => {
  const onUpdate = vi.fn();
  const screen = await render(
    <TodoItem todo={sampleTodo} onUpdate={onUpdate} onDelete={vi.fn()} />,
  );
  await screen.getByRole("button", { name: "Edit" }).click();
  await screen.getByRole("textbox", { name: "Title" }).fill("Roast peppers");
  await screen.getByRole("button", { name: "Save" }).click();
  expect(onUpdate).toHaveBeenCalledWith({
    ...sampleTodo,
    title: "Roast peppers",
  });
});
