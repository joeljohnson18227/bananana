import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import ComplaintCard from '../../components/complaints/ComplaintCard';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const CATEGORIES = [
  { label: 'All Categories', value: 'all' },
  { label: 'Classroom', value: 'Classroom' },
  { label: 'Laboratory', value: 'Laboratory' },
  { label: 'Hostel', value: 'Hostel' },
  { label: 'Library', value: 'Library' },
  { label: 'Internet/Wi-Fi', value: 'Internet/Wi-Fi' },
  { label: 'Electrical', value: 'Electrical' },
  { label: 'Water Supply', value: 'Water Supply' },
  { label: 'Cleanliness', value: 'Cleanliness' },
  { label: 'IT Infrastructure', value: 'IT Infrastructure' },
  { label: 'Facilities', value: 'Facilities' },
  { label: 'Food Services', value: 'Food Services' },
  { label: 'Safety', value: 'Safety' },
  { label: 'Academic', value: 'Academic' },
  { label: 'Other', value: 'Other' },
];

const STATUSES = [
  { label: 'All Status', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Resolved', value: 'resolved' },
];

const AllComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');

  async function fetchComplaints() {
    try {
      setLoading(true);
      const { data } = await api.get('/complaints');
      setComplaints(data);
    } catch (err) {
      setError('Failed to load complaints.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchComplaints();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const filteredComplaints = useMemo(() => {
    let result = complaints.filter((complaint) => {
      const matchesSearch =
        complaint.title.toLowerCase().includes(search.toLowerCase()) ||
        complaint.id.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || complaint.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    result.sort((a, b) => {
      const dateA = new Date(a.submittedAt || 0);
      const dateB = new Date(b.submittedAt || 0);
      const isAsc = sortOrder === 'asc' || sortOrder === 'asc_alt';
      return isAsc ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [complaints, search, categoryFilter, statusFilter, sortOrder]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this pending complaint?')) {
      try {
        await api.delete(`/complaints/${id}`);
        setComplaints((prev) => prev.filter((c) => c.id !== id));
      } catch {
        alert('Failed to delete complaint.');
      }
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20 bg-pitch-black">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-acid-lime"></div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center py-20 bg-pitch-black text-center">
      <p className="text-warm-cream font-bold uppercase tracking-wider text-sm mb-4">{error}</p>
      <button
        onClick={fetchComplaints}
        className="text-xs uppercase tracking-wider text-warm-cream border-b border-charcoal-900 hover:text-acid-lime hover:border-acid-lime transition-all pb-0.5 cursor-pointer"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-8 px-4 bg-pitch-black">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 border-b border-charcoal-900 pb-8">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-black tracking-tight text-warm-cream uppercase font-oldschoolgrotesk">All Complaints</h1>
          <p className="text-xs text-warm-cream/60 tracking-wide font-light">
            Browse every campus complaint in one place.
          </p>
        </div>
        <Link
          to="/student/submit"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-acid-lime px-6 py-3 text-xs font-black tracking-widest text-pitch-black hover:bg-lime-400 transition-all duration-300 uppercase cursor-pointer"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          New Complaint {''}
        </Link>
      </div>

      <div className="rounded-[25px] border border-charcoal-900 bg-charcoal-900/60 p-5 shadow-none relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <Input
            placeholder="Search by title or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            options={CATEGORIES}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          />
          <Select
            options={STATUSES}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
          <Select
            options={[
              { label: 'Newest First', value: 'desc' },
              { label: 'Oldest First', value: 'asc' },
              { label: 'Descending order', value: 'desc_alt' },
              { label: 'Ascending order', value: 'asc_alt' },
            ]}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          />
        </div>
      </div>

      {filteredComplaints.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredComplaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-charcoal-900/30 rounded-[25px] border border-dashed border-charcoal-900 px-6">
          <div className="rounded-lg bg-charcoal-900 p-4 mb-4 text-warm-cream">
            <svg className="w-8 h-8 text-warm-cream/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-sm font-bold tracking-[0.2em] text-warm-cream uppercase">No complaints found</h3>
          <p className="text-xs text-warm-cream/40 mt-2 text-center max-w-sm font-light leading-relaxed">
            We couldn't find any complaints matching your current filters. Try resetting them or search for something else.
          </p>
          <button
            onClick={() => { setSearch(''); setCategoryFilter('all'); setStatusFilter('all'); }}
            className="mt-6 text-xs font-bold tracking-widest text-acid-lime hover:underline uppercase transition-colors cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default AllComplaints;
