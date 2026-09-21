import { expect, test } from "vitest";
import { deleteFoundItem } from "@/actions/foundItem/deleteFoundItem/deleteFoundItem";
import { prisma } from "@/prisma/prismaClient";

test("removes only the requested item", async () => {
  const kept = await prisma.foundItem.create({
    data: { name: "Umbrella", location: "Bar" },
  });
  const removed = await prisma.foundItem.create({
    data: { name: "Black iPhone", location: "Lobby" },
  });

  await deleteFoundItem(removed.id);

  const remaining = await prisma.foundItem.findMany();
  expect(remaining.map((item) => item.id)).toEqual([kept.id]);
});

test("unknown id throws", async () => {
  await expect(deleteFoundItem(999_999)).rejects.toThrow();
});
