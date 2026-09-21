"use client";
// ↑ Required because this file uses useState and event handlers.
// Server Components cannot hold state or respond to clicks; the browser can.

import { useState } from "react";
import { type FoundItemStatus } from "@/components/atoms/StatusBadge/StatusBadge";
import { FoundItemList } from "@/components/organisms/FoundItemList/FoundItemList";
import { PageTemplate } from "@/components/templates/PageTemplate/PageTemplate";
import { type FoundItem } from "@/generated/prisma/browser";

/**
 * Props = data and functions this component receives from its parent.
 * The parent (`src/app/page.tsx`) loads the items on the server and passes the
 * Server Actions here, so this client component never talks to the database.
 */
export type LostFoundPageProps = {
  initialItems?: FoundItem[];
  createFoundItem: (input: {
    name: string;
    location: string;
    roomNumber: string | null;
    notes: string | null;
  }) => Promise<FoundItem>;
  setFoundItemStatus: (input: {
    id: number;
    status: FoundItemStatus;
  }) => Promise<FoundItem>;
  deleteFoundItem: (id: number) => Promise<void>;
};

/*
 * Dates sent from the server arrive as strings. Turn them back into Date
 * objects so the cards can format them. `claimedAt` stays null when unset.
 */
function toClientItem(item: FoundItem): FoundItem {
  return {
    ...item,
    createdAt: new Date(item.createdAt),
    claimedAt: item.claimedAt === null ? null : new Date(item.claimedAt),
  };
}

const LostFoundPage = function LostFoundPage({
  initialItems,
  createFoundItem,
  setFoundItemStatus,
  deleteFoundItem,
}: LostFoundPageProps) {
  const [items, setItems] = useState<FoundItem[]>(() =>
    (initialItems ?? []).map(toClientItem),
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onAdd(input: {
    name: string;
    location: string;
    roomNumber: string | null;
    notes: string | null;
  }) {
    try {
      const returned = await createFoundItem(input);
      // Newest first, so a new item goes on top.
      setItems((current) => [toClientItem(returned), ...current]);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage("Something went wrong. Try again.");
      // Rethrow so the form knows the save failed and keeps what was typed.
      throw error;
    }
  }

  async function onSetStatus(input: { id: number; status: FoundItemStatus }) {
    try {
      const returned = await setFoundItemStatus(input);
      // Replace the row where it already sits: the list stays sorted by date
      // found, so a card never jumps away while someone is clicking it.
      setItems((current) =>
        current.map((item) =>
          item.id === input.id ? toClientItem(returned) : item,
        ),
      );
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage("Something went wrong. Try again.");
      throw error;
    }
  }

  async function onDelete(id: number) {
    try {
      await deleteFoundItem(id);
      // filter keeps every item whose id is not the deleted one.
      setItems((current) => current.filter((item) => item.id !== id));
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage("Something went wrong. Try again.");
      throw error;
    }
  }

  return (
    <PageTemplate>
      <div className="mx-auto w-full max-w-4xl">
        {errorMessage ? (
          <p className="mb-4 text-red-600" role="alert">
            {errorMessage}
          </p>
        ) : null}
        <FoundItemList
          items={items}
          onAdd={onAdd}
          onSetStatus={onSetStatus}
          onDelete={onDelete}
        />
      </div>
    </PageTemplate>
  );
};

export { LostFoundPage };
export default LostFoundPage;
