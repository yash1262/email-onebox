import express from 'express';
import { AccountController } from '../controllers/accountController';

const router = express.Router();
const accountController = new AccountController();

// Get all accounts
router.get('/', accountController.getAllAccounts.bind(accountController));

// Get account status
router.get('/:email/status', accountController.getAccountStatus.bind(accountController));

// Trigger manual sync
router.post('/:email/sync', accountController.syncAccount.bind(accountController));

export default router;
