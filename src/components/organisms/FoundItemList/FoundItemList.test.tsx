import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { FoundItemList } from "./FoundItemList";
import { type FoundItem } from "@/generated/prisma/browser";

const items: FoundItem[] = [
  {
    id: 1,
    createdAt: new Date("2026-09-21T10:00:00.000Z"),
    name: "Black iPhone",
    location: "Lobby",
    roomNumber: "204",
    notes: null,
    status: "waiting",
    claimedAt: null,
  },
  {
    id: 2,
    createdAt: new Date("2026-09-20T10:00:00.000Z"),
    name: "Blue umbrella",
    location: "Bar",
    roomNumber: null,
    notes: null,
    status: "claimed",
    claimedAt: new Date("2026-09-21T09:00:00.000Z"),
  },
];

const noop = {
  onAdd: vi.fn(),
  onSetStatus: vi.fn(),
  onDelete: vi.fn(),
};

test("renders one list item per found item", async () => {
  const screen = await render(<FoundItemList items={items} {...noop} />);

  await expect.element(screen.getByRole("listitem").first()).toBeVisible();
  await expect
    .element(screen.getByRole("heading", { name: "Black iPhone" }))
    .toBeVisible();
  await expect
    .element(screen.getByRole("heading", { name: "Blue umbrella" }))
    .toBeVisible();
});

test("shows the empty state and still renders the form", async () => {
  const screen = await render(<FoundItemList items={[]} {...noop} />);

  await expect.element(screen.getByText("No items yet")).toBeVisible();
  await expect
    .element(screen.getByRole("button", { name: "Add" }))
    .toBeVisible();
});

test("passes the card callbacks through", async () => {
  const onDelete = vi.fn();
  const screen = await render(
    <FoundItemList
      items={[items[0]]}
      onAdd={vi.fn()}
      onSetStatus={vi.fn()}
      onDelete={onDelete}
    />,
  );

  await screen.getByRole("button", { name: "Delete" }).click();

  expect(onDelete).toHaveBeenCalledWith(1);
});
