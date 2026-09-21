"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button/Button";
import {
  StatusBadge,
  type FoundItemStatus,
} from "@/components/atoms/StatusBadge/StatusBadge";
import { type FoundItem } from "@/generated/prisma/browser";

export type FoundItemCardProps = {
  item: FoundItem;
  onSetStatus: (input: {
    id: number;
    status: FoundItemStatus;
  }) => void | Promise<void>;
  onDelete: (id: number) => void | Promise<void>;
};

/*
 * Dates read as "21 Sep 2026" everywhere in the app.
 * `formatToParts` lets us cap the month at three letters: the en-GB short month
 * for September is "Sept", which would make the cards line up unevenly.
 */
const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatDate(date: Date): string {
  return dateFormatter
    .formatToParts(date)
    .map((part) => (part.type === "month" ? part.value.slice(0, 3) : part.value))
    .join("");
}

const FoundItemCard = function FoundItemCard({
  item,
  onSetStatus,
  onDelete,
}: FoundItemCardProps) {
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // The database column is a plain string, so narrow it once here.
  const status: FoundItemStatus =
    item.status === "claimed" ? "claimed" : "waiting";
  const isClaimed = status === "claimed";

  // Claiming is one way: once the guest has the item back there is nothing to
  // undo, so a claimed card shows no status button at all.
  async function handleClaim() {
    setUpdating(true);
    try {
      await onSetStatus({ id: item.id, status: "claimed" });
    } catch {
      // The page shows the alert; swallow here so nothing escapes the handler.
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await onDelete(item.id);
    } catch {
      // The page shows the alert; swallow here so nothing escapes the handler.
    } finally {
      setDeleting(false);
    }
  }

  const cardClasses = [
    "flex h-full flex-col gap-2 border border-zinc-200 bg-white p-4",
    isClaimed ? "opacity-75" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={cardClasses}>
      <div className="flex items-start gap-3">
        <h3 className="min-w-0 flex-1 font-semibold">{item.name}</h3>
        <StatusBadge status={status} />
      </div>

      <p className="text-zinc-600">Found at: {item.location}</p>
      {item.roomNumber !== null ? (
        <p className="text-zinc-600">Room {item.roomNumber}</p>
      ) : null}
      {item.notes !== null ? <p className="text-zinc-600">{item.notes}</p> : null}

      <p className="text-sm text-zinc-500">
        Found on {formatDate(item.createdAt)}
      </p>
      {item.claimedAt !== null ? (
        <p className="text-sm text-zinc-500">
          Claimed on {formatDate(item.claimedAt)}
        </p>
      ) : null}

      <div className="mt-auto flex items-center gap-2 pt-2">
        {isClaimed ? null : (
          <Button
            size="sm"
            variant="primary"
            disabled={updating}
            onClick={handleClaim}
          >
            Mark claimed
          </Button>
        )}
        <Button
          size="sm"
          variant="secondary"
          disabled={deleting}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </div>
    </article>
  );
};

export { FoundItemCard };
export default FoundItemCard;
