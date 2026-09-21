/*
 * Atomic Design atom. Colour comes from the status union, not from the caller.
 */
import { forwardRef, type ComponentProps } from "react";

/*
 * Type-only copy of the status union. Declared here so UI never imports from
 * `@/actions/...` (see AGENTS.md: UI must not import actions or Prisma).
 */
export type FoundItemStatus = "waiting" | "claimed";

export type StatusBadgeProps = Omit<ComponentProps<"span">, "ref"> & {
  status: FoundItemStatus;
};

const statusClasses = {
  waiting: "bg-orange-100 text-orange-800",
  claimed: "bg-green-100 text-green-800",
};

const statusLabels = {
  waiting: "Waiting",
  claimed: "Claimed",
};

const baseClasses =
  "inline-flex items-center px-2.5 py-0.5 text-sm font-medium rounded-full";

const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(
  function StatusBadge({ status, className, ...props }, ref) {
    const classes = [baseClasses, statusClasses[status], className]
      .filter(Boolean)
      .join(" ");

    return (
      <span {...props} ref={ref} className={classes}>
        {statusLabels[status]}
      </span>
    );
  },
);

export { StatusBadge };
export default StatusBadge;
