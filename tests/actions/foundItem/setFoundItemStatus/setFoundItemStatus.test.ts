import { expect, test } from "vitest";
import { setFoundItemStatus } from "@/actions/foundItem/setFoundItemStatus/setFoundItemStatus";
import { prisma } from "@/prisma/prismaClient";

test("claiming sets the status and stamps claimedAt", async () => {
  const existing = await prisma.foundItem.create({
    data: { name: "Black iPhone", location: "Lobby" },
  });

  const updated = await setFoundItemStatus({
    id: existing.id,
    status: "claimed",
  });

  expect(updated.id).toBe(existing.id);
  expect(updated.status).toBe("claimed");
  expect(updated.claimedAt).toBeInstanceOf(Date);
  expect(updated.createdAt).toEqual(existing.createdAt);

  const stored = await prisma.foundItem.findUnique({
    where: { id: existing.id },
  });
  expect(stored).toEqual(updated);
});

test("going back to waiting clears claimedAt", async () => {
  const existing = await prisma.foundItem.create({
    data: {
      name: "Black iPhone",
      location: "Lobby",
      status: "claimed",
      claimedAt: new Date(),
    },
  });

  const updated = await setFoundItemStatus({
    id: existing.id,
    status: "waiting",
  });

  expect(updated.status).toBe("waiting");
  expect(updated.claimedAt).toBeNull();
});

test("unknown status throws and leaves the row unchanged", async () => {
  const existing = await prisma.foundItem.create({
    data: { name: "Black iPhone", location: "Lobby" },
  });

  await expect(
    setFoundItemStatus({
      id: existing.id,
      // Cast past the union on purpose: the action guards at runtime too.
      status: "lost" as "waiting",
    }),
  ).rejects.toThrow();

  const stored = await prisma.foundItem.findUnique({
    where: { id: existing.id },
  });
  expect(stored?.status).toBe("waiting");
});

test("unknown id throws", async () => {
  await expect(
    setFoundItemStatus({ id: 999_999, status: "claimed" }),
  ).rejects.toThrow();
});
