import { expect, test } from "vitest";
import { deleteTodo } from "@/actions/todo/deleteTodo/deleteTodo";
import { prisma } from "@/prisma/prismaClient";

test("removes the row", async () => {
  const existing = await prisma.todo.create({
    data: { title: "Buy peppers", description: null },
  });

  await expect(deleteTodo(existing.id)).resolves.toBeUndefined();

  const stored = await prisma.todo.findUnique({ where: { id: existing.id } });
  expect(stored).toBeNull();
});

test("unknown id throws", async () => {
  await expect(deleteTodo(999_999)).rejects.toThrow();
});
