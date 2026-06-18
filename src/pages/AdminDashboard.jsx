import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import StatCard from '../components/StatCard.jsx';
import { DocumentTextIcon, ClockIcon, ExclamationCircleIcon, CheckCircleIcon, UsersIcon, ChartBarIcon, InboxIcon, CogIcon } from '../components/Icons.jsx';
import { getAdminStats, adminComplaints, statusColors, priorityColors } from '../data/dummyData.js';

function AdminDashboard() {
  const { user } = useAuth();
  const stats = getAdminStats();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Admin Dashboard</h1>
          <p className="mt-1 text-slate-600">
            Welcome back, {user?.name || 'Admin'}! Overview of all campus complaints.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Complaints"
          value={stats.total}
          icon={DocumentTextIcon}
          iconColor="blue"
          trend={15}
          trendLabel="vs last month"
        />
        <StatCard
          title="Pending Review"
          value={stats.pending}
          icon={ClockIcon}
          iconColor="orange"
          trend={3}
          trendLabel="vs last month"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={ExclamationCircleIcon}
          iconColor="purple"
          trend={-2}
          trendLabel="vs last month"
        />
        <StatCard
          title="Resolved"
          value={stats.resolved}
          icon={CheckCircleIcon}
          iconColor="green"
          trend={12}
          trendLabel="vs last month"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-950">Recent Complaints</h2>
          </div>
          <div className="divide-y divide-slate-200">
            {adminComplaints.slice(0, 6).map((complaint) => (
              <div
                key={complaint.id}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-950 truncate">{complaint.title}</p>
                  <p className="text-sm text-slate-500">
                    {complaint.id} • {complaint.category} • {new Date(complaint.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[complaint.status]}`}
                  >
                    {complaint.status.replace('_', ' ')}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityColors[complaint.priority]}`}
                  >
                    {complaint.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-slate-200">
            <Link
              to="/admin/complaints"
              className="text-sm font-medium text-blue-700 hover:text-blue-900"
            >
              View all complaints →
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-950">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-4">
            <Link
              to="/admin/complaints"
              className="flex items-center gap-3 rounded-lg p-4 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <InboxIcon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-medium text-slate-950">Manage Complaints</p>
                <p className="text-sm text-slate-500">Review, assign, and update complaints</p>
              </div>
            </Link>
            <Link
              to="/admin/analytics"
              className="flex items-center gap-3 rounded-lg p-4 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-700">
                <ChartBarIcon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-medium text-slate-950">View Analytics</p>
                <p className="text-sm text-slate-500">Complaint trends and statistics</p>
              </div>
            </Link>
            <Link
              to="/admin/users"
              className="flex items-center gap-3 rounded-lg p-4 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                <UsersIcon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-medium text-slate-950">Manage Users</p>
                <p className="text-sm text-slate-500">View and manage student accounts</p>
              </div>
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-3 rounded-lg p-4 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-700">
                <CogIcon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-medium text-slate-950">System Settings</p>
                <p className="text-sm text-slate-500">Configure system preferences</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;