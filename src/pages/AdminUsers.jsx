import { adminComplaints } from '../data/dummyData.js';

const dummyUsers = [
  { id: 'USR-001', name: 'John Smith', email: 'john.smith@student.edu', role: 'student', complaints: 3, status: 'active' },
  { id: 'USR-002', name: 'Emily Johnson', email: 'emily.j@student.edu', role: 'student', complaints: 1, status: 'active' },
  { id: 'USR-003', name: 'Michael Brown', email: 'm.brown@student.edu', role: 'student', complaints: 5, status: 'active' },
  { id: 'USR-004', name: 'Sarah Davis', email: 'sarah.davis@student.edu', role: 'student', complaints: 0, status: 'inactive' },
  { id: 'USR-005', name: 'Admin User', email: 'admin@campus.edu', role: 'admin', complaints: 0, status: 'active' },
];

function AdminUsers() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">User Management</h1>
          <p className="mt-1 text-slate-600">View and manage all system users</p>
        </div>
        <button className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800">
          Add User
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Complaints</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {dummyUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm font-mono text-slate-950">{user.id}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-950">{user.name}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{user.complaints}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="text-blue-700 hover:text-blue-900 text-sm font-medium">Edit</button>
                    <button className="text-red-700 hover:text-red-900 text-sm font-medium">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsers;