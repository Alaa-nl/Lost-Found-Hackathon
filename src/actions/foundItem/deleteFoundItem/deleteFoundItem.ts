"use server";

import { prisma } from "@/prisma/prismaClient";

export async function deleteFoundItem(id: number): Promise<void> {
  await prisma.foundItem.delete({ where: { id } });
}
