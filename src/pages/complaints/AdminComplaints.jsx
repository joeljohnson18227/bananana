import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api.js';
import StatusBadge from '../../components/ui/StatusBadge';
import Select from '../../components/ui/Select';
import { 
  AdminTable, 
  FilterBar, 
  SearchBox, 
  StatusDropdown 
} from '../../components/admin';
import { CATEGORIES } from '../../data/dummyData.js';

import { Link } from 'react-router-dom';

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [updatingPriorityId, setUpdatingPriorityId] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/complaints');
        setComplaints(data);
      } catch {
        console.error('Failed to fetch complaints');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const filteredAndSortedComplaints = useMemo(() => {
    let result = complaints.filter((c) => {
      const searchLower = search.toLowerCase();
      const matchesSearch = 
        (c.title || '').toLowerCase().includes(searchLower) ||
        (c.studentName || '').toLowerCase().includes(searchLower) ||
        (c.id || '').toLowerCase().includes(searchLower);
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });

    result.sort((a, b) => {
      const dateA = new Date(a.submittedAt || 0);
      const dateB = new Date(b.submittedAt || 0);
      const isAsc = sortOrder === 'asc' || sortOrder === 'asc_alt';
      return isAsc ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [complaints, search, statusFilter, categoryFilter, sortOrder]);

  const columns = [
    { header: 'Student Name', accessor: 'studentName' },
    { header: 'Complaint Title', accessor: 'title' },
    { header: 'Category', accessor: 'category' },
    { 
      header: 'Date', 
      cell: (row) => {
        const date = new Date(row.submittedAt);
        if (isNaN(date.getTime())) return 'Invalid Date';
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
    },
    { 
      header: 'Status', 
      cell: (row) => <StatusBadge status={row.status} /> 
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex flex-col gap-3 min-w-[180px]">
          <Link
            to={`/admin/complaints/${row.id}/status`}
            className="text-[10px] font-black tracking-widest text-acid-lime hover:text-lime-400 uppercase transition-all cursor-pointer"
          >
            Update Status ↗
          </Link>
          <div className="space-y-1.5">
            <span className="block text-[9px] font-bold tracking-[0.2em] text-warm-cream/40 uppercase">Priority</span>
            <Select
              value={row.priority || 'medium'}
              onChange={async (e) => {
                const nextPriority = e.target.value;

                if (nextPriority === row.priority) {
                  return;
                }

                try {
                  setUpdatingPriorityId(row.id);
                  const { data } = await api.patch(`/admin/complaints/${row.id}/priority`, {
                    priority: nextPriority,
                  });
                  setComplaints((current) =>
                    current.map((complaint) =>
                      complaint.id === row.id ? { ...complaint, priority: data.priority } : complaint,
                    ),
                  );
                } catch {
                  alert('Failed to update priority.');
                } finally {
                  setUpdatingPriorityId(null);
                }
              }}
              options={[
                { label: 'Low', value: 'low' },
                { label: 'Medium', value: 'medium' },
                { label: 'High', value: 'high' },
              ]}
              className="w-full"
              disabled={updatingPriorityId === row.id}
            />
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 bg-pitch-black">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-warm-cream uppercase font-oldschoolgrotesk">Admin Complaint List</h1>
        <p className="mt-1.5 text-xs text-warm-cream/60 tracking-wide font-light">Review and manage all submitted campus complaints.</p>
      </div>

      <FilterBar>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center w-full">
          <div className="md:col-span-1">
            <SearchBox 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              placeholder="Search student or title..."
            />
          </div>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[{ label: 'All Categories', value: 'all' }, ...CATEGORIES]}
            className="w-full"
          />
          <StatusDropdown 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)} 
            className="w-full"
          />
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            options={[
              { label: 'Newest First', value: 'desc' },
              { label: 'Oldest First', value: 'asc' },
              { label: 'Descending order', value: 'desc_alt' },
              { label: 'Ascending order', value: 'asc_alt' },
            ]}
            className="w-full"
          />
        </div>
      </FilterBar>

      <AdminTable 
        columns={columns} 
        data={filteredAndSortedComplaints} 
        isLoading={loading}
        emptyMessage="No complaints found matching your criteria."
      />
    </div>
  );
};

export default AdminComplaints;
