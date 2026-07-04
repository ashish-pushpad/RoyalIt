import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../model/users.model.js';
import Employee from '../model/employe.model.js';

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRATE || 'crm-secret-key');
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase();
    const adminUser = await User.findOne({ email: normalizedEmail });
    if (adminUser) {
      const isValidPassword = await bcrypt.compare(password, adminUser.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }

      const token = jwt.sign(
        { id: adminUser._id, email: adminUser.email, role: 'admin' },
        process.env.JWT_ACCESS_TOKEN_SECRATE || 'crm-secret-key',
        { expiresIn: '8h' }
      );

      return res.json({
        token,
        user: { id: adminUser._id, name: adminUser.name, email: adminUser.email, role: 'admin' }
      });
    }

    const employee = await Employee.findOne({ email: normalizedEmail });
    if (!employee) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isValidPassword = await bcrypt.compare(password, employee.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: employee._id, email: employee.email, role: 'employee', employeeRole: employee.role },
      process.env.JWT_ACCESS_TOKEN_SECRATE || 'crm-secret-key',
      { expiresIn: '8h' }
    );

    return res.json({
      token,
      user: { id: employee._id, name: employee.name, email: employee.email, role: 'employee', employeeRole: employee.role }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Login failed.' });
  }
};

export const getCurrentUser = [authenticate, async (req, res) => {
  try {
    const adminUser = await User.findById(req.user.id).select('-password');
    if (adminUser) {
      return res.json(adminUser);
    }

    const employee = await Employee.findById(req.user.id).select('-password');
    if (!employee) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.json({
      id: employee._id,
      name: employee.name,
      email: employee.email,
      role: 'employee',
      employeeRole: employee.role
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch user.' });
  }
}];

export { authenticate };
