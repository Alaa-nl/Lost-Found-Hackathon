"use server";

import { prisma } from "@/prisma/prismaClient";

export async function listFoundItems() {
  return prisma.foundItem.findMany({
    orderBy: { createdAt: "desc" },
  });
}
