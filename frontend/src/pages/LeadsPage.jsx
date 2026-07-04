const STATUS_OPTIONS = ['new', 'in-progress', 'follow-up', 'converted', 'lost'];

function LeadsPage({ leads, search, setSearch, statusFilter, setStatusFilter, onEditLead, handleDelete, isEmployee }) {
  return (
    <section className="card">
      <div className="section-heading">
        <h3>{isEmployee ? 'My Assigned Leads' : 'Lead Management'}</h3>
        <div className="filters">
          <input placeholder="Search by name, phone or email" value={search} onChange={(event) => setSearch(event.target.value)} />
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Status</th>
              <th>Employee</th>
              <th>Follow-up</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td>{lead.customerName}</td>
                <td>{lead.phone}</td>
                <td>{lead.email}</td>
                <td>{lead.status}</td>
                <td>{lead.assignedEmployee}</td>
                <td>{lead.followUpDate || '—'}</td>
                <td>
                  <button className="secondary" onClick={() => onEditLead(lead)}>Edit</button>
                  {!isEmployee && <button className="danger" onClick={() => handleDelete(lead.id)}>Delete</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default LeadsPage;
