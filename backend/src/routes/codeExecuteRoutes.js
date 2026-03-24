import express from 'express';
import { executeCode } from '../controllers/codeExecuteController.js';

const router = express.Router();

router.post('/execute',executeCode);

export default router;