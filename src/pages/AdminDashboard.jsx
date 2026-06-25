import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/useAuth.js';
import StatCard from '../components/StatCard.jsx';
import { DocumentTextIcon, ClockIcon, ExclamationCircleIcon, CheckCircleIcon, UsersIcon, ChartBarIcon, InboxIcon, CogIcon } from '../components/Icons.jsx';
import { statusColors, priorityColors } from '../data/dummyData.js';

function AdminDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    let active = true;

    async function fetchComplaints() {
      try {
        const { data } = await api.get('/complaints');
        if (active) {
          setComplaints(data);
        }
      } catch {
        if (active) {
          setComplaints([]);
        }
      }
    }

    fetchComplaints();

    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter((complaint) => complaint.status === 'pending').length;
    const inProgress = complaints.filter((complaint) => complaint.status === 'in_progress').length;
    const resolved = complaints.filter((complaint) => complaint.status === 'resolved').length;

    return { total, pending, inProgress, resolved };
  }, [complaints]);

  const recentComplaints = useMemo(
    () =>
      [...complaints]
        .sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0))
        .slice(0, 6),
    [complaints],
  );

  return (
    <div className="space-y-8 bg-pitch-black">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-warm-cream uppercase font-oldschoolgrotesk">Admin Dashboard</h1>
        <p className="mt-1.5 text-xs text-warm-cream/60 tracking-wide font-light">
          Welcome back, {user?.name || 'Admin'}! Overview of all campus complaints.
        </p>
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
        <div className="rounded-[25px] border border-charcoal-900 bg-charcoal-900/60 shadow-none relative overflow-hidden">
          <div className="border-b border-charcoal-900 px-6 py-5">
            <h2 className="text-xs font-bold tracking-[0.25em] uppercase text-warm-cream">Recent Complaints</h2>
          </div>
          <div className="divide-y divide-charcoal-900">
            {recentComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-charcoal-900/30 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-warm-cream truncate">{complaint.title}</p>
                  <p className="text-xs text-warm-cream/40 mt-1 tracking-wide">
                    {complaint.id} • {complaint.category} • {new Date(complaint.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${statusColors[complaint.status]}`}
                  >
                    {complaint.status.replace('_', ' ')}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${priorityColors[complaint.priority]}`}
                  >
                    {complaint.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-charcoal-900 bg-charcoal-900/20">
            <Link
              to="/admin/complaints"
              className="text-xs font-bold tracking-[0.25em] text-warm-cream hover:text-acid-lime transition-colors uppercase"
            >
              View all complaints ↗
            </Link>
          </div>
        </div>

        <div className="rounded-[25px] border border-charcoal-900 bg-charcoal-900/60 shadow-none relative overflow-hidden">
          <div className="border-b border-charcoal-900 px-6 py-5">
            <h2 className="text-xs font-bold tracking-[0.25em] uppercase text-warm-cream">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-4">
            <Link
              to="/admin/complaints"
              className="flex items-center gap-4 rounded-[25px] p-4 border border-charcoal-900 bg-charcoal-900/40 hover:border-warm-cream/20 hover:bg-charcoal-900/80 transition-all duration-300 relative group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-[15px] bg-pitch-black text-warm-cream group-hover:bg-acid-lime group-hover:text-pitch-black transition-all duration-300 flex-shrink-0">
                <InboxIcon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-bold tracking-[0.1em] text-warm-cream uppercase">Manage Complaints</p>
                <p className="text-xs text-warm-cream/40 mt-0.5">Review, assign, and update campus complaints</p>
              </div>
            </Link>
            <Link
              to="/admin/analytics"
              className="flex items-center gap-4 rounded-[25px] p-4 border border-charcoal-900 bg-charcoal-900/40 hover:border-warm-cream/20 hover:bg-charcoal-900/80 transition-all duration-300 relative group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-[15px] bg-pitch-black text-warm-cream group-hover:bg-acid-lime group-hover:text-pitch-black transition-all duration-300 flex-shrink-0">
                <ChartBarIcon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-bold tracking-[0.1em] text-warm-cream uppercase">View Analytics</p>
                <p className="text-xs text-warm-cream/40 mt-0.5">Complaint trends, stats and distribution reports</p>
              </div>
            </Link>
            <Link
              to="/admin/users"
              className="flex items-center gap-4 rounded-[25px] p-4 border border-charcoal-900 bg-charcoal-900/40 hover:border-warm-cream/20 hover:bg-charcoal-900/80 transition-all duration-300 relative group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-[15px] bg-pitch-black text-warm-cream group-hover:bg-acid-lime group-hover:text-pitch-black transition-all duration-300 flex-shrink-0">
                <UsersIcon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-bold tracking-[0.1em] text-warm-cream uppercase">Manage Users</p>
                <p className="text-xs text-warm-cream/40 mt-0.5">View and manage system registered user accounts</p>
              </div>
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-4 rounded-[25px] p-4 border border-charcoal-900 bg-charcoal-900/40 hover:border-warm-cream/20 hover:bg-charcoal-900/80 transition-all duration-300 relative group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-[15px] bg-pitch-black text-warm-cream group-hover:bg-acid-lime group-hover:text-pitch-black transition-all duration-300 flex-shrink-0">
                <CogIcon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-bold tracking-[0.1em] text-warm-cream uppercase">System Settings</p>
                <p className="text-xs text-warm-cream/40 mt-0.5">Configure system metrics and student settings</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
