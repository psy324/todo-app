export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Category {
  id: string;
  name: string;
  color: string | null;
  todoCount?: number;
}

export interface Tag {
  id: string;
  name: string;
  todoCount?: number;
}

export interface Todo {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  dueDate: string | null;
  category: Category | null;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export interface TodoFilters {
  page?: number;
  limit?: number;
  completed?: boolean;
  categoryId?: string;
  tag?: string;
  search?: string;
  sortBy?: "dueDate" | "createdAt" | "title";
  order?: "asc" | "desc";
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  dueDate?: string;
  categoryId?: string;
  tagIds?: string[];
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  completed?: boolean;
  dueDate?: string | null;
  categoryId?: string | null;
  tagIds?: string[];
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface CreateCategoryInput {
  name: string;
  color?: string;
}
