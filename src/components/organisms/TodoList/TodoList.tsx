"use client";

import { TodoForm } from "@/components/molecules/TodoForm/TodoForm";
import { TodoItem } from "@/components/molecules/TodoItem/TodoItem";
import { type Todo } from "@/generated/prisma/browser";

export type TodoListProps = {
  todos: Todo[];
  onAdd: (item: {
    title: string;
    description: string | null;
  }) => void | Promise<void>;
  onUpdate: (todo: Todo) => void | Promise<void>;
  onDelete: (id: number) => void | Promise<void>;
};

const TodoList = function TodoList({
  todos,
  onAdd,
  onUpdate,
  onDelete,
}: TodoListProps) {
  return (
    <div className="flex min-w-80 flex-col gap-6">
      <TodoForm onAdd={onAdd} />
      {todos.length === 0 ? <p>No todos yet.</p> : null}
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {/* TodoItem receives individual todo and functions to update and delete it (ultimately these are executed by the server actions) */}
            <TodoItem todo={todo} onUpdate={onUpdate} onDelete={onDelete} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export { TodoList };
export default TodoList;
