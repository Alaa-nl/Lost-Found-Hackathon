"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button/Button";
import { Input } from "@/components/atoms/Input/Input";
import { Textarea } from "@/components/atoms/Textarea/Textarea";
import { type Todo } from "@/generated/prisma/browser";

export type TodoItemProps = {
  todo: Todo;
  onUpdate: (todo: Todo) => void | Promise<void>;
  onDelete: (id: number) => void | Promise<void>;
};

const TodoItem = function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function enterEdit() {
    setTitle(todo.title);
    setDescription(todo.description ?? "");
    setEditing(true);
  }

  async function handleSave() {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    if (trimmedTitle === "") {
      return;
    }
    setSaving(true);
    try {
      await onUpdate({
        ...todo,
        title: trimmedTitle,
        description: trimmedDescription === "" ? null : trimmedDescription,
      });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setEditing(false);
  }

  // delete the todo
  async function handleDelete() {
    setDeleting(true);
    try {
      // call the server action to delete the todo
      await onDelete(todo.id);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {editing ? (
        <>
          <label
            className="text-sm font-medium"
            htmlFor={`todo-item-title-${todo.id}`}
          >
            Title
          </label>
          <Input
            id={`todo-item-title-${todo.id}`}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <label
            className="text-sm font-medium"
            htmlFor={`todo-item-description-${todo.id}`}
          >
            Description
          </label>
          <Textarea
            id={`todo-item-description-${todo.id}`}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <p className="text-sm text-zinc-500">
            {todo.createdAt.toLocaleDateString("en-US")}
          </p>
          <Button
            variant="primary"
            disabled={title.trim() === "" || saving}
            onClick={handleSave}
          >
            Save
          </Button>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <p className="min-w-0 flex-1 font-semibold">{todo.title}</p>
            <p className="shrink-0 text-sm text-zinc-500">
              {todo.createdAt.toLocaleDateString("en-US")}
            </p>
            <div className="flex shrink-0 items-center gap-2">
              <Button size="sm" variant="secondary" onClick={enterEdit}>
                Edit
              </Button>
              <Button
                size="sm"
                variant="secondary"
                disabled={deleting}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
          {todo.description !== null ? (
            <p className="text-zinc-600">{todo.description}</p>
          ) : null}
        </>
      )}
    </div>
  );
};

export { TodoItem };
export default TodoItem;
