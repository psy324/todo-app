import { z } from 'zod';

// Auth
export const registerSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요.'),
  password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다.'),
  name: z.string().min(1, '이름을 입력해주세요.').max(50),
});

export const loginSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

// Todo
export const createTodoSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.').max(200),
  description: z.string().max(2000).optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.number().int().min(0).max(3).optional(),
  categoryId: z.string().uuid().optional(),
  tagIds: z.array(z.string().uuid()).optional(),
  recurrenceRule: z.string().max(100).optional(),
});

export const updateTodoSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).nullable().optional(),
  dueDate: z.string().datetime().nullable().optional(),
  priority: z.number().int().min(0).max(3).optional(),
  categoryId: z.string().uuid().nullable().optional(),
  tagIds: z.array(z.string().uuid()).optional(),
  recurrenceRule: z.string().max(100).nullable().optional(),
});

export const todoQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['createdAt', 'dueDate', 'title', 'updatedAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  categoryId: z.string().uuid().optional(),
  tag: z.string().uuid().optional(),
  completed: z.enum(['true', 'false']).optional(),
  search: z.string().max(100).optional(),
});

// Category
export const createCategorySchema = z.object({
  name: z.string().min(1, '카테고리명을 입력해주세요.').max(50),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, '유효한 HEX 색상 코드를 입력해주세요.').optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, '카테고리명을 입력해주세요.').max(50).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, '유효한 HEX 색상 코드를 입력해주세요.').nullable().optional(),
});

// Tag
export const createTagSchema = z.object({
  name: z.string().min(1, '태그명을 입력해주세요.').max(30),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type TodoQueryInput = z.infer<typeof todoQuerySchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateTagInput = z.infer<typeof createTagSchema>;
