import express from 'express';
import { checkAdmin } from '../middleware/auth.js';

const router = express.Router();

// An example admin-only route
router.post('/admin/data', checkAdmin, (req, res) => {
  // Admin-only logic here
  res.send('Admin data accessed successfully.');
});

export default router;
