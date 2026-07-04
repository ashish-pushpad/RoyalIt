function EmployeesPage({ employees, progress, employeeForm, setEmployeeForm, handleSubmitEmployee, resetEmployeeForm, handleDeleteEmployee }) {
  return (
    <div className="content-grid">
      <section className="card">
        <h3>Add Employee</h3>
        <form onSubmit={handleSubmitEmployee} className="employee-form">
          <input placeholder="Employee Name" value={employeeForm.name} onChange={(event) => setEmployeeForm({ ...employeeForm, name: event.target.value })} required />
          <input placeholder="Email" type="email" value={employeeForm.email} onChange={(event) => setEmployeeForm({ ...employeeForm, email: event.target.value })} required />
          <input placeholder="Phone" value={employeeForm.phone} onChange={(event) => setEmployeeForm({ ...employeeForm, phone: event.target.value })} />
          <input placeholder="Password" type="password" value={employeeForm.password || ''} onChange={(event) => setEmployeeForm({ ...employeeForm, password: event.target.value })} required={!employeeForm.id} />
          <input placeholder="Role" value={employeeForm.role} onChange={(event) => setEmployeeForm({ ...employeeForm, role: event.target.value })} />
          <div className="button-row">
            <button type="submit">{employeeForm.id ? 'Update Employee' : 'Add Employee'}</button>
            <button className="secondary" type="button" onClick={resetEmployeeForm}>Reset</button>
          </div>
        </form>
      </section>

      <section className="card">
        <h3>Employees</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.role}</td>
                  <td>
                    <button className="secondary" onClick={() => setEmployeeForm(employee)}>Edit</button>
                    <button className="danger" onClick={() => handleDeleteEmployee(employee.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card" style={{ gridColumn: '1 / -1' }}>
        <h3>Employee Progress Report</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Total Assigned Leads</th>
                <th>Converted Leads</th>
                <th>Pending Leads</th>
                <th>Lost Leads</th>
              </tr>
            </thead>
            <tbody>
              {progress.map((item) => (
                <tr key={item.employeeId || item.employeeName}>
                  <td>{item.employeeName}</td>
                  <td>{item.totalAssignedLeads}</td>
                  <td>{item.convertedLeads}</td>
                  <td>{item.pendingLeads}</td>
                  <td>{item.lostLeads}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default EmployeesPage;
