"use server";

import { prisma } from "@/prisma/prismaClient";

export async function deleteTodo(id: number): Promise<void> {
  await prisma.todo.delete({ where: { id } });
}
