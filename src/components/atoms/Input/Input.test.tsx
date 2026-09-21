import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { Input } from "./Input";

test("renders a visible textbox named Title", async () => {
  const screen = await render(<Input aria-label="Title" />);
  await expect
    .element(screen.getByRole("textbox", { name: "Title" }))
    .toBeVisible();
});
