import { useEffect, useMemo, useState } from 'react';
import api from '../services/api.js';
import { useAuth } from '../context/useAuth.js';
import { AdminTable, FilterBar, SearchBox } from '../components/admin';

function AdminUsers() {
  const { isAuthenticated } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [formUserId, setFormUserId] = useState(null);
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });

  async function fetchUsers() {
    const { data } = await api.get('/admin/users');
    return data;
  }

  useEffect(() => {
    let ignore = false;

    async function loadUsers() {
      try {
        setLoading(true);
        const data = await fetchUsers();

        if (ignore) {
          return;
        }

        setUsers(data);
        setError(null);
      } catch (err) {
        if (!ignore) {
          console.error('Fetch users error:', err);
          setError('Failed to load users.');
          setUsers([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      ignore = true;
    };
  }, [isAuthenticated]);

  const openAddUserForm = () => {
    setFormMode('add');
    setFormUserId(null);
    setFormValues({
      name: '',
      email: '',
      password: '',
      role: 'student',
    });
    setIsFormOpen(true);
  };

  const openEditUserForm = (user) => {
    setFormMode('edit');
    setFormUserId(user.id);
    setFormValues({
      name: user.name || '',
      email: user.email || '',
      password: '',
      role: user.role || 'student',
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setFormUserId(null);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const refreshUsers = async () => {
    const data = await fetchUsers();
    setUsers(data);
    setError(null);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      name: formValues.name.trim(),
      email: formValues.email.trim(),
      role: formValues.role,
    };

    if (!payload.name || !payload.email || !payload.role) {
      alert('Name, email, and role are required.');
      return;
    }

    if (formMode === 'add') {
      if (!formValues.password.trim()) {
        alert('Password is required.');
        return;
      }

      payload.password = formValues.password;
    } else if (formValues.password.trim()) {
      payload.password = formValues.password;
    }

    try {
      if (formMode === 'add') {
        await api.post('/admin/users', payload);
      } else {
        await api.put(`/admin/users/${formUserId}`, payload);
      }

      await refreshUsers();
      closeForm();
    } catch (err) {
      alert(err?.response?.data?.message || `Failed to ${formMode === 'add' ? 'add' : 'update'} user.`);
    }
  };

  const handleAddUser = async () => {
    openAddUserForm();
  };

  const handleEditUser = async (user) => {
    openEditUserForm(user);
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Delete ${user.name}?`)) return;

    try {
      await api.delete(`/admin/users/${user.id}`);
      await refreshUsers();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete user.');
    }
  };

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) => {
      return (
        user.id?.toLowerCase?.().includes(query) ||
        user.name?.toLowerCase?.().includes(query) ||
        user.email?.toLowerCase?.().includes(query) ||
        user.role?.toLowerCase?.().includes(query) ||
        String(user.status || '').toLowerCase().includes(query)
      );
    });
  }, [search, users]);

  const columns = [
    { header: 'User ID', accessor: 'id' },
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Role',
      cell: (user) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
            user.role === 'admin'
              ? 'bg-ember-orange text-pitch-black font-extrabold'
              : 'bg-cobalt-blue text-pitch-black font-extrabold'
          }`}
        >
          {user.role}
        </span>
      ),
    },
    { header: 'Complaints', accessor: 'complaints' },
    {
      header: 'Status',
      cell: (user) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
            user.status === 'active'
              ? 'bg-acid-lime text-pitch-black font-extrabold'
              : 'bg-charcoal-900 text-warm-cream/40 border border-charcoal-900'
          }`}
        >
          {user.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (user) => (
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => handleEditUser(user)}
            className="text-xs font-bold tracking-wider text-acid-lime hover:text-lime-400 uppercase transition-colors cursor-pointer"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => handleDeleteUser(user)}
            className="text-xs font-bold tracking-wider text-ember-orange hover:text-orange-400 uppercase transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 bg-pitch-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-acid-lime"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-pitch-black text-center">
        <p className="text-warm-cream font-bold uppercase tracking-wider text-sm mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-xs uppercase tracking-wider text-warm-cream border-b border-charcoal-900 hover:text-acid-lime hover:border-acid-lime transition-all pb-0.5 cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-pitch-black">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-warm-cream uppercase font-oldschoolgrotesk">User Management</h1>
          <p className="mt-1.5 text-xs text-warm-cream/60 tracking-wide font-light">View and manage all system users</p>
        </div>
        <button
          type="button"
          onClick={handleAddUser}
          className="rounded-full bg-acid-lime px-6 py-2.5 text-xs font-black tracking-widest text-pitch-black hover:bg-lime-400 uppercase transition-all duration-300 cursor-pointer"
        >
          Add User
        </button>
      </div>

      <FilterBar className="mb-0">
        <SearchBox
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search users by name, email, role..."
          className="w-full"
        />
      </FilterBar>

      <AdminTable
        columns={columns}
        data={filteredUsers}
        isLoading={false}
        emptyMessage="No users found matching your search."
      />

      <div className="text-[10px] uppercase tracking-[0.25em] text-warm-cream/40">
        Showing {filteredUsers.length} of {users.length} users
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-pitch-black/80 px-4">
          <div className="w-full max-w-lg rounded-[25px] border border-charcoal-900 bg-charcoal-900/95 p-6 shadow-none">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black tracking-tight text-warm-cream uppercase font-oldschoolgrotesk">
                  {formMode === 'add' ? 'Add User' : 'Edit User'}
                </h2>
                <p className="mt-1.5 text-xs text-warm-cream/60 tracking-wide font-light">
                  {formMode === 'add' ? 'Create a new account in the users state.' : 'Update the selected user record.'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="text-xs font-bold tracking-wider text-warm-cream/60 uppercase hover:text-warm-cream transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleFormSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="block text-[10px] font-bold tracking-[0.2em] text-warm-cream/60 uppercase">Name</span>
                  <input
                    name="name"
                    value={formValues.name}
                    onChange={handleFormChange}
                    className="w-full rounded-full border border-charcoal-900 bg-pitch-black px-4 py-3 text-sm text-warm-cream outline-none transition focus:border-acid-lime"
                    type="text"
                  />
                </label>
                <label className="space-y-2">
                  <span className="block text-[10px] font-bold tracking-[0.2em] text-warm-cream/60 uppercase">Email</span>
                  <input
                    name="email"
                    value={formValues.email}
                    onChange={handleFormChange}
                    className="w-full rounded-full border border-charcoal-900 bg-pitch-black px-4 py-3 text-sm text-warm-cream outline-none transition focus:border-acid-lime"
                    type="email"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="block text-[10px] font-bold tracking-[0.2em] text-warm-cream/60 uppercase">
                    {formMode === 'add' ? 'Password' : 'Password (optional)'}
                  </span>
                  <input
                    name="password"
                    value={formValues.password}
                    onChange={handleFormChange}
                    className="w-full rounded-full border border-charcoal-900 bg-pitch-black px-4 py-3 text-sm text-warm-cream outline-none transition focus:border-acid-lime"
                    type="password"
                    autoComplete="new-password"
                  />
                </label>
                <label className="space-y-2">
                  <span className="block text-[10px] font-bold tracking-[0.2em] text-warm-cream/60 uppercase">Role</span>
                  <select
                    name="role"
                    value={formValues.role}
                    onChange={handleFormChange}
                    className="w-full rounded-full border border-charcoal-900 bg-pitch-black px-4 py-3 text-sm text-warm-cream outline-none transition focus:border-acid-lime"
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-full border border-charcoal-900 px-5 py-2.5 text-xs font-black tracking-widest text-warm-cream uppercase hover:border-warm-cream/30 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-acid-lime px-5 py-2.5 text-xs font-black tracking-widest text-pitch-black uppercase hover:bg-lime-400 transition-all cursor-pointer"
                >
                  {formMode === 'add' ? 'Create User' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
