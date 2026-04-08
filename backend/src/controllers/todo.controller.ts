import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { TodoService } from '../services/todo.service';

const todoService = new TodoService();

export const listTodos = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = (req as unknown as Record<string, unknown>).validatedQuery as Parameters<TodoService['list']>[1];
    const result = await todoService.list(req.userId!, query);
    res.json({ success: true, data: result.data, meta: result.meta });
  } catch (error) {
    next(error);
  }
};

export const getTodo = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const todo = await todoService.getById(req.params.id, req.userId!);
    res.json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
};

export const createTodo = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const todo = await todoService.create(req.userId!, req.body);
    res.status(201).json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
};

export const updateTodo = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const todo = await todoService.update(req.params.id, req.userId!, req.body);
    res.json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
};

export const deleteTodo = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await todoService.delete(req.params.id, req.userId!);
    res.json({ success: true, data: { message: 'TODO가 삭제되었습니다.' } });
  } catch (error) {
    next(error);
  }
};

export const toggleTodo = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const todo = await todoService.toggle(req.params.id, req.userId!);
    res.json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
};
