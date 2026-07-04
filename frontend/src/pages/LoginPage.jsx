import { useState } from 'react';

function LoginPage({ onLogin, message }) {
  const [form, setForm] = useState({ email: 'admin@crm.com', password: 'admin123' });

  const handleSubmit = (event) => {
    event.preventDefault();
    onLogin(form);
  };

  return (
    <div className="app-shell">
      <div className="card login-card">
        <h1>Lead Management CRM</h1>
        <p>Admin login to manage leads and track employee progress.</p>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
          <button type="submit">Login</button>
        </form>
        {message ? <p className="message">{message}</p> : null}
        <small>Demo credentials: admin@crm.com / admin123 · employee@crm.com / employee123</small>
      </div>
    </div>
  );
}

export default LoginPage;
