import { expect, test } from "vitest";
import { listFoundItems } from "@/actions/foundItem/listFoundItems/listFoundItems";
import { prisma } from "@/prisma/prismaClient";

test("returns an empty array when there are no items", async () => {
  expect(await listFoundItems()).toEqual([]);
});

test("returns newest first", async () => {
  const older = await prisma.foundItem.create({
    data: {
      name: "Umbrella",
      location: "Bar",
      createdAt: new Date("2026-09-20T10:00:00.000Z"),
    },
  });
  const newer = await prisma.foundItem.create({
    data: {
      name: "Black iPhone",
      location: "Lobby",
      createdAt: new Date("2026-09-21T10:00:00.000Z"),
    },
  });

  const items = await listFoundItems();

  expect(items.map((item) => item.id)).toEqual([newer.id, older.id]);
});
