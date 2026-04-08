import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { CategoryService } from '../services/category.service';

const categoryService = new CategoryService();

export const listCategories = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await categoryService.list(req.userId!);
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = await categoryService.create(req.userId!, req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = await categoryService.update(req.params.id, req.userId!, req.body);
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await categoryService.delete(req.params.id, req.userId!);
    res.json({ success: true, data: { message: '카테고리가 삭제되었습니다.' } });
  } catch (error) {
    next(error);
  }
};
