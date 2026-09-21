import { expect, test } from "vitest";
import { listTodos } from "@/actions/todo/listTodos/listTodos";
import { prisma } from "@/prisma/prismaClient";

test("returns todos newest-first by createdAt", async () => {
  await prisma.todo.create({
    data: {
      title: "Oldest",
      description: null,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    },
  });
  await prisma.todo.create({
    data: {
      title: "Middle",
      description: null,
      createdAt: new Date("2026-06-01T00:00:00.000Z"),
    },
  });
  await prisma.todo.create({
    data: {
      title: "Newest",
      description: null,
      createdAt: new Date("2026-12-01T00:00:00.000Z"),
    },
  });

  const todos = await listTodos();

  expect(todos.map((todo) => todo.title)).toEqual([
    "Newest",
    "Middle",
    "Oldest",
  ]);
});
