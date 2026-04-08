import prisma from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';
import { CreateTagInput } from '../types/validation';
import { Prisma } from '@prisma/client';

export class TagService {
  async list(userId: string) {
    const tags = await prisma.tag.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
      include: { _count: { select: { todos: true } } },
    });

    return tags.map(({ _count, ...tag }) => ({
      ...tag,
      todoCount: _count.todos,
    }));
  }

  async create(userId: string, input: CreateTagInput) {
    try {
      return await prisma.tag.create({
        data: { name: input.name, userId },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new AppError(409, 'DUPLICATE_TAG', '이미 존재하는 태그명입니다.');
      }
      throw error;
    }
  }

  async delete(id: string, userId: string) {
    const tag = await prisma.tag.findUnique({ where: { id } });
    if (!tag || tag.userId !== userId) {
      throw new AppError(404, 'TAG_NOT_FOUND', '태그를 찾을 수 없습니다.');
    }

    await prisma.todoTag.deleteMany({ where: { tagId: id } });
    await prisma.tag.delete({ where: { id } });
  }
}
