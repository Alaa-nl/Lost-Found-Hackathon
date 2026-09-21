import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { FilterBar } from "./FilterBar";

test("marks the active tab as selected", async () => {
  const screen = await render(
    <FilterBar
      status="waiting"
      search=""
      onStatusChange={vi.fn()}
      onSearchChange={vi.fn()}
    />,
  );

  await expect
    .element(screen.getByRole("tab", { name: "Waiting" }))
    .toHaveAttribute("aria-selected", "true");
  await expect
    .element(screen.getByRole("tab", { name: "All" }))
    .toHaveAttribute("aria-selected", "false");
});

test("clicking a tab reports the new status", async () => {
  const onStatusChange = vi.fn();
  const screen = await render(
    <FilterBar
      status="all"
      search=""
      onStatusChange={onStatusChange}
      onSearchChange={vi.fn()}
    />,
  );

  await screen.getByRole("tab", { name: "Claimed" }).click();

  expect(onStatusChange).toHaveBeenCalledWith("claimed");
});

test("typing reports the search text", async () => {
  const onSearchChange = vi.fn();
  const screen = await render(
    <FilterBar
      status="all"
      search=""
      onStatusChange={vi.fn()}
      onSearchChange={onSearchChange}
    />,
  );

  await screen.getByRole("searchbox", { name: "Search by name" }).fill("phone");

  expect(onSearchChange).toHaveBeenCalledWith("phone");
});
