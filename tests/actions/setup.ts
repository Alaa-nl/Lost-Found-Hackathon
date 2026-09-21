import { afterAll, beforeEach } from "vitest";
import { prisma } from "@/prisma/prismaClient";

beforeEach(async () => {
  await prisma.foundItem.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
