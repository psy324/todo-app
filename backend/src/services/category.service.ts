import prisma from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';
import { CreateCategoryInput, UpdateCategoryInput } from '../types/validation';
import { Prisma } from '@prisma/client';

export class CategoryService {
  async list(userId: string) {
    const categories = await prisma.category.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
      include: { _count: { select: { todos: true } } },
    });

    return categories.map(({ _count, ...cat }) => ({
      ...cat,
      todoCount: _count.todos,
    }));
  }

  async create(userId: string, input: CreateCategoryInput) {
    try {
      return await prisma.category.create({
        data: { name: input.name, color: input.color, userId },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new AppError(409, 'DUPLICATE_CATEGORY', '이미 존재하는 카테고리명입니다.');
      }
      throw error;
    }
  }

  async update(id: string, userId: string, input: UpdateCategoryInput) {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category || category.userId !== userId) {
      throw new AppError(404, 'CATEGORY_NOT_FOUND', '카테고리를 찾을 수 없습니다.');
    }

    try {
      return await prisma.category.update({
        where: { id },
        data: {
          ...(input.name !== undefined && { name: input.name }),
          ...(input.color !== undefined && { color: input.color }),
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new AppError(409, 'DUPLICATE_CATEGORY', '이미 존재하는 카테고리명입니다.');
      }
      throw error;
    }
  }

  async delete(id: string, userId: string) {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category || category.userId !== userId) {
      throw new AppError(404, 'CATEGORY_NOT_FOUND', '카테고리를 찾을 수 없습니다.');
    }

    await prisma.todo.updateMany({
      where: { categoryId: id },
      data: { categoryId: null },
    });

    await prisma.category.delete({ where: { id } });
  }
}
