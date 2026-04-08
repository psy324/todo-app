import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { TagService } from '../services/tag.service';

const tagService = new TagService();

export const listTags = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tags = await tagService.list(req.userId!);
    res.json({ success: true, data: tags });
  } catch (error) {
    next(error);
  }
};

export const createTag = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tag = await tagService.create(req.userId!, req.body);
    res.status(201).json({ success: true, data: tag });
  } catch (error) {
    next(error);
  }
};

export const deleteTag = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await tagService.delete(req.params.id, req.userId!);
    res.json({ success: true, data: { message: '태그가 삭제되었습니다.' } });
  } catch (error) {
    next(error);
  }
};
