"use client";

import { type FoundItemStatus } from "@/components/atoms/StatusBadge/StatusBadge";
import { FoundItemCard } from "@/components/molecules/FoundItemCard/FoundItemCard";
import { FoundItemForm } from "@/components/molecules/FoundItemForm/FoundItemForm";
import { type FoundItem } from "@/generated/prisma/browser";

export type FoundItemListProps = {
  items: FoundItem[];
  onAdd: (item: {
    name: string;
    location: string;
    roomNumber: string | null;
    notes: string | null;
  }) => void | Promise<void>;
  onSetStatus: (input: {
    id: number;
    status: FoundItemStatus;
  }) => void | Promise<void>;
  onDelete: (id: number) => void | Promise<void>;
};

const FoundItemList = function FoundItemList({
  items,
  onAdd,
  onSetStatus,
  onDelete,
}: FoundItemListProps) {
  return (
    <div className="flex min-w-80 flex-col gap-6">
      <FoundItemForm onAdd={onAdd} />
      {items.length === 0 ? <p>No items yet</p> : null}
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map((item) => (
          <li key={item.id}>
            <FoundItemCard
              item={item}
              onSetStatus={onSetStatus}
              onDelete={onDelete}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export { FoundItemList };
export default FoundItemList;
