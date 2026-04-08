import type {
  ApiResponse,
  AuthResponse,
  Category,
  CreateCategoryInput,
  CreateTodoInput,
  LoginInput,
  RegisterInput,
  Tag,
  Todo,
  TodoFilters,
  UpdateTodoInput,
  User,
} from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const API = `${BASE_URL}/api/v1`;

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers,
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error?.message || `Request failed: ${res.status}`);
  }

  return json;
}

// Auth
export async function login(input: LoginInput): Promise<ApiResponse<AuthResponse>> {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function register(input: RegisterInput): Promise<ApiResponse<AuthResponse>> {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getMe(): Promise<ApiResponse<User>> {
  return request("/auth/me");
}

// Todos
export async function getTodos(
  filters: TodoFilters = {}
): Promise<ApiResponse<Todo[]>> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });
  const qs = params.toString();
  return request(`/todos${qs ? `?${qs}` : ""}`);
}

export async function getTodo(id: string): Promise<ApiResponse<Todo>> {
  return request(`/todos/${id}`);
}

export async function createTodo(input: CreateTodoInput): Promise<ApiResponse<Todo>> {
  return request("/todos", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateTodo(
  id: string,
  input: UpdateTodoInput
): Promise<ApiResponse<Todo>> {
  return request(`/todos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteTodo(id: string): Promise<ApiResponse<{ id: string }>> {
  return request(`/todos/${id}`, { method: "DELETE" });
}

export async function toggleTodo(id: string): Promise<ApiResponse<Todo>> {
  return request(`/todos/${id}/toggle`, { method: "PATCH" });
}

// Categories
export async function getCategories(): Promise<ApiResponse<Category[]>> {
  return request("/categories");
}

export async function createCategory(
  input: CreateCategoryInput
): Promise<ApiResponse<Category>> {
  return request("/categories", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateCategory(
  id: string,
  input: CreateCategoryInput
): Promise<ApiResponse<Category>> {
  return request(`/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteCategory(id: string): Promise<ApiResponse<{ id: string }>> {
  return request(`/categories/${id}`, { method: "DELETE" });
}

// Tags
export async function getTags(): Promise<ApiResponse<Tag[]>> {
  return request("/tags");
}

export async function createTag(name: string): Promise<ApiResponse<Tag>> {
  return request("/tags", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function deleteTag(id: string): Promise<ApiResponse<{ id: string }>> {
  return request(`/tags/${id}`, { method: "DELETE" });
}
