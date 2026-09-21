"use server";

/*
 * Server Action. Prisma write for a newly found item.
 */
import { parseFoundItemFields } from "@/actions/foundItem/helpers";
import { prisma } from "@/prisma/prismaClient";

export async function createFoundItem(input: {
  name: string;
  location: string;
  roomNumber: string | null;
  notes: string | null;
}) {
  const data = parseFoundItemFields(input);
  return prisma.foundItem.create({ data });
}
