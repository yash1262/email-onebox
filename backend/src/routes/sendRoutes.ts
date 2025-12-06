import express from 'express';
import { SendController } from '../controllers/sendController';

const router = express.Router();
const sendController = new SendController();

// Send email
router.post('/', (req, res) => sendController.sendEmail(req, res));

export default router;
