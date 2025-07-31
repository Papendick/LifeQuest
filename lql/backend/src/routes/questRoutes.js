import { Router } from 'express';
import { createQuest, listQuests, getQuest, updateQuest, deleteQuest, createStage, updateStage, deleteStage } from '../controllers/questController.js';

const router = Router();

// /api/quests
router.post('/', createQuest);
router.get('/', listQuests);
router.get('/:id', getQuest);
router.put('/:id', updateQuest);
router.delete('/:id', deleteQuest);

// stages
router.post('/:id/stages', createStage);
router.put('/:id/stages/:stageId', updateStage);
router.delete('/:id/stages/:stageId', deleteStage);

export default router;
