"use client";

import type { Todo } from "@/types";
import { TagBadge } from "@/components/tag/TagBadge";

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
}

function isOverdue(dateStr: string | null): boolean {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const overdue = !todo.completed && isOverdue(todo.dueDate);

  return (
    <div
      className="todo-item"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        padding: "12px 14px 12px 12px",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderLeft: `3px solid ${
          todo.completed
            ? "var(--border)"
            : overdue
              ? "var(--overdue)"
              : todo.category?.color || "var(--border-mid)"
        }`,
        borderRadius: "var(--radius)",
        transition: "border-color var(--transition), background var(--transition)",
        opacity: todo.completed ? 0.55 : 1,
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        if (!todo.completed)
          (e.currentTarget as HTMLElement).style.background =
            "var(--surface-elevated)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "var(--surface)";
      }}
    >
      {/* Checkbox */}
      <button
        onClick={onToggle}
        title={todo.completed ? "미완료로 변경" : "완료 처리"}
        style={{
          flexShrink: 0,
          marginTop: "1px",
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          border: `1.5px solid ${todo.completed ? "var(--gold)" : "var(--border-mid)"}`,
          background: todo.completed ? "var(--gold)" : "transparent",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all var(--transition)",
          padding: 0,
        }}
        onMouseEnter={(e) => {
          if (!todo.completed) {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--gold)";
            (e.currentTarget as HTMLElement).style.background = "var(--gold-bg)";
          }
        }}
        onMouseLeave={(e) => {
          if (!todo.completed) {
            (e.currentTarget as HTMLElement).style.borderColor =
              "var(--border-mid)";
            (e.currentTarget as HTMLElement).style.background = "transparent";
          }
        }}
      >
        {todo.completed && (
          <svg
            width="8"
            height="6"
            viewBox="0 0 8 6"
            fill="none"
            style={{ animation: "checkPop 200ms ease" }}
          >
            <path
              d="M1 3l2 2 4-4"
              stroke="#0C0B09"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: todo.completed ? "var(--text-3)" : "var(--text)",
              textDecoration: todo.completed ? "line-through" : "none",
              textDecorationColor: "var(--border-accent)",
              lineHeight: 1.4,
            }}
          >
            {todo.title}
          </span>
          {todo.category && (
            <span
              style={{
                fontSize: "10px",
                padding: "1px 7px",
                borderRadius: "10px",
                color: todo.category.color || "var(--text-3)",
                background: `${todo.category.color}18` || "var(--surface-elevated)",
                border: `1px solid ${todo.category.color}40` || "var(--border)",
                fontWeight: 500,
                flexShrink: 0,
                lineHeight: 1.6,
              }}
            >
              {todo.category.name}
            </span>
          )}
        </div>

        {todo.description && (
          <p
            style={{
              marginTop: "2px",
              fontSize: "12px",
              color: "var(--text-3)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {todo.description}
          </p>
        )}

        {(todo.tags.length > 0 || todo.dueDate) && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "5px",
              flexWrap: "wrap",
            }}
          >
            {todo.tags.map((tag) => (
              <TagBadge key={tag.id} tag={tag} />
            ))}
            {todo.dueDate && (
              <span
                style={{
                  fontSize: "11px",
                  color: overdue ? "var(--overdue)" : "var(--text-3)",
                  fontFamily: "var(--font-mono)",
                  fontWeight: overdue ? 500 : 400,
                }}
              >
                {overdue ? "⚠ " : ""}
                {formatDate(todo.dueDate)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div
        className="todo-actions"
        style={{ display: "flex", alignItems: "center", gap: "2px", flexShrink: 0 }}
      >
        <button onClick={onEdit} className="btn-icon" title="수정" style={{ width: "26px", height: "26px" }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M8.5 1.5a1.414 1.414 0 012 2L3.5 10.5l-3 .5.5-3 7.5-6.5z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button onClick={onDelete} className="btn-icon danger" title="삭제" style={{ width: "26px", height: "26px" }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M1.5 3h9M4.5 3V2h3v1M5 5.5v3M7 5.5v3M2 3l.75 7.5h6.5L10 3"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
