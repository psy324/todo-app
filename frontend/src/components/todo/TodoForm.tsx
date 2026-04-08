"use client";

import { useState, useEffect } from "react";
import { useCreateTodo, useUpdateTodo } from "@/hooks/useTodos";
import * as api from "@/lib/api";
import type { Category, Tag } from "@/types";

interface TodoFormProps {
  categories: Category[];
  editingTodoId: string | null;
  onClose: () => void;
}

export function TodoForm({ categories, editingTodoId, onClose }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);

  const createTodo = useCreateTodo();
  const updateTodo = useUpdateTodo();

  useEffect(() => {
    api.getTags().then((res) => setAllTags(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (editingTodoId) {
      api.getTodo(editingTodoId).then((res) => {
        const todo = res.data;
        setTitle(todo.title);
        setDescription(todo.description || "");
        setDueDate(todo.dueDate ? todo.dueDate.slice(0, 16) : "");
        setCategoryId(todo.category?.id || "");
        setSelectedTagIds(todo.tags.map((t) => t.id));
      }).catch(() => {});
    }
  }, [editingTodoId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      description: description || undefined,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      categoryId: categoryId || undefined,
      tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
    };
    if (editingTodoId) {
      updateTodo.mutate({ id: editingTodoId, input: payload }, { onSuccess: onClose });
    } else {
      createTodo.mutate(payload, { onSuccess: onClose });
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const isPending = createTodo.isPending || updateTodo.isPending;

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "var(--surface-elevated)",
        border: "1px solid var(--border-mid)",
        borderTop: "2px solid var(--gold)",
        borderRadius: "var(--radius)",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "15px",
            fontWeight: 500,
            color: "var(--text)",
            letterSpacing: "-0.1px",
          }}
        >
          {editingTodoId ? "할 일 수정" : "새 할 일"}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="btn-icon"
          style={{ width: "24px", height: "24px" }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M1.5 1.5l7 7M8.5 1.5l-7 7"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Title */}
      <div>
        <label className="form-label">제목 *</label>
        <input
          type="text"
          required
          maxLength={200}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="무엇을 할 건가요?"
          autoFocus
          style={{ width: "100%", padding: "9px 12px" }}
        />
      </div>

      {/* Description */}
      <div>
        <label className="form-label">설명</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="추가 메모..."
          maxLength={2000}
          rows={2}
          style={{
            width: "100%",
            padding: "9px 12px",
            resize: "none",
          }}
        />
      </div>

      {/* Date + Category */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <div>
          <label className="form-label">마감일</label>
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{ width: "100%", padding: "8px 10px", fontSize: "12px" }}
          />
        </div>
        <div>
          <label className="form-label">카테고리</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            style={{ width: "100%", padding: "8px 24px 8px 10px", fontSize: "12px" }}
          >
            <option value="">없음</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tags */}
      {allTags.length > 0 && (
        <div>
          <label className="form-label">태그</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {allTags.map((tag) => {
              const selected = selectedTagIds.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  style={{
                    padding: "3px 10px",
                    borderRadius: "10px",
                    border: `1px solid ${selected ? "var(--border-accent)" : "var(--border)"}`,
                    background: selected ? "var(--gold-bg)" : "transparent",
                    color: selected ? "var(--gold-light)" : "var(--text-3)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    cursor: "pointer",
                    transition: "all var(--transition)",
                  }}
                >
                  #{tag.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "8px",
          paddingTop: "4px",
          borderTop: "1px solid var(--border)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="btn-ghost"
          style={{ padding: "7px 14px" }}
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary"
          style={{ padding: "7px 16px" }}
        >
          {isPending ? "저장 중..." : editingTodoId ? "수정" : "추가"}
        </button>
      </div>
    </form>
  );
}
