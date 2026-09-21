import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { FoundItemForm } from "./FoundItemForm";

test("Add is disabled until both name and location are filled", async () => {
  const screen = await render(<FoundItemForm onAdd={vi.fn()} />);
  const add = screen.getByRole("button", { name: "Add" });
  await expect.element(add).toBeDisabled();

  await screen.getByRole("textbox", { name: "Item name" }).fill("Black iPhone");
  await expect.element(add).toBeDisabled();

  await screen.getByRole("textbox", { name: "Found at" }).fill("Lobby");
  await expect.element(add).toBeEnabled();
});

test("submit sends trimmed values and null for empty optional fields", async () => {
  const onAdd = vi.fn();
  const screen = await render(<FoundItemForm onAdd={onAdd} />);

  await screen
    .getByRole("textbox", { name: "Item name" })
    .fill("  Black iPhone  ");
  await screen.getByRole("textbox", { name: "Found at" }).fill("Lobby");
  await screen.getByRole("button", { name: "Add" }).click();

  expect(onAdd).toHaveBeenCalledWith({
    name: "Black iPhone",
    location: "Lobby",
    roomNumber: null,
    notes: null,
  });
});

test("clears the fields after a successful add", async () => {
  const screen = await render(<FoundItemForm onAdd={vi.fn()} />);
  const name = screen.getByRole("textbox", { name: "Item name" });

  await name.fill("Black iPhone");
  await screen.getByRole("textbox", { name: "Found at" }).fill("Lobby");
  await screen.getByRole("button", { name: "Add" }).click();

  await expect.element(name).toHaveValue("");
});

test("keeps what the user typed when the add fails", async () => {
  // The real page rethrows a failed save. The form must still see the rejected
  // promise, so reject it here and let the form's own `finally` handle it.
  const onAdd = vi.fn(() => Promise.reject(new Error("save failed")));
  const screen = await render(<FoundItemForm onAdd={onAdd} />);
  const name = screen.getByRole("textbox", { name: "Item name" });

  await name.fill("Black iPhone");
  await screen.getByRole("textbox", { name: "Found at" }).fill("Lobby");
  await screen.getByRole("button", { name: "Add" }).click();

  expect(onAdd).toHaveBeenCalled();
  await expect.element(name).toHaveValue("Black iPhone");
});
