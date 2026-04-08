import prisma from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';
import { CreateTodoInput, UpdateTodoInput, TodoQueryInput } from '../types/validation';
import { Prisma } from '@prisma/client';

export class TodoService {
  async list(userId: string, query: TodoQueryInput) {
    const { page, limit, sortBy, order, categoryId, tag, completed, search } = query;

    const where: Prisma.TodoWhereInput = { userId };

    if (completed === 'true') where.completed = true;
    else if (completed === 'false') where.completed = false;

    if (categoryId) where.categoryId = categoryId;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }
    if (tag) {
      where.tags = { some: { tagId: tag } };
    }

    const [todos, total] = await Promise.all([
      prisma.todo.findMany({
        where,
        orderBy: { [sortBy]: order },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: { select: { id: true, name: true, color: true } },
          tags: { include: { tag: { select: { id: true, name: true } } } },
        },
      }),
      prisma.todo.count({ where }),
    ]);

    const formatted = todos.map((todo) => ({
      ...todo,
      tags: todo.tags.map((tt) => tt.tag),
    }));

    return {
      data: formatted,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string, userId: string) {
    const todo = await prisma.todo.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true, color: true } },
        tags: { include: { tag: { select: { id: true, name: true } } } },
      },
    });

    if (!todo || todo.userId !== userId) {
      throw new AppError(404, 'TODO_NOT_FOUND', 'TODO를 찾을 수 없습니다.');
    }

    return { ...todo, tags: todo.tags.map((tt) => tt.tag) };
  }

  async create(userId: string, input: CreateTodoInput) {
    const { tagIds, ...data } = input;

    const todo = await prisma.todo.create({
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        userId,
        tags: tagIds?.length
          ? { create: tagIds.map((tagId) => ({ tagId })) }
          : undefined,
      },
      include: {
        category: { select: { id: true, name: true, color: true } },
        tags: { include: { tag: { select: { id: true, name: true } } } },
      },
    });

    return { ...todo, tags: todo.tags.map((tt) => tt.tag) };
  }

  async update(id: string, userId: string, input: UpdateTodoInput) {
    await this.getById(id, userId);

    const { tagIds, categoryId, dueDate, ...rest } = input;

    const updateData: Prisma.TodoUncheckedUpdateInput = {
      ...rest,
      dueDate: dueDate === null ? null : dueDate ? new Date(dueDate) : undefined,
      categoryId: categoryId === null ? null : categoryId,
    };

    if (tagIds !== undefined) {
      await prisma.todoTag.deleteMany({ where: { todoId: id } });
      if (tagIds.length > 0) {
        await prisma.todoTag.createMany({
          data: tagIds.map((tagId) => ({ todoId: id, tagId })),
        });
      }
    }

    const todo = await prisma.todo.update({
      where: { id },
      data: updateData,
      include: {
        category: { select: { id: true, name: true, color: true } },
        tags: { include: { tag: { select: { id: true, name: true } } } },
      },
    });

    return { ...todo, tags: todo.tags.map((tt) => tt.tag) };
  }

  async delete(id: string, userId: string) {
    await this.getById(id, userId);

    await prisma.todoTag.deleteMany({ where: { todoId: id } });
    await prisma.notification.deleteMany({ where: { todoId: id } });
    await prisma.todo.delete({ where: { id } });
  }

  async toggle(id: string, userId: string) {
    const todo = await this.getById(id, userId);

    const updated = await prisma.todo.update({
      where: { id },
      data: {
        completed: !todo.completed,
        completedAt: !todo.completed ? new Date() : null,
      },
      include: {
        category: { select: { id: true, name: true, color: true } },
        tags: { include: { tag: { select: { id: true, name: true } } } },
      },
    });

    return { ...updated, tags: updated.tags.map((tt) => tt.tag) };
  }
}
