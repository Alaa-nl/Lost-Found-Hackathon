"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/atoms/Button/Button";
import { Input } from "@/components/atoms/Input/Input";
import { Textarea } from "@/components/atoms/Textarea/Textarea";

export type FoundItemFormProps = {
  onAdd: (item: {
    name: string;
    location: string;
    roomNumber: string | null;
    notes: string | null;
  }) => void | Promise<void>;
};

const FoundItemForm = function FoundItemForm({ onAdd }: FoundItemFormProps) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [adding, setAdding] = useState(false);

  // Both required fields must hold more than whitespace before we allow a save.
  const canSubmit = name.trim() !== "" && location.trim() !== "";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }
    setAdding(true);
    try {
      await onAdd({
        name: name.trim(),
        location: location.trim(),
        roomNumber: roomNumber.trim() === "" ? null : roomNumber.trim(),
        notes: notes.trim() === "" ? null : notes.trim(),
      });
      // Only reached when the callback resolved: clearing a form after a failed
      // save would throw away what the user typed.
      setName("");
      setLocation("");
      setRoomNumber("");
      setNotes("");
    } catch {
      // The page shows the alert. Here we only keep the fields as they are,
      // and we swallow the error so it does not escape this event handler.
    } finally {
      setAdding(false);
    }
  }

  return (
    <form
      className="flex flex-col gap-4 border border-zinc-200 bg-white p-4"
      onSubmit={handleSubmit}
    >
      <div>
        <h2 className="font-semibold text-black">Log a found item</h2>
        <p className="text-sm text-zinc-500">
          Fields marked * are required.
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <label
          className="text-sm font-medium text-black"
          htmlFor="found-item-form-name"
        >
          Item name{" "}
          <span aria-hidden="true" className="text-red-600">
            *
          </span>
        </label>
        <Input
          id="found-item-form-name"
          placeholder="Black iPhone"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <p className="text-xs text-zinc-500">What the item is.</p>
      </div>

      <div className="flex flex-col gap-1">
        <label
          className="text-sm font-medium text-black"
          htmlFor="found-item-form-location"
        >
          Found at{" "}
          <span aria-hidden="true" className="text-red-600">
            *
          </span>
        </label>
        <Input
          id="found-item-form-location"
          placeholder="Lobby"
          required
          value={location}
          onChange={(event) => setLocation(event.target.value)}
        />
        <p className="text-xs text-zinc-500">Where in the hotel it was found.</p>
      </div>

      <div className="flex flex-col gap-1">
        <label
          className="text-sm font-medium text-black"
          htmlFor="found-item-form-room"
        >
          Room number
        </label>
        <Input
          id="found-item-form-room"
          placeholder="204"
          value={roomNumber}
          onChange={(event) => setRoomNumber(event.target.value)}
        />
        <p className="text-xs text-zinc-500">
          The guest room, if you know it.
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <label
          className="text-sm font-medium text-black"
          htmlFor="found-item-form-notes"
        >
          Notes
        </label>
        <Textarea
          id="found-item-form-notes"
          placeholder="Cracked screen, in a red case"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
        <p className="text-xs text-zinc-500">
          Anything that helps identify it.
        </p>
      </div>

      <Button type="submit" variant="primary" disabled={!canSubmit || adding}>
        Add
      </Button>
    </form>
  );
};

export { FoundItemForm };
export default FoundItemForm;
