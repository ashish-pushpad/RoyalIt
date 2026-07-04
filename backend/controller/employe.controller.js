import Employee from '../model/employe.model.js';
import { authenticate } from './user.controller.js';

export const getEmployees = [authenticate, async (req, res) => {
  try {
    const employees = await Employee.find({}).sort({ name: 1 });
    return res.json(employees.map((employee) => ({
      id: employee._id,
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      role: employee.role,
      joinedAt: employee.joinedAt,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt
    })));
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch employees.' });
  }
}];

export const createEmployee = [authenticate, async (req, res) => {
  try {
    const { name, email, phone, role, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Employee name, email, and password are required.' });
    }

    const employee = await Employee.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role: role || 'sale',
      joinedAt: new Date().toISOString()
    });

    return res.status(201).json({
      id: employee._id,
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      role: employee.role,
      joinedAt: employee.joinedAt,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create employee.' });
  }
}];

export const updateEmployee = [authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found.' });
    }

    const { name, email, phone, role, password } = req.body;
    employee.name = name || employee.name;
    employee.email = (email || employee.email).toLowerCase();
    employee.phone = phone || employee.phone;
    employee.role = role || employee.role;
    if (password) {
      employee.password = password;
    }

    await employee.save();

    return res.json({
      id: employee._id,
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      role: employee.role,
      joinedAt: employee.joinedAt,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update employee.' });
  }
}];

export const deleteEmployee = [authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByIdAndDelete(id);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found.' });
    }

    await import('../model/leads.model.js').then(({ default: Lead }) => Lead.updateMany({ assignedEmployee: id }, { $unset: { assignedEmployee: '' } }));

    return res.json({ success: true, message: 'Employee deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete employee.' });
  }
}];
