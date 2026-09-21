import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { FoundItemCard } from "./FoundItemCard";
import { type FoundItem } from "@/generated/prisma/browser";

const waitingItem: FoundItem = {
  id: 1,
  createdAt: new Date("2026-09-21T10:00:00.000Z"),
  name: "Black iPhone",
  location: "Lobby",
  roomNumber: "204",
  notes: "Cracked screen",
  status: "waiting",
  claimedAt: null,
};

test("shows the item details and the waiting badge", async () => {
  const screen = await render(
    <FoundItemCard
      item={waitingItem}
      onSetStatus={vi.fn()}
      onDelete={vi.fn()}
    />,
  );

  await expect
    .element(screen.getByRole("heading", { name: "Black iPhone" }))
    .toBeVisible();
  await expect.element(screen.getByText("Found at: Lobby")).toBeVisible();
  await expect.element(screen.getByText("Room 204")).toBeVisible();
  await expect.element(screen.getByText("Cracked screen")).toBeVisible();
  await expect.element(screen.getByText("Found on 21 Sep 2026")).toBeVisible();
  await expect.element(screen.getByText("Waiting")).toBeVisible();
});

test("Mark claimed asks for the claimed status", async () => {
  const onSetStatus = vi.fn();
  const screen = await render(
    <FoundItemCard
      item={waitingItem}
      onSetStatus={onSetStatus}
      onDelete={vi.fn()}
    />,
  );

  await screen.getByRole("button", { name: "Mark claimed" }).click();

  expect(onSetStatus).toHaveBeenCalledWith({ id: 1, status: "claimed" });
});

test("a claimed item shows Undo and the claimed date", async () => {
  const onSetStatus = vi.fn();
  const screen = await render(
    <FoundItemCard
      item={{
        ...waitingItem,
        status: "claimed",
        claimedAt: new Date("2026-09-22T10:00:00.000Z"),
      }}
      onSetStatus={onSetStatus}
      onDelete={vi.fn()}
    />,
  );

  // `exact` keeps this from also matching "Claimed on 22 Sep 2026".
  await expect
    .element(screen.getByText("Claimed", { exact: true }))
    .toBeVisible();
  await expect.element(screen.getByText("Claimed on 22 Sep 2026")).toBeVisible();

  await screen.getByRole("button", { name: "Undo" }).click();
  expect(onSetStatus).toHaveBeenCalledWith({ id: 1, status: "waiting" });
});

test("Delete passes the item id", async () => {
  const onDelete = vi.fn();
  const screen = await render(
    <FoundItemCard
      item={waitingItem}
      onSetStatus={vi.fn()}
      onDelete={onDelete}
    />,
  );

  await screen.getByRole("button", { name: "Delete" }).click();

  expect(onDelete).toHaveBeenCalledWith(1);
});

test("hides room and notes when they are null", async () => {
  const screen = await render(
    <FoundItemCard
      item={{ ...waitingItem, roomNumber: null, notes: null }}
      onSetStatus={vi.fn()}
      onDelete={vi.fn()}
    />,
  );

  await expect.element(screen.getByText("Room 204")).not.toBeInTheDocument();
  await expect
    .element(screen.getByText("Cracked screen"))
    .not.toBeInTheDocument();
});
