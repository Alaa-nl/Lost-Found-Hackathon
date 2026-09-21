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

const claimedItem: FoundItem = {
  id: 2,
  createdAt: new Date("2026-09-20T10:00:00.000Z"),
  name: "Blue umbrella",
  location: "Bar",
  roomNumber: null,
  notes: null,
  status: "claimed",
  claimedAt: new Date("2026-09-21T09:00:00.000Z"),
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
  await expect
    .element(screen.getByRole("button", { name: "Mark claimed" }))
    .not.toBeInTheDocument();
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

test("counts every item regardless of the active filter", async () => {
  const screen = await render(
    <LostFoundPage
      initialItems={[waitingItem, claimedItem]}
      createFoundItem={vi.fn()}
      setFoundItemStatus={vi.fn()}
      deleteFoundItem={vi.fn()}
    />,
  );

  await expect.element(screen.getByText("1 waiting, 1 claimed")).toBeVisible();
});

test("the status tabs narrow the list", async () => {
  const screen = await render(
    <LostFoundPage
      initialItems={[waitingItem, claimedItem]}
      createFoundItem={vi.fn()}
      setFoundItemStatus={vi.fn()}
      deleteFoundItem={vi.fn()}
    />,
  );

  await screen.getByRole("tab", { name: "Claimed" }).click();

  await expect
    .element(screen.getByRole("heading", { name: "Blue umbrella" }))
    .toBeVisible();
  await expect
    .element(screen.getByRole("heading", { name: "Black iPhone" }))
    .not.toBeInTheDocument();
  // The totals still describe the whole list.
  await expect.element(screen.getByText("1 waiting, 1 claimed")).toBeVisible();
});

test("search matches the name case-insensitively", async () => {
  const screen = await render(
    <LostFoundPage
      initialItems={[waitingItem, claimedItem]}
      createFoundItem={vi.fn()}
      setFoundItemStatus={vi.fn()}
      deleteFoundItem={vi.fn()}
    />,
  );

  await screen
    .getByRole("searchbox", { name: "Search by name" })
    .fill("  IPHONE  ");

  await expect
    .element(screen.getByRole("heading", { name: "Black iPhone" }))
    .toBeVisible();
  await expect
    .element(screen.getByRole("heading", { name: "Blue umbrella" }))
    .not.toBeInTheDocument();
});

test("a filter with no matches explains itself", async () => {
  const screen = await render(
    <LostFoundPage
      initialItems={[waitingItem, claimedItem]}
      createFoundItem={vi.fn()}
      setFoundItemStatus={vi.fn()}
      deleteFoundItem={vi.fn()}
    />,
  );

  await screen
    .getByRole("searchbox", { name: "Search by name" })
    .fill("nothing matches this");

  await expect
    .element(screen.getByText("No items match your filter"))
    .toBeVisible();
});

test("search matches part of a name, not just the start", async () => {
  const screen = await render(
    <LostFoundPage
      initialItems={[waitingItem, claimedItem]}
      createFoundItem={vi.fn()}
      setFoundItemStatus={vi.fn()}
      deleteFoundItem={vi.fn()}
    />,
  );

  // "umbrella" sits at the end of "Blue umbrella".
  await screen.getByRole("searchbox", { name: "Search by name" }).fill("umbrella");

  await expect
    .element(screen.getByRole("heading", { name: "Blue umbrella" }))
    .toBeVisible();
  await expect
    .element(screen.getByRole("heading", { name: "Black iPhone" }))
    .not.toBeInTheDocument();
});

test("search combines with the status tabs", async () => {
  const screen = await render(
    <LostFoundPage
      initialItems={[waitingItem, claimedItem]}
      createFoundItem={vi.fn()}
      setFoundItemStatus={vi.fn()}
      deleteFoundItem={vi.fn()}
    />,
  );

  // "Blue umbrella" is claimed, so a Waiting tab plus that search finds nothing.
  await screen.getByRole("tab", { name: "Waiting" }).click();
  await screen.getByRole("searchbox", { name: "Search by name" }).fill("umbrella");

  await expect
    .element(screen.getByText("No items match your filter"))
    .toBeVisible();
});

test("clearing the search brings every item back", async () => {
  const screen = await render(
    <LostFoundPage
      initialItems={[waitingItem, claimedItem]}
      createFoundItem={vi.fn()}
      setFoundItemStatus={vi.fn()}
      deleteFoundItem={vi.fn()}
    />,
  );

  const search = screen.getByRole("searchbox", { name: "Search by name" });
  await search.fill("iphone");
  await expect
    .element(screen.getByRole("heading", { name: "Blue umbrella" }))
    .not.toBeInTheDocument();

  await search.fill("");

  await expect
    .element(screen.getByRole("heading", { name: "Blue umbrella" }))
    .toBeVisible();
  await expect
    .element(screen.getByRole("heading", { name: "Black iPhone" }))
    .toBeVisible();
});

test("search does not match the location or notes", async () => {
  const screen = await render(
    <LostFoundPage
      initialItems={[waitingItem, claimedItem]}
      createFoundItem={vi.fn()}
      setFoundItemStatus={vi.fn()}
      deleteFoundItem={vi.fn()}
    />,
  );

  // "Lobby" is the location of the iPhone, not part of any name.
  await screen.getByRole("searchbox", { name: "Search by name" }).fill("Lobby");

  await expect
    .element(screen.getByText("No items match your filter"))
    .toBeVisible();
});
