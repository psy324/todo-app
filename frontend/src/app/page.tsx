"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTodos, useToggleTodo, useDeleteTodo } from "@/hooks/useTodos";
import { useCategories } from "@/hooks/useCategories";
import { TodoList } from "@/components/todo/TodoList";
import { TodoForm } from "@/components/todo/TodoForm";
import { TodoFilter } from "@/components/todo/TodoFilter";
import { CategoryList } from "@/components/category/CategoryList";
import type { TodoFilters } from "@/types";

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth();
  const [filters, setFilters] = useState<TodoFilters>({ page: 1, limit: 20 });
  const [showForm, setShowForm] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);

  const { data: todosRes, isLoading: todosLoading } = useTodos(filters);
  const { data: categoriesRes } = useCategories();
  const toggleTodo = useToggleTodo();
  const deleteTodo = useDeleteTodo();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || !isAuthenticated) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            width: "20px",
            height: "20px",
            border: "2px solid var(--border-mid)",
            borderTopColor: "var(--gold)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
      </div>
    );
  }

  const todos = todosRes?.data ?? [];
  const meta = todosRes?.meta;
  const categories = categoriesRes?.data ?? [];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "var(--header-height) 1fr",
        gridTemplateColumns: "var(--sidebar-width) 1fr",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <header
        style={{
          gridColumn: "1 / -1",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px 0 24px",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "17px",
              fontWeight: 600,
              color: "var(--text)",
              letterSpacing: "-0.2px",
            }}
          >
            나의 할 일
          </span>
          {meta && (
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--text-3)",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                padding: "1px 6px",
              }}
            >
              {meta.total}
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span
            style={{
              fontSize: "13px",
              color: "var(--text-2)",
            }}
          >
            {user?.name}
          </span>
          <div
            style={{
              width: "1px",
              height: "14px",
              background: "var(--border-mid)",
            }}
          />
          <button
            onClick={logout}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-3)",
              fontSize: "13px",
              cursor: "pointer",
              padding: 0,
              transition: "color var(--transition)",
              fontFamily: "var(--font-sans)",
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLElement).style.color = "var(--red)")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLElement).style.color = "var(--text-3)")
            }
          >
            로그아웃
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        style={{
          borderRight: "1px solid var(--border)",
          padding: "20px 16px",
          overflowY: "auto",
          position: "sticky",
          top: "var(--header-height)",
          height: "calc(100vh - var(--header-height))",
        }}
      >
        <CategoryList
          categories={categories}
          selectedCategoryId={filters.categoryId}
          onSelect={(categoryId) =>
            setFilters((prev) => ({ ...prev, categoryId, page: 1 }))
          }
        />
      </aside>

      {/* Main */}
      <main
        style={{
          padding: "24px 28px",
          overflowY: "auto",
          minHeight: "calc(100vh - var(--header-height))",
        }}
      >
        {/* Toolbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <TodoFilter
            filters={filters}
            onFilterChange={(newFilters) =>
              setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
            }
          />
          <button
            onClick={() => {
              setEditingTodoId(null);
              setShowForm((v) => !v);
            }}
            className="btn-primary"
            style={{ padding: "7px 14px", flexShrink: 0 }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M6 1v10M1 6h10"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            할 일 추가
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div style={{ marginBottom: "16px" }} className="animate-fade-slide">
            <TodoForm
              categories={categories}
              editingTodoId={editingTodoId}
              onClose={() => {
                setShowForm(false);
                setEditingTodoId(null);
              }}
            />
          </div>
        )}

        {/* List */}
        {todosLoading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "60px",
              color: "var(--text-3)",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                border: "2px solid var(--border)",
                borderTopColor: "var(--gold)",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <span style={{ fontSize: "13px" }}>로딩 중...</span>
          </div>
        ) : todos.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px 0",
              gap: "12px",
              animation: "fadeIn 300ms ease",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "1px solid var(--border-mid)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 3v10M3 8h10"
                  stroke="var(--text-3)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p style={{ color: "var(--text-3)", fontSize: "13px" }}>
              할 일이 없습니다
            </p>
          </div>
        ) : (
          <TodoList
            todos={todos}
            onToggle={(id) => toggleTodo.mutate(id)}
            onDelete={(id) => {
              if (confirm("삭제하시겠습니까?")) deleteTodo.mutate(id);
            }}
            onEdit={(id) => {
              setEditingTodoId(id);
              setShowForm(true);
            }}
          />
        )}

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginTop: "28px",
            }}
          >
            <button
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  page: Math.max(1, (prev.page ?? 1) - 1),
                }))
              }
              disabled={meta.page <= 1}
              className="btn-ghost"
              style={{ padding: "5px 12px" }}
            >
              이전
            </button>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                color: "var(--text-2)",
                padding: "0 8px",
              }}
            >
              {meta.page} / {meta.totalPages}
            </span>
            <button
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  page: Math.min(meta.totalPages, (prev.page ?? 1) + 1),
                }))
              }
              disabled={meta.page >= meta.totalPages}
              className="btn-ghost"
              style={{ padding: "5px 12px" }}
            >
              다음
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
