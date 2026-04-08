import { Router } from 'express';
import { listTags, createTag, deleteTag } from '../controllers/tag.controller';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createTagSchema } from '../types/validation';

const router = Router();

router.use(authenticate);

router.get('/', listTags);
router.post('/', validate(createTagSchema), createTag);
router.delete('/:id', deleteTag);

export default router;
