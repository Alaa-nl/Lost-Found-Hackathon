import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { TodoForm } from "./TodoForm";

test("Add is disabled and aria-disabled when title is empty", async () => {
  const screen = await render(<TodoForm onAdd={vi.fn()} />);
  const add = screen.getByRole("button", { name: "Add" });
  await expect.element(add).toBeDisabled();
  await expect.element(add).toHaveAttribute("aria-disabled", "true");
});

test("submit with a title calls onAdd with null description", async () => {
  const onAdd = vi.fn();
  const screen = await render(<TodoForm onAdd={onAdd} />);
  await screen.getByRole("textbox", { name: "Title" }).fill("Buy peppers");
  await screen.getByRole("button", { name: "Add" }).click();
  expect(onAdd).toHaveBeenCalledWith({
    title: "Buy peppers",
    description: null,
  });
});
