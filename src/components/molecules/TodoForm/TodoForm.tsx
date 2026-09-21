"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/atoms/Button/Button";
import { Input } from "@/components/atoms/Input/Input";
import { Textarea } from "@/components/atoms/Textarea/Textarea";

export type TodoFormProps = {
  onAdd: (item: {
    title: string;
    description: string | null;
  }) => void | Promise<void>;
};

const TodoForm = function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [adding, setAdding] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    if (trimmedTitle === "") {
      return;
    }
    setAdding(true);
    try {
      await onAdd({
        title: trimmedTitle,
        description: trimmedDescription === "" ? null : trimmedDescription,
      });
      setTitle("");
      setDescription("");
    } finally {
      setAdding(false);
    }
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <label className="text-sm font-medium" htmlFor="todo-form-title">
        Title
      </label>
      <Input
        id="todo-form-title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <label className="text-sm font-medium" htmlFor="todo-form-description">
        Description
      </label>
      <Textarea
        id="todo-form-description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      <Button
        type="submit"
        variant="primary"
        disabled={title.trim() === "" || adding}
      >
        Add
      </Button>
    </form>
  );
};

export { TodoForm };
export default TodoForm;
