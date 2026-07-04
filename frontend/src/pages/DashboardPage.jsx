function DashboardPage({ dashboard, form, setForm, employees, handleSubmitLead, resetForm, message, isEmployee }) {
  return (
    <div className="content-grid">
      <section className="card">
        <h3>Dashboard Summary</h3>
        <div className="stats-grid">
          <div className="stat-card"><span>Total Leads</span><strong>{dashboard?.totalLeads ?? 0}</strong></div>
          <div className="stat-card"><span>New Leads</span><strong>{dashboard?.newLeads ?? 0}</strong></div>
          <div className="stat-card"><span>Follow-up Leads</span><strong>{dashboard?.followUpLeads ?? 0}</strong></div>
          <div className="stat-card"><span>Converted Leads</span><strong>{dashboard?.convertedLeads ?? 0}</strong></div>
          <div className="stat-card"><span>Lost Leads</span><strong>{dashboard?.lostLeads ?? 0}</strong></div>
        </div>
      </section>

      <section className="card">
        <h3>{isEmployee ? 'Update Your Lead Status' : 'Add New Lead'}</h3>
        <form onSubmit={handleSubmitLead} className="lead-form">
          {!isEmployee && <input placeholder="Customer Name" value={form.customerName} onChange={(event) => setForm({ ...form, customerName: event.target.value })} required />}
          {!isEmployee && <input placeholder="Phone Number" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} required />}
          {!isEmployee && <input placeholder="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />}
          {!isEmployee && <input placeholder="Lead Source" value={form.leadSource} onChange={(event) => setForm({ ...form, leadSource: event.target.value })} required />}
          {!isEmployee && <textarea placeholder="Requirement / Message" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />}
          <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
            <option value="new">New</option>
            <option value="in-progress">In Progress</option>
            <option value="follow-up">Follow-up</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
          <input type="date" value={form.followUpDate} onChange={(event) => setForm({ ...form, followUpDate: event.target.value })} />
          {!isEmployee && <select value={form.assignedEmployeeId} onChange={(event) => setForm({ ...form, assignedEmployeeId: event.target.value })} required>
            <option value="">Select employee</option>
            {employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}
          </select>}
          <div className="button-row">
            <button type="submit">{form.id ? 'Update Lead' : (isEmployee ? 'Update Status' : 'Add Lead')}</button>
            <button className="secondary" type="button" onClick={resetForm}>Reset</button>
          </div>
        </form>
        {message ? <p className="message">{message}</p> : null}
      </section>
    </div>
  );
}

export default DashboardPage;
