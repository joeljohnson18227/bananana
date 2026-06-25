import { useEffect, useMemo, useState } from 'react';
import api from '../services/api.js';
import StatCard from '../components/StatCard.jsx';
import { DocumentTextIcon, ClockIcon, ExclamationCircleIcon, CheckCircleIcon } from '../components/Icons.jsx';
import { useAuth } from '../context/useAuth.js';

function AdminAnalytics() {
  const { isAuthenticated } = useAuth();
  const [complaints, setComplaints] = useState([]);

  async function fetchComplaints() {
    if (!isAuthenticated) return;
    console.log('Fetching complaints...');
    try {
      // Changed to admin/complaints to ensure we get all complaints
      const { data } = await api.get('/admin/complaints');
      console.log('Complaints data:', data);
      setComplaints(data);
    } catch (err) {
      console.error('Fetch complaints error:', err);
      setComplaints([]);
    }
  }

  useEffect(() => {
    fetchComplaints();
  }, [isAuthenticated]);

  const stats = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter((complaint) => complaint.status === 'pending').length;
    const inProgress = complaints.filter((complaint) => complaint.status === 'in_progress').length;
    const resolved = complaints.filter((complaint) => complaint.status === 'resolved').length;

    return { total, pending, inProgress, resolved };
  }, [complaints]);

  const categoryStats = useMemo(
    () =>
      complaints.reduce((acc, complaint) => {
        acc[complaint.category] = (acc[complaint.category] || 0) + 1;
        return acc;
      }, {}),
    [complaints],
  );

  const statusStats = useMemo(
    () =>
      complaints.reduce((acc, complaint) => {
        acc[complaint.status] = (acc[complaint.status] || 0) + 1;
        return acc;
      }, {}),
    [complaints],
  );

  const priorityStats = useMemo(
    () =>
      complaints.reduce((acc, complaint) => {
        acc[complaint.priority || 'medium'] = (acc[complaint.priority || 'medium'] || 0) + 1;
        return acc;
      }, {}),
    [complaints],
  );

  const monthlyTrend = useMemo(() => {
    if (complaints.length === 0) {
      return [
        { label: 'No Data', count: 0 },
        { label: '', count: 0 },
        { label: '', count: 0 },
        { label: '', count: 0 },
        { label: '', count: 0 },
        { label: '', count: 0 },
      ];
    }

    const months = [];
    const latestDate = complaints.reduce((latest, complaint) => {
      const date = new Date(complaint.submittedAt || 0);
      return date > latest ? date : latest;
    }, new Date(0));

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 5; i >= 0; i -= 1) {
      const monthDate = new Date(Date.UTC(latestDate.getUTCFullYear(), latestDate.getUTCMonth() - i, 1));
      const year = monthDate.getUTCFullYear();
      const month = monthDate.getUTCMonth();
      const count = complaints.filter((complaint) => {
        const complaintDate = new Date(complaint.submittedAt || 0);
        return complaintDate.getUTCFullYear() === year && complaintDate.getUTCMonth() === month;
      }).length;

      months.push({
        label: monthNames[month],
        count,
      });
    }

    return months;
  }, [complaints]);

  const maxMonthlyCount = Math.max(...monthlyTrend.map((month) => month.count), 1);
  const chartPoints = monthlyTrend.map((month, index) => {
    const x = (index / Math.max(monthlyTrend.length - 1, 1)) * 100;
    const y = 100 - (month.count / maxMonthlyCount) * 100;

    return { x, y, count: month.count, label: month.label };
  });
  const chartPath = chartPoints.length
    ? `M ${chartPoints
        .map((point) => `${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
        .join(' L ')}`
    : '';

  return (
    <div className="space-y-8 bg-pitch-black">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-warm-cream uppercase font-oldschoolgrotesk">Analytics Dashboard</h1>
        <p className="mt-1.5 text-xs text-warm-cream/60 tracking-wide font-light">Complaint trends and insights</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Complaints" value={stats.total} icon={DocumentTextIcon} iconColor="blue" />
        <StatCard title="Pending" value={stats.pending} icon={ClockIcon} iconColor="orange" />
        <StatCard title="In Progress" value={stats.inProgress} icon={ExclamationCircleIcon} iconColor="purple" />
        <StatCard title="Resolved" value={stats.resolved} icon={CheckCircleIcon} iconColor="green" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[25px] border border-charcoal-900 bg-charcoal-900/60 p-6 shadow-none relative overflow-hidden">
          <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-warm-cream mb-6 font-oldschoolgrotesk">Complaints by Category</h2>
          <div className="space-y-4">
            {Object.entries(categoryStats).map(([category, count]) => (
              <div key={category} className="space-y-2">
                <div className="flex justify-between text-xs font-medium tracking-wide">
                  <span className="text-warm-cream/60">{category}</span>
                  <span className="text-warm-cream font-bold">{count}</span>
                </div>
                <div className="h-2 bg-pitch-black rounded-full overflow-hidden">
                  <div
                    className="h-full bg-acid-lime rounded-full transition-all"
                    style={{ width: `${(count / stats.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[25px] border border-charcoal-900 bg-charcoal-900/60 p-6 shadow-none relative overflow-hidden">
          <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-warm-cream mb-6 font-oldschoolgrotesk">Complaints by Priority</h2>
          <div className="space-y-4">
            {Object.entries(priorityStats).map(([priority, count]) => {
              const colors = {
                high: 'bg-ember-orange',
                medium: 'bg-schoolbus-yellow',
                low: 'bg-cobalt-blue',
              };
              return (
                <div key={priority} className="space-y-2">
                  <div className="flex justify-between text-xs font-medium tracking-wide">
                    <span className="capitalize text-warm-cream/60">{priority}</span>
                    <span className="text-warm-cream font-bold">{count}</span>
                  </div>
                  <div className="h-2 bg-pitch-black rounded-full overflow-hidden">
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

        <div className="rounded-[25px] border border-charcoal-900 bg-charcoal-900/60 p-6 shadow-none relative overflow-hidden">
          <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-warm-cream mb-6 font-oldschoolgrotesk">Status Distribution</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="text-center p-4 rounded-[25px] bg-pitch-black border border-charcoal-900">
              <p className="text-3xl font-black text-ember-orange font-oldschoolgrotesk">{statusStats.pending || 0}</p>
              <p className="text-[10px] font-bold tracking-widest text-warm-cream/60 uppercase mt-1">Pending</p>
            </div>
            <div className="text-center p-4 rounded-[25px] bg-pitch-black border border-charcoal-900">
              <p className="text-3xl font-black text-iris-violet font-oldschoolgrotesk">{statusStats.in_progress || 0}</p>
              <p className="text-[10px] font-bold tracking-widest text-warm-cream/60 uppercase mt-1">In Progress</p>
            </div>
            <div className="text-center p-4 rounded-[25px] bg-pitch-black border border-charcoal-900">
              <p className="text-3xl font-black text-acid-lime font-oldschoolgrotesk">{statusStats.resolved || 0}</p>
              <p className="text-[10px] font-bold tracking-widest text-warm-cream/60 uppercase mt-1">Resolved</p>
            </div>
          </div>
        </div>

        <div className="rounded-[25px] border border-charcoal-900 bg-charcoal-900/60 p-6 shadow-none relative overflow-hidden">
          <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-warm-cream mb-6 font-oldschoolgrotesk">Monthly Trend</h2>
          <div className="h-48 px-2">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full overflow-visible">
              <defs>
                <linearGradient id="monthlyTrendLine" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c8ff2d" />
                  <stop offset="100%" stopColor="#f6c445" />
                </linearGradient>
                <linearGradient id="monthlyTrendFill" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#c8ff2d" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#c8ff2d" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="100" x2="100" y2="100" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
              {chartPath && (
                <>
                  <path d={`${chartPath} L 100 100 L 0 100 Z`} fill="url(#monthlyTrendFill)" />
                  <path d={chartPath} fill="none" stroke="url(#monthlyTrendLine)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                </>
              )}
              {chartPoints.map((point, index) => (
                <g key={`${point.label}-${index}`}>
                  <circle cx={point.x} cy={point.y} r="2.8" fill="#c8ff2d" />
                  <circle cx={point.x} cy={point.y} r="5" fill="transparent" stroke="rgba(200,255,45,0.18)" strokeWidth="2" />
                </g>
              ))}
            </svg>
            <div className="mt-3 grid grid-cols-6 gap-2 px-1">
              {monthlyTrend.map((month, i) => (
                <div key={`${month.label}-${i}`} className="text-center">
                  <span className="block text-[10px] font-bold tracking-widest text-warm-cream/40 uppercase">{month.label || 'No Data'}</span>
                  <span className="mt-1 block text-[10px] font-bold tracking-widest text-acid-lime uppercase">{month.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAnalytics;
