import { Router } from 'express';
import { listTodos, getTodo, createTodo, updateTodo, deleteTodo, toggleTodo } from '../controllers/todo.controller';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createTodoSchema, updateTodoSchema, todoQuerySchema } from '../types/validation';

const router = Router();

router.use(authenticate);

router.get('/', validate(todoQuerySchema, 'query'), listTodos);
router.post('/', validate(createTodoSchema), createTodo);
router.get('/:id', getTodo);
router.patch('/:id', validate(updateTodoSchema), updateTodo);
router.delete('/:id', deleteTodo);
router.patch('/:id/toggle', toggleTodo);

export default router;
