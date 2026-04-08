"use client";

import type { TodoFilters } from "@/types";

interface TodoFilterProps {
  filters: TodoFilters;
  onFilterChange: (filters: Partial<TodoFilters>) => void;
}

const selectStyle: React.CSSProperties = {
  padding: "6px 24px 6px 10px",
  fontSize: "12px",
  background: "var(--surface)",
  border: "1px solid var(--border)",
  color: "var(--text-2)",
  borderRadius: "var(--radius)",
  cursor: "pointer",
};

export function TodoFilter({ filters, onFilterChange }: TodoFilterProps) {
  const statusValue =
    filters.completed === undefined
      ? "all"
      : filters.completed
        ? "true"
        : "false";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
      {/* Search */}
      <div style={{ position: "relative" }}>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{
            position: "absolute",
            left: "9px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-3)",
            pointerEvents: "none",
          }}
        >
          <circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.3" />
          <path
            d="M8 8l2 2"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
        <input
          type="text"
          placeholder="검색..."
          value={filters.search || ""}
          onChange={(e) => onFilterChange({ search: e.target.value || undefined })}
          style={{
            padding: "6px 10px 6px 28px",
            fontSize: "12px",
            width: "150px",
          }}
        />
      </div>

      {/* Status filter */}
      <select
        value={statusValue}
        onChange={(e) => {
          const val = e.target.value;
          onFilterChange({
            completed:
              val === "all" ? undefined : val === "true" ? true : false,
          });
        }}
        style={selectStyle}
      >
        <option value="all">전체</option>
        <option value="false">미완료</option>
        <option value="true">완료</option>
      </select>

      {/* Sort */}
      <select
        value={`${filters.sortBy || "createdAt"}_${filters.order || "desc"}`}
        onChange={(e) => {
          const [sortBy, order] = e.target.value.split("_") as [
            TodoFilters["sortBy"],
            TodoFilters["order"],
          ];
          onFilterChange({ sortBy, order });
        }}
        style={selectStyle}
      >
        <option value="createdAt_desc">최신순</option>
        <option value="createdAt_asc">오래된순</option>
        <option value="dueDate_asc">마감일순</option>
        <option value="title_asc">이름순</option>
      </select>
    </div>
  );
}
