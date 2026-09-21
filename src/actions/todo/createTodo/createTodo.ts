"use server";

/*
 * Server Action. Prisma write for a new todo.
 */
import { parseTodoFields } from "@/actions/todo/helpers";
import { prisma } from "@/prisma/prismaClient";

export async function createTodo(input: {
  title: string;
  description: string | null;
}) {
  const data = parseTodoFields(input);
  return prisma.todo.create({ data });
}
