import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { Header } from "./Header";

test("renders a visible heading named Lost & Found", async () => {
  const screen = await render(<Header />);
  await expect
    .element(screen.getByRole("heading", { name: "Lost & Found" }))
    .toBeVisible();
});
