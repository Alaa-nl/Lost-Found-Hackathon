"use server";

import { parseTodoFields } from "@/actions/todo/helpers";
import { prisma } from "@/prisma/prismaClient";

export async function updateTodo(input: {
  id: number;
  title: string;
  description: string | null;
}) {
  const { title, description } = parseTodoFields(input);
  return prisma.todo.update({
    where: { id: input.id },
    data: { title, description },
  });
}
