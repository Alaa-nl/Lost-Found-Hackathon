import { expect, test } from "vitest";
import { updateTodo } from "@/actions/todo/updateTodo/updateTodo";
import { prisma } from "@/prisma/prismaClient";

test("updates title and description and returns the saved todo", async () => {
  const existing = await prisma.todo.create({
    data: { title: "Buy peppers", description: "Habanero" },
  });

  const updated = await updateTodo({
    id: existing.id,
    title: "  Buy hotter peppers  ",
    description: "  Ghost  ",
  });

  expect(updated.id).toBe(existing.id);
  expect(updated.createdAt).toEqual(existing.createdAt);
  expect(updated.title).toBe("Buy hotter peppers");
  expect(updated.description).toBe("Ghost");

  const stored = await prisma.todo.findUnique({ where: { id: existing.id } });
  expect(stored).toEqual(updated);
});

test("unknown id throws", async () => {
  await expect(
    updateTodo({
      id: 999_999,
      title: "Missing",
      description: null,
    }),
  ).rejects.toThrow();
});
