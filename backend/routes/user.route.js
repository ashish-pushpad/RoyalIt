import express from 'express';
import { loginAdmin, getCurrentUser } from '../controller/user.controller.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/me', getCurrentUser);

export default router;
