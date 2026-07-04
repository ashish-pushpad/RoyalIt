import Lead from '../model/leads.model.js';
import Employee from '../model/employe.model.js';
import { authenticate } from './user.controller.js';

export const getDashboardSummary = [authenticate, async (req, res) => {
  try {
    const filter = req.user.role === 'employee' ? { assignedEmployee: req.user.id } : {};
    const totalLeads = await Lead.countDocuments(filter);
    const newLeads = await Lead.countDocuments({ ...filter, status: 'new' });
    const followUpLeads = await Lead.countDocuments({ ...filter, status: 'follow-up' });
    const convertedLeads = await Lead.countDocuments({ ...filter, status: 'converted' });
    const lostLeads = await Lead.countDocuments({ ...filter, status: 'lost' });

    return res.json({ totalLeads, newLeads, followUpLeads, convertedLeads, lostLeads });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch dashboard summary.' });
  }
}];

export const getLeads = [authenticate, async (req, res) => {
  try {
    const { search = '', status = '' } = req.query;
    const query = req.user.role === 'employee' ? { assignedEmployee: req.user.id } : {};

    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      query.status = status;
    }

    const leads = await Lead.find(query).populate('assignedEmployee', 'name email').sort({ createdAt: -1 });
    return res.json(leads.map((lead) => ({
      id: lead._id,
      customerName: lead.customerName,
      phone: lead.phone,
      email: lead.email,
      leadSource: lead.leadSource,
      message: lead.message,
      status: lead.status,
      followUpDate: lead.followUpDate,
      assignedEmployeeId: lead.assignedEmployee?._id || null,
      assignedEmployee: lead.assignedEmployee?.name || '',
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt
    })));
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch leads.' });
  }
}];

export const createLead = [authenticate, async (req, res) => {
  if (req.user.role === 'employee') {
    return res.status(403).json({ error: 'Employees can only update their assigned leads.' });
  }

  try {
    const { customerName, phone, email, leadSource, message, status, followUpDate, assignedEmployee, assignedEmployeeId } = req.body;
    const selectedEmployeeId = assignedEmployeeId || assignedEmployee;

    if (!customerName || !phone || !email || !leadSource || !selectedEmployeeId) {
      return res.status(400).json({ error: 'Please fill all required lead fields.' });
    }

    const employee = await Employee.findById(selectedEmployeeId);
    if (!employee) {
      return res.status(404).json({ error: 'Selected employee not found.' });
    }

    const lead = await Lead.create({
      customerName,
      phone,
      email,
      leadSource,
      message,
      status: status || 'new',
      followUpDate,
      assignedEmployee: employee._id
    });

    return res.status(201).json({
      id: lead._id,
      customerName: lead.customerName,
      phone: lead.phone,
      email: lead.email,
      leadSource: lead.leadSource,
      message: lead.message,
      status: lead.status,
      followUpDate: lead.followUpDate,
      assignedEmployeeId: lead.assignedEmployee,
      assignedEmployee: employee.name,
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create lead.' });
  }
}];

export const updateLead = [authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found.' });
    }

    const { customerName, phone, email, leadSource, message, status, followUpDate, assignedEmployee, assignedEmployeeId } = req.body;
    const selectedEmployeeId = assignedEmployeeId || assignedEmployee;
    const employee = selectedEmployeeId ? await Employee.findById(selectedEmployeeId) : null;

    if (req.user.role === 'employee' && lead.assignedEmployee?.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You can only update your assigned leads.' });
    }

    lead.customerName = customerName || lead.customerName;
    lead.phone = phone || lead.phone;
    lead.email = email || lead.email;
    lead.leadSource = leadSource || lead.leadSource;
    lead.message = message ?? lead.message;
    lead.status = status || lead.status;
    lead.followUpDate = followUpDate || lead.followUpDate;
    lead.assignedEmployee = employee ? employee._id : lead.assignedEmployee;

    await lead.save();

    return res.json({
      id: lead._id,
      customerName: lead.customerName,
      phone: lead.phone,
      email: lead.email,
      leadSource: lead.leadSource,
      message: lead.message,
      status: lead.status,
      followUpDate: lead.followUpDate,
      assignedEmployeeId: lead.assignedEmployee,
      assignedEmployee: employee?.name || '',
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update lead.' });
  }
}];

export const deleteLead = [authenticate, async (req, res) => {
  if (req.user.role === 'employee') {
    return res.status(403).json({ error: 'Employees cannot delete leads.' });
  }

  try {
    const { id } = req.params;
    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found.' });
    }

    return res.json({ success: true, message: 'Lead deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete lead.' });
  }
}];

export const getEmployeeProgress = [authenticate, async (req, res) => {
  if (req.user.role === 'employee') {
    return res.status(403).json({ error: 'Employee access is limited to assigned leads.' });
  }

  try {
    const employees = await Employee.find({});
    const progress = [];

    for (const employee of employees) {
      const totalAssignedLeads = await Lead.countDocuments({ assignedEmployee: employee._id });
      const convertedLeads = await Lead.countDocuments({ assignedEmployee: employee._id, status: 'converted' });
      const pendingLeads = await Lead.countDocuments({ assignedEmployee: employee._id, status: { $in: ['new', 'in-progress', 'follow-up'] } });
      const lostLeads = await Lead.countDocuments({ assignedEmployee: employee._id, status: 'lost' });

      progress.push({
        employeeId: employee._id,
        employeeName: employee.name,
        totalAssignedLeads,
        convertedLeads,
        pendingLeads,
        lostLeads
      });
    }

    return res.json(progress);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch employee progress.' });
  }
}];
