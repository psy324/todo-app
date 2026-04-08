"use client";

import type { Todo } from "@/types";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export function TodoList({ todos, onToggle, onDelete, onEdit }: TodoListProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {todos.map((todo, i) => (
        <div
          key={todo.id}
          style={{
            animation: `fadeSlideDown ${180 + i * 30}ms ease forwards`,
            opacity: 0,
          }}
        >
          <TodoItem
            todo={todo}
            onToggle={() => onToggle(todo.id)}
            onDelete={() => onDelete(todo.id)}
            onEdit={() => onEdit(todo.id)}
          />
        </div>
      ))}
    </div>
  );
}
