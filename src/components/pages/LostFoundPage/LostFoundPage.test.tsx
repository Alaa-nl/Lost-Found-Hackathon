import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { LostFoundPage } from "./LostFoundPage";
import { type FoundItem } from "@/generated/prisma/browser";

const waitingItem: FoundItem = {
  id: 1,
  createdAt: new Date("2026-09-21T10:00:00.000Z"),
  name: "Black iPhone",
  location: "Lobby",
  roomNumber: "204",
  notes: null,
  status: "waiting",
  claimedAt: null,
};

function renderPage(overrides: Partial<{
  createFoundItem: () => Promise<FoundItem>;
  setFoundItemStatus: () => Promise<FoundItem>;
  deleteFoundItem: () => Promise<void>;
}> = {}) {
  return render(
    <LostFoundPage
      initialItems={[waitingItem]}
      createFoundItem={overrides.createFoundItem ?? vi.fn()}
      setFoundItemStatus={overrides.setFoundItemStatus ?? vi.fn()}
      deleteFoundItem={overrides.deleteFoundItem ?? vi.fn()}
    />,
  );
}

test("renders the items it was given", async () => {
  const screen = await renderPage();
  await expect
    .element(screen.getByRole("heading", { name: "Black iPhone" }))
    .toBeVisible();
});

test("marking claimed swaps the badge using the returned row", async () => {
  const setFoundItemStatus = vi.fn(async () => ({
    ...waitingItem,
    status: "claimed",
    claimedAt: new Date("2026-09-22T10:00:00.000Z"),
  }));
  const screen = await renderPage({ setFoundItemStatus });

  await screen.getByRole("button", { name: "Mark claimed" }).click();

  expect(setFoundItemStatus).toHaveBeenCalledWith({ id: 1, status: "claimed" });
  await expect
    .element(screen.getByText("Claimed on 22 Sep 2026"))
    .toBeVisible();
  await expect.element(screen.getByRole("button", { name: "Undo" })).toBeVisible();
});

test("deleting removes the card from the list", async () => {
  const screen = await renderPage({ deleteFoundItem: vi.fn(async () => {}) });

  await screen.getByRole("button", { name: "Delete" }).click();

  await expect.element(screen.getByText("No items yet")).toBeVisible();
});

test("a failed action shows a generic alert and keeps the list", async () => {
  const screen = await renderPage({
    deleteFoundItem: vi.fn(() => Promise.reject(new Error("db is on fire"))),
  });

  await screen.getByRole("button", { name: "Delete" }).click();

  const alert = screen.getByRole("alert");
  await expect.element(alert).toHaveTextContent("Something went wrong. Try again.");
  // The real reason must never reach the screen.
  await expect.element(alert).not.toHaveTextContent("db is on fire");
  await expect
    .element(screen.getByRole("heading", { name: "Black iPhone" }))
    .toBeVisible();
});
