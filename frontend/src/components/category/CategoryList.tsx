"use client";

import { useState } from "react";
import type { Category } from "@/types";
import { useCreateCategory, useDeleteCategory } from "@/hooks/useCategories";

interface CategoryListProps {
  categories: Category[];
  selectedCategoryId?: string;
  onSelect: (categoryId: string | undefined) => void;
}

export function CategoryList({
  categories,
  selectedCategoryId,
  onSelect,
}: CategoryListProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#C09030");
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    createCategory.mutate(
      { name: newName.trim(), color: newColor },
      {
        onSuccess: () => {
          setNewName("");
          setShowAdd(false);
        },
      }
    );
  };

  const totalCount = categories.reduce((s, c) => s + (c.todoCount ?? 0), 0);

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "8px",
          paddingBottom: "8px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <span
          style={{
            fontSize: "10px",
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--text-3)",
          }}
        >
          카테고리
        </span>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="btn-icon"
          title="카테고리 추가"
          style={{ width: "20px", height: "20px" }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            {showAdd ? (
              <path
                d="M2 2l6 6M8 2l-6 6"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M5 1v8M1 5h8"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <form
          onSubmit={handleAdd}
          style={{
            marginBottom: "8px",
            padding: "10px",
            background: "var(--surface-elevated)",
            border: "1px solid var(--border-mid)",
            borderRadius: "var(--radius)",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
          className="animate-fade-slide"
        >
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="카테고리명"
            maxLength={50}
            autoFocus
            style={{ width: "100%", padding: "6px 8px", fontSize: "12px" }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                style={{
                  width: "28px",
                  height: "28px",
                  padding: "2px",
                  border: "1px solid var(--border-mid)",
                  borderRadius: "4px",
                  cursor: "pointer",
                  background: "var(--surface)",
                }}
              />
            </div>
            <button
              type="submit"
              disabled={createCategory.isPending || !newName.trim()}
              className="btn-primary"
              style={{ flex: 1, padding: "6px", justifyContent: "center", fontSize: "12px" }}
            >
              추가
            </button>
          </div>
        </form>
      )}

      {/* Category items */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
        {/* 전체 */}
        <button
          onClick={() => onSelect(undefined)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            width: "100%",
            padding: "6px 8px",
            borderRadius: "var(--radius)",
            border: "none",
            background: !selectedCategoryId ? "var(--gold-bg)" : "transparent",
            color: !selectedCategoryId ? "var(--gold-light)" : "var(--text-2)",
            cursor: "pointer",
            textAlign: "left",
            transition: "background var(--transition), color var(--transition)",
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
          }}
          onMouseEnter={(e) => {
            if (selectedCategoryId)
              (e.currentTarget as HTMLElement).style.background =
                "var(--surface-hover)";
          }}
          onMouseLeave={(e) => {
            if (selectedCategoryId)
              (e.currentTarget as HTMLElement).style.background = "transparent";
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: !selectedCategoryId
                ? "var(--gold)"
                : "var(--border-mid)",
              flexShrink: 0,
              transition: "background var(--transition)",
            }}
          />
          <span style={{ flex: 1, fontWeight: !selectedCategoryId ? 500 : 400 }}>
            전체
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "var(--text-3)",
            }}
          >
            {totalCount}
          </span>
        </button>

        {/* Individual categories */}
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <div
              key={cat.id}
              className="category-item"
              style={{ display: "flex", alignItems: "center", gap: "2px" }}
            >
              <button
                onClick={() => onSelect(isSelected ? undefined : cat.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flex: 1,
                  padding: "6px 8px",
                  borderRadius: "var(--radius)",
                  border: "none",
                  background: isSelected ? "var(--gold-bg)" : "transparent",
                  color: isSelected ? "var(--gold-light)" : "var(--text-2)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background var(--transition), color var(--transition)",
                  fontFamily: "var(--font-sans)",
                  fontSize: "13px",
                  minWidth: 0,
                }}
                onMouseEnter={(e) => {
                  if (!isSelected)
                    (e.currentTarget as HTMLElement).style.background =
                      "var(--surface-hover)";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected)
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: cat.color || "var(--border-mid)",
                    flexShrink: 0,
                    boxShadow: isSelected
                      ? `0 0 6px ${cat.color || "transparent"}80`
                      : "none",
                    transition: "box-shadow var(--transition)",
                  }}
                />
                <span
                  style={{
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontWeight: isSelected ? 500 : 400,
                  }}
                >
                  {cat.name}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    color: "var(--text-3)",
                    flexShrink: 0,
                  }}
                >
                  {cat.todoCount ?? 0}
                </span>
              </button>
              <button
                onClick={() => {
                  if (confirm(`"${cat.name}" 카테고리를 삭제하시겠습니까?`))
                    deleteCategory.mutate(cat.id);
                }}
                className="btn-icon danger category-delete-btn"
                title="삭제"
                style={{
                  width: "22px",
                  height: "22px",
                  flexShrink: 0,
                  opacity: 0,
                  transition: "opacity var(--transition), color var(--transition), background var(--transition)",
                }}
              >
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <path
                    d="M1.5 1.5l6 6M7.5 1.5l-6 6"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
