import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './connection.js';
import userRoutes from './routes/user.route.js';
import leadRoutes from './routes/leads.route.js';
import employeeRoutes from './routes/employe.route.js';
import User from './model/users.model.js';
import Employee from './model/employe.model.js';
import Lead from './model/leads.model.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 5010);

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'CRM API running' });
});

app.use('/api', userRoutes);
app.use('/api', leadRoutes);
app.use('/api', employeeRoutes);

const seedAdminUser = async () => {
  const existingAdmin = await User.findOne({ email: 'admin@crm.com' });
  if (!existingAdmin) {
    await User.create({
      name: 'Admin',
      email: 'admin@crm.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('Seeded default admin user');
  }
};

const seedEmployeeUser = async () => {
  const existingEmployee = await Employee.findOne({ email: 'employee@crm.com' });
  if (!existingEmployee) {
    await Employee.create({
      name: 'Employee One',
      email: 'employee@crm.com',
      password: 'employee123',
      role: 'sale'
    });
    console.log('Seeded default employee user');
  }
};

const seedEmployeeLead = async () => {
  const employee = await Employee.findOne({ email: 'employee@crm.com' });
  if (!employee) return;

  const existingLead = await Lead.findOne({ email: 'jane@example.com' });
  if (!existingLead) {
    await Lead.create({
      customerName: 'Jane Doe',
      phone: 9876543210,
      email: 'jane@example.com',
      leadSource: 'Website',
      message: 'Interested in a premium package.',
      status: 'new',
      followUpDate: '',
      assignedEmployee: employee._id
    });
    console.log('Seeded sample lead for employee');
  }
};

connectDB()
  .then(async () => {
    await seedAdminUser();
    await seedEmployeeUser();
    await seedEmployeeLead();
    app.listen(port, () => {
      console.log(`CRM backend running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed', error);
    process.exit(1);
  });
