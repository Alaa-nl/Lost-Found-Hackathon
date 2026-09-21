"use server";

import { prisma } from "@/prisma/prismaClient";

export async function listTodos() {
  return prisma.todo.findMany({
    orderBy: { createdAt: "desc" },
  });
}
