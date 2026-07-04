import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import LeadsPage from './pages/LeadsPage';
import EmployeesPage from './pages/EmployeesPage';

function App() {
  const [token, setToken] = useState(localStorage.getItem('crmToken'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('crmUser') || 'null'));
  const [dashboard, setDashboard] = useState(null);
  const [leads, setLeads] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [progress, setProgress] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [form, setForm] = useState({
    id: null,
    customerName: '',
    phone: '',
    email: '',
    leadSource: '',
    message: '',
    status: 'new',
    followUpDate: '',
    assignedEmployeeId: ''
  });
  const [employeeForm, setEmployeeForm] = useState({
    id: null,
    name: '',
    email: '',
    phone: '',
    role: 'sale'
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const isEmployee = user?.role === 'employee';

  const authHeaders = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const refreshData = () => {
    if (!token) return;

    fetch('/api/dashboard-summary', { headers: authHeaders })
      .then((res) => res.json())
      .then((data) => setDashboard(data));

    fetch('/api/leads?search=' + encodeURIComponent(search) + '&status=' + encodeURIComponent(statusFilter), { headers: authHeaders })
      .then((res) => res.json())
      .then((data) => setLeads(data));

    if (!isEmployee) {
      fetch('/api/employee-progress', { headers: authHeaders })
        .then((res) => res.json())
        .then((data) => setProgress(data));

      fetch('/api/employees', { headers: authHeaders })
        .then((res) => res.json())
        .then((data) => setEmployees(data));
    }
  };

  useEffect(() => {
    refreshData();
  }, [token, authHeaders, search, statusFilter]);

  const handleLogin = async ({ email, password }) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error || 'Login failed');
      return;
    }

    localStorage.setItem('crmToken', data.token);
    localStorage.setItem('crmUser', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    setMessage('');
    navigate('/dashboard');
  };

  const resetForm = () => {
    setForm({ id: null, customerName: '', phone: '', email: '', leadSource: '', message: '', status: 'new', followUpDate: '', assignedEmployeeId: '' });
  };

  const resetEmployeeForm = () => {
    setEmployeeForm({ id: null, name: '', email: '', phone: '', role: 'sale' });
  };

  const startLeadEdit = (lead) => {
    setForm({ ...lead, assignedEmployeeId: lead.assignedEmployeeId || '' });
    setMessage('');
    navigate('/dashboard');
  };

  const handleSubmitLead = async (event) => {
    event.preventDefault();
    const method = form.id ? 'PUT' : 'POST';
    const url = form.id ? `/api/leads/${form.id}` : '/api/leads';
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify(form)
    });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error || 'Could not save lead');
      return;
    }

    setMessage(form.id ? 'Lead updated.' : 'Lead added.');
    resetForm();
    refreshData();
  };

  const handleSubmitEmployee = async (event) => {
    event.preventDefault();
    const method = employeeForm.id ? 'PUT' : 'POST';
    const url = employeeForm.id ? `/api/employees/${employeeForm.id}` : '/api/employees';
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify(employeeForm)
    });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error || 'Could not save employee');
      return;
    }

    setMessage(employeeForm.id ? 'Employee updated.' : 'Employee added.');
    resetEmployeeForm();
    refreshData();
  };

  const handleDelete = async (id) => {
    const response = await fetch(`/api/leads/${id}`, {
      method: 'DELETE',
      headers: authHeaders
    });
    if (response.ok) {
      setMessage('Lead deleted.');
      setLeads((prev) => prev.filter((lead) => lead.id !== id));
    }
  };

  const handleDeleteEmployee = async (id) => {
    const response = await fetch(`/api/employees/${id}`, {
      method: 'DELETE',
      headers: authHeaders
    });
    if (response.ok) {
      setMessage('Employee deleted.');
      refreshData();
    }
  };

  const logout = () => {
    localStorage.removeItem('crmToken');
    localStorage.removeItem('crmUser');
    setToken(null);
    setUser(null);
    navigate('/');
  };

  if (!token) {
    return <LoginPage onLogin={handleLogin} message={message} />;
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h2>Mini CRM Dashboard</h2>
          <p>Welcome back, {user?.name || 'Admin'}</p>
        </div>
        <button className="ghost-button" onClick={logout}>Logout</button>
      </header>

      <nav className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/leads">Leads</Link>
        {!isEmployee && <Link to="/employees">Employees</Link>}
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage dashboard={dashboard} form={form} setForm={setForm} employees={employees} handleSubmitLead={handleSubmitLead} resetForm={resetForm} message={message} isEmployee={isEmployee} />} />
        <Route path="/leads" element={<LeadsPage leads={leads} search={search} setSearch={setSearch} statusFilter={statusFilter} setStatusFilter={setStatusFilter} onEditLead={startLeadEdit} handleDelete={handleDelete} isEmployee={isEmployee} />} />
        {!isEmployee && <Route path="/employees" element={<EmployeesPage employees={employees} progress={progress} employeeForm={employeeForm} setEmployeeForm={setEmployeeForm} handleSubmitEmployee={handleSubmitEmployee} resetEmployeeForm={resetEmployeeForm} handleDeleteEmployee={handleDeleteEmployee} />} />}
        {isEmployee && <Route path="/employees" element={<Navigate to="/leads" replace />} />}
      </Routes>
    </div>
  );
}

export default App;
