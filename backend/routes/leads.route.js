import express from 'express';
import {
  getDashboardSummary,
  getLeads,
  createLead,
  updateLead,
  deleteLead,
  getEmployeeProgress
} from '../controller/leads.controller.js';

const router = express.Router();

router.get('/dashboard-summary', getDashboardSummary);
router.get('/leads', getLeads);
router.post('/leads', createLead);
router.put('/leads/:id', updateLead);
router.delete('/leads/:id', deleteLead);
router.get('/employee-progress', getEmployeeProgress);

export default router;
