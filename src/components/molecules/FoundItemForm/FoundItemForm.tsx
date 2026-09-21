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
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <label className="text-sm font-medium" htmlFor="found-item-form-name">
        Item name
      </label>
      <Input
        id="found-item-form-name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <label className="text-sm font-medium" htmlFor="found-item-form-location">
        Found at
      </label>
      <Input
        id="found-item-form-location"
        value={location}
        onChange={(event) => setLocation(event.target.value)}
      />
      <label className="text-sm font-medium" htmlFor="found-item-form-room">
        Room number
      </label>
      <Input
        id="found-item-form-room"
        value={roomNumber}
        onChange={(event) => setRoomNumber(event.target.value)}
      />
      <label className="text-sm font-medium" htmlFor="found-item-form-notes">
        Notes
      </label>
      <Textarea
        id="found-item-form-notes"
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
      />
      <Button type="submit" variant="primary" disabled={!canSubmit || adding}>
        Add
      </Button>
    </form>
  );
};

export { FoundItemForm };
export default FoundItemForm;
