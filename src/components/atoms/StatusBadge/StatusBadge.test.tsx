import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { StatusBadge } from "./StatusBadge";

test("waiting renders the orange Waiting badge", async () => {
  const screen = await render(<StatusBadge status="waiting" />);
  const badge = screen.getByText("Waiting");
  await expect.element(badge).toBeVisible();
  await expect.element(badge).toHaveClass(/text-orange-800/);
});

test("claimed renders the green Claimed badge", async () => {
  const screen = await render(<StatusBadge status="claimed" />);
  const badge = screen.getByText("Claimed");
  await expect.element(badge).toBeVisible();
  await expect.element(badge).toHaveClass(/text-green-800/);
});
