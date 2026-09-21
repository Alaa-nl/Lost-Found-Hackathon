"use server";

/*
 * Server Action. Marks an item as claimed or puts it back to waiting.
 * Claiming stamps `claimedAt`; undoing clears it again.
 */
import {
  isFoundItemStatus,
  type FoundItemStatus,
} from "@/actions/foundItem/helpers";
import { prisma } from "@/prisma/prismaClient";

export async function setFoundItemStatus(input: {
  id: number;
  status: FoundItemStatus;
}) {
  // Runtime guard: the union only protects us at compile time.
  if (!isFoundItemStatus(input.status)) {
    throw new Error("Unknown status");
  }
  return prisma.foundItem.update({
    where: { id: input.id },
    data: {
      status: input.status,
      claimedAt: input.status === "claimed" ? new Date() : null,
    },
  });
}
