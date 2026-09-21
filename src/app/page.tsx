/*
 * Next.js App Router route for `/`.
 * Loads the found items and injects Server Actions into the page component.
 *
 * This is the root page of the application.
 */

// server side, DB code and actions
import { createFoundItem } from "@/actions/foundItem/createFoundItem/createFoundItem";
import { deleteFoundItem } from "@/actions/foundItem/deleteFoundItem/deleteFoundItem";
import { listFoundItems } from "@/actions/foundItem/listFoundItems/listFoundItems";
import { setFoundItemStatus } from "@/actions/foundItem/setFoundItemStatus/setFoundItemStatus";

// the main client component
import { LostFoundPage } from "@/components/pages/LostFoundPage/LostFoundPage";

// Render this route on every request so listFoundItems() always returns current DB rows.
export const dynamic = "force-dynamic";

export default async function Home() {
  const initialItems = await listFoundItems();
  // main client component with server side actions passed as props
  return (
    <LostFoundPage
      initialItems={initialItems}
      createFoundItem={createFoundItem}
      setFoundItemStatus={setFoundItemStatus}
      deleteFoundItem={deleteFoundItem}
    />
  );
}
