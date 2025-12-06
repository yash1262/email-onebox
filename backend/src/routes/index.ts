import express from 'express';
import emailRoutes from './emailRoutes';
import accountRoutes from './accountRoutes';
import searchRoutes from './searchRoutes';
import aiRoutes from './aiRoutes';
import sendRoutes from './sendRoutes';

const router = express.Router();

router.use('/emails', emailRoutes);
router.use('/accounts', accountRoutes);
router.use('/search', searchRoutes);
router.use('/ai', aiRoutes);
router.use('/send', sendRoutes);

export default router;
