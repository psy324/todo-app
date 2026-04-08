import { Router } from 'express';
import authRoutes from './auth.routes';
import todoRoutes from './todo.routes';
import categoryRoutes from './category.routes';
import tagRoutes from './tag.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/todos', todoRoutes);
router.use('/categories', categoryRoutes);
router.use('/tags', tagRoutes);

export default router;
