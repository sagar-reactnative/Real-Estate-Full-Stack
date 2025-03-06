import express, { Router } from 'express';
import { PropertyController } from '../controllers/property.controller';

const router: Router = express.Router();

router.get('/latest', PropertyController.getLatest);
router.get('/:id', PropertyController.getById);

export default router;
