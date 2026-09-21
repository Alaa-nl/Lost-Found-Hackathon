"use client";
// ↑ Required because this file uses useState and event handlers.
// Server Components cannot hold state or respond to clicks; the browser can.

import { useState } from "react";
import { TodoList } from "@/components/organisms/TodoList/TodoList";
import { PageTemplate } from "@/components/templates/PageTemplate/PageTemplate";
import { type Todo } from "@/generated/prisma/browser";

/**
 * Props = data and functions this component receives from its parent.
 * The parent (`src/app/page.tsx`) loads todos on the server and passes
 * Server Actions here so this client component never talks to the database itself.
 */
export type TodoPageProps = {
  initialTodos?: Todo[];
  createTodo: (input: {
    title: string;
    description: string | null;
  }) => Promise<Todo>;
  updateTodo: (input: {
    id: number;
    title: string;
    description: string | null;
  }) => Promise<Todo>;
  deleteTodo: (id: number) => Promise<void>;
};

// Dates sent from the server arrive as strings. Turn them back into Date objects
// so the rest of the UI can call date methods safely.
function toClientTodo(todo: Todo): Todo {
  return { ...todo, createdAt: new Date(todo.createdAt) };
}

const TodoPage = function TodoPage({
  initialTodos,
  createTodo,
  updateTodo,
  deleteTodo,
}: TodoPageProps) {
  // useState: React re-renders this component whenever these values change.
  // The function form of the initial value runs once, so we don't remap the
  // array on every render.
  const [todos, setTodos] = useState<Todo[]>(() =>
    (initialTodos ?? []).map(toClientTodo),
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handlers below: call the injected Server Action, then update local state
  // with the returned row. We do not refetch the whole list.

  async function onAdd({
    title,
    description,
  }: {
    title: string;
    description: string | null;
  }) {
    try {
      const returned = await createTodo({ title, description });
      // Functional update: "current" is the latest list. Prepend the new todo.
      // Always return a new array — React ignores mutations of the old one.
      setTodos((current) => [toClientTodo(returned), ...current]);
      setErrorMessage(null);
    } catch (error) {
      // Keep the list as-is on failure. Generic copy — never show error.message.
      setErrorMessage("Something went wrong. Try again.");
      // Re-throw so the child (the form) knows the save failed and can keep its UI.
      throw error;
    }
  }

  async function onUpdate(todo: Todo) {
    try {
      const returned = await updateTodo({
        id: todo.id,
        title: todo.title,
        description: todo.description,
      });
      // Replace only the matching item; leave the rest unchanged.
      setTodos((current) =>
        current.map((item) =>
          item.id === todo.id ? toClientTodo(returned) : item,
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
      await deleteTodo(id);
      // filter keeps every item whose id is not the deleted one.
      setTodos((current) => current.filter((item) => item.id !== id));
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage("Something went wrong. Try again.");
      throw error;
    }
  }

  // JSX: describes the UI for this render. React updates the DOM to match.
  return (
    <PageTemplate>
      <div className="mx-auto w-full max-w-2xl">
        {/* Conditional render: show the alert only when there is an error. */}
        {errorMessage ? (
          <p className="mb-4 text-red-600" role="alert">
            {errorMessage}
          </p>
        ) : null}
        {/* pass the data and functions to the TodoList component */}
        <TodoList
          todos={todos}
          onAdd={onAdd}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      </div>
    </PageTemplate>
  );
};

export { TodoPage };
export default TodoPage;
