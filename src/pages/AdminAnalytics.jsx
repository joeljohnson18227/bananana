import { getAdminStats, adminComplaints } from '../data/dummyData.js';
import StatCard from '../components/StatCard.jsx';
import { DocumentTextIcon, ClockIcon, ExclamationCircleIcon, CheckCircleIcon, ChartBarIcon, UsersIcon } from '../components/Icons.jsx';

function AdminAnalytics() {
  const stats = getAdminStats();

  const categoryStats = adminComplaints.reduce((acc, complaint) => {
    acc[complaint.category] = (acc[complaint.category] || 0) + 1;
    return acc;
  }, {});

  const statusStats = adminComplaints.reduce((acc, complaint) => {
    acc[complaint.status] = (acc[complaint.status] || 0) + 1;
    return acc;
  }, {});

  const priorityStats = adminComplaints.reduce((acc, complaint) => {
    acc[complaint.priority] = (acc[complaint.priority] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Analytics Dashboard</h1>
        <p className="mt-1 text-slate-600">Complaint trends and insights</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Complaints" value={stats.total} icon={DocumentTextIcon} iconColor="blue" />
        <StatCard title="Pending" value={stats.pending} icon={ClockIcon} iconColor="orange" />
        <StatCard title="In Progress" value={stats.inProgress} icon={ExclamationCircleIcon} iconColor="purple" />
        <StatCard title="Resolved" value={stats.resolved} icon={CheckCircleIcon} iconColor="green" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950 mb-4">Complaints by Category</h2>
          <div className="space-y-4">
            {Object.entries(categoryStats).map(([category, count]) => (
              <div key={category} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-700">{category}</span>
                  <span className="font-medium text-slate-950">{count}</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{ width: `${(count / stats.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950 mb-4">Complaints by Priority</h2>
          <div className="space-y-4">
            {Object.entries(priorityStats).map(([priority, count]) => {
              const colors = {
                high: 'bg-red-600',
                medium: 'bg-orange-600',
                low: 'bg-slate-600',
              };
              return (
                <div key={priority} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize text-slate-700">{priority}</span>
                    <span className="font-medium text-slate-950">{count}</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${colors[priority]}`}
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950 mb-4">Status Distribution</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="text-center p-4 rounded-lg bg-yellow-50">
              <p className="text-3xl font-bold text-yellow-700">{statusStats.pending || 0}</p>
              <p className="text-sm text-yellow-600">Pending</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-50">
              <p className="text-3xl font-bold text-blue-700">{statusStats.in_progress || 0}</p>
              <p className="text-sm text-blue-600">In Progress</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50">
              <p className="text-3xl font-bold text-green-700">{statusStats.resolved || 0}</p>
              <p className="text-sm text-green-600">Resolved</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950 mb-4">Monthly Trend</h2>
          <div className="h-48 flex items-end justify-around gap-2">
            {['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'].map((month, i) => (
              <div key={month} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-600 rounded-t transition-all hover:bg-blue-700"
                  style={{ height: `${20 + i * 15 + Math.random() * 20}%` }}
                />
                <span className="mt-2 text-xs text-slate-500">{month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAnalytics;