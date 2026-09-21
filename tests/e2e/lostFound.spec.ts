import { expect, test } from "@playwright/test";

test("found item add, claim, and delete persist across reloads", async ({
  page,
}) => {
  // Unique name: the dev database keeps rows from earlier runs.
  const name = `e2e-item-${Date.now()}`;
  const card = page.getByRole("listitem").filter({ hasText: name });

  await page.goto("/");

  await page.getByRole("textbox", { name: "Item name" }).fill(name);
  await page.getByRole("textbox", { name: "Found at" }).fill("Lobby");
  await page.getByRole("button", { name: "Add" }).click();
  await expect(card).toBeVisible();

  // Reload to prove the row came from the database, not from local state.
  await page.goto("/");
  await expect(card).toBeVisible();
  await expect(card.getByText("Waiting")).toBeVisible();

  await card.getByRole("button", { name: "Mark claimed" }).click();
  await expect(card.getByText("Claimed", { exact: true })).toBeVisible();
  // Claiming is one way: the status button is gone afterwards.
  await expect(card.getByRole("button", { name: "Mark claimed" })).toHaveCount(0);

  await page.goto("/");
  await expect(card.getByText("Claimed", { exact: true })).toBeVisible();

  // Search narrows to this item only, then the Waiting tab hides it again
  // because it is already claimed.
  const search = page.getByRole("searchbox", { name: "Search by name" });
  await search.fill(name);
  await expect(card).toBeVisible();

  await page.getByRole("tab", { name: "Waiting" }).click();
  await expect(page.getByText("No items match your filter")).toBeVisible();

  await page.getByRole("tab", { name: "Claimed" }).click();
  await expect(card).toBeVisible();

  await search.fill("");
  await page.getByRole("tab", { name: "All" }).click();

  await card.getByRole("button", { name: "Delete" }).click();
  await expect(card).toHaveCount(0);

  await page.goto("/");
  await expect(card).toHaveCount(0);
});
