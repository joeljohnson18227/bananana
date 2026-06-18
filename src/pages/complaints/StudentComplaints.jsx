import React, { useState, useMemo, useEffect } from 'react';
import api from '../../services/api.js';
import ComplaintCard from '../../components/complaints/ComplaintCard';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { SearchBox } from '../../components/admin';

import { CATEGORIES } from '../../data/dummyData.js';

const STATUSES = [
  { label: 'All Status', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Resolved', value: 'resolved' },
];

const StudentComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
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
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this pending complaint?')) {
      try {
        await api.delete(`/complaints/${id}`);
        setComplaints((prev) => prev.filter((c) => c.id !== id));
      } catch (err) {
        alert('Failed to delete complaint.');
      }
    }
  };

  const filteredComplaints = useMemo(() => {
    let result = complaints.filter((complaint) => {
      const matchesSearch = complaint.title.toLowerCase().includes(search.toLowerCase()) ||
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

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center py-20 text-red-600">
      <p>{error}</p>
      <button onClick={fetchComplaints} className="mt-4 text-blue-600 font-bold hover:underline">Try Again</button>
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12 px-4">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 border-b border-slate-100 pb-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-slate-950 tracking-tight">My Complaints</h1>
          <p className="text-slate-500 text-lg">Manage and track your submitted campus issues.</p>
        </div>
        <a
          href="/student/submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white hover:bg-blue-800 transition-all shadow-md active:scale-95"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          New Complaint
        </a>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <SearchBox
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

      {/* Complaints Display */}
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
        <div className="flex flex-col items-center justify-center py-24 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <div className="rounded-2xl bg-white p-5 shadow-sm mb-5">
            <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900">No complaints found</h3>
          <p className="text-slate-500 mt-2 text-center max-w-sm px-6">
            We couldn't find any complaints matching your current filters. Try resetting them or search for something else.
          </p>
          <button 
            onClick={() => { setSearch(''); setCategoryFilter('all'); setStatusFilter('all'); }}
            className="mt-6 font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentComplaints;
