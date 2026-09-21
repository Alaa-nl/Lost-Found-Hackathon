import { expect, test } from "vitest";
import { createFoundItem } from "@/actions/foundItem/createFoundItem/createFoundItem";
import { prisma } from "@/prisma/prismaClient";

test("persists and returns an item that starts as waiting", async () => {
  const item = await createFoundItem({
    name: "Black iPhone",
    location: "Lobby",
    roomNumber: "204",
    notes: "Cracked screen",
  });

  expect(item.id).toEqual(expect.any(Number));
  expect(item.createdAt).toBeInstanceOf(Date);
  expect(item.name).toBe("Black iPhone");
  expect(item.location).toBe("Lobby");
  expect(item.roomNumber).toBe("204");
  expect(item.notes).toBe("Cracked screen");
  expect(item.status).toBe("waiting");
  expect(item.claimedAt).toBeNull();

  const stored = await prisma.foundItem.findUnique({ where: { id: item.id } });
  expect(stored).toEqual(item);
});

test("trims every text field", async () => {
  const item = await createFoundItem({
    name: "  Black iPhone  ",
    location: "  Lobby  ",
    roomNumber: "  204  ",
    notes: "  Cracked screen  ",
  });

  expect(item.name).toBe("Black iPhone");
  expect(item.location).toBe("Lobby");
  expect(item.roomNumber).toBe("204");
  expect(item.notes).toBe("Cracked screen");
});

test("empty optional fields become null and null stays null", async () => {
  const whitespace = await createFoundItem({
    name: "Umbrella",
    location: "Bar",
    roomNumber: "   ",
    notes: "   ",
  });
  expect(whitespace.roomNumber).toBeNull();
  expect(whitespace.notes).toBeNull();

  const missing = await createFoundItem({
    name: "Scarf",
    location: "Bar",
    roomNumber: null,
    notes: null,
  });
  expect(missing.roomNumber).toBeNull();
  expect(missing.notes).toBeNull();
});

test("empty name or location throws and writes nothing", async () => {
  await expect(
    createFoundItem({
      name: "   ",
      location: "Lobby",
      roomNumber: null,
      notes: null,
    }),
  ).rejects.toThrow();

  await expect(
    createFoundItem({
      name: "Black iPhone",
      location: "   ",
      roomNumber: null,
      notes: null,
    }),
  ).rejects.toThrow();

  expect(await prisma.foundItem.count()).toBe(0);
});
