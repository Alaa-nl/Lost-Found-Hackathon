/*
 * Shared input helpers for the foundItem actions.
 * Not a Server Action: no "use server" here.
 */

/**
 * The database stores `status` as a plain String. In TypeScript we narrow it to
 * this union so the compiler rejects any other value.
 */
export type FoundItemStatus = "waiting" | "claimed";

const statuses: readonly FoundItemStatus[] = ["waiting", "claimed"];

/**
 * Type guard. Turns an unknown string into a `FoundItemStatus`, so callers can
 * trust the value after the check.
 */
export function isFoundItemStatus(value: string): value is FoundItemStatus {
  return statuses.includes(value as FoundItemStatus);
}

export function parseFoundItemFields(input: {
  name: string;
  location: string;
  roomNumber: string | null;
  notes: string | null;
}): {
  name: string;
  location: string;
  roomNumber: string | null;
  notes: string | null;
} {
  const name = input.name.trim();
  if (name === "") {
    throw new Error("Name is required");
  }
  const location = input.location.trim();
  if (location === "") {
    throw new Error("Location is required");
  }
  const roomNumber =
    input.roomNumber === null ? null : input.roomNumber.trim() || null;
  const notes = input.notes === null ? null : input.notes.trim() || null;
  return { name, location, roomNumber, notes };
}
