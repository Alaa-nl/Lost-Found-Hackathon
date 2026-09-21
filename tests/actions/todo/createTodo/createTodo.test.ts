import { expect, test } from "vitest";
import { createTodo } from "@/actions/todo/createTodo/createTodo";
import { prisma } from "@/prisma/prismaClient";

test("persists and returns a todo with generated id and createdAt", async () => {
  const todo = await createTodo({
    title: "Buy peppers",
    description: "Habanero",
  });

  expect(todo.id).toEqual(expect.any(Number));
  expect(todo.createdAt).toBeInstanceOf(Date);
  expect(todo.title).toBe("Buy peppers");
  expect(todo.description).toBe("Habanero");

  const stored = await prisma.todo.findUnique({ where: { id: todo.id } });
  expect(stored).toEqual(todo);
});

test("trims title and description", async () => {
  const todo = await createTodo({
    title: "  Buy peppers  ",
    description: "  Habanero  ",
  });

  expect(todo.title).toBe("Buy peppers");
  expect(todo.description).toBe("Habanero");
});

test("empty description becomes null and null stays null", async () => {
  const whitespace = await createTodo({
    title: "Buy peppers",
    description: "   ",
  });
  expect(whitespace.description).toBeNull();

  const missing = await createTodo({
    title: "Buy more peppers",
    description: null,
  });
  expect(missing.description).toBeNull();
});

test("empty title throws and writes nothing", async () => {
  await expect(
    createTodo({ title: "", description: "Habanero" }),
  ).rejects.toThrow();
  await expect(
    createTodo({ title: "   ", description: "Habanero" }),
  ).rejects.toThrow();

  expect(await prisma.todo.count()).toBe(0);
});
