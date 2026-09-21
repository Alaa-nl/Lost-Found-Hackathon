import { afterAll, beforeEach } from "vitest";
import { prisma } from "@/prisma/prismaClient";

beforeEach(async () => {
  await prisma.todo.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
