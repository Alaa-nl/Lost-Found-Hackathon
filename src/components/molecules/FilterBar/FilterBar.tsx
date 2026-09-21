"use client";

import { Button } from "@/components/atoms/Button/Button";
import { Input } from "@/components/atoms/Input/Input";

/** "all" is a view filter only; it is never a stored item status. */
export type StatusFilter = "all" | "waiting" | "claimed";

export type FilterBarProps = {
  status: StatusFilter;
  search: string;
  onStatusChange: (status: StatusFilter) => void;
  onSearchChange: (search: string) => void;
};

const tabs: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "waiting", label: "Waiting" },
  { value: "claimed", label: "Claimed" },
];

const FilterBar = function FilterBar({
  status,
  search,
  onStatusChange,
  onSearchChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* A tablist tells a screen reader these three buttons are one choice. */}
      <div className="flex gap-2" role="tablist" aria-label="Filter by status">
        {tabs.map((tab) => (
          <Button
            key={tab.value}
            size="sm"
            role="tab"
            aria-selected={status === tab.value}
            variant={status === tab.value ? "primary" : "secondary"}
            onClick={() => onStatusChange(tab.value)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <div className="sm:w-64">
        <label className="sr-only" htmlFor="filter-bar-search">
          Search by name
        </label>
        <Input
          id="filter-bar-search"
          type="search"
          placeholder="Search by name"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
    </div>
  );
};

export { FilterBar };
export default FilterBar;
