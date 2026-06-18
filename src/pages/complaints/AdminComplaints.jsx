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

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/complaints');
        setComplaints(data);
      } catch (err) {
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
        <Link 
          to={`/admin/complaints/${row.id}/status`}
          className="text-blue-700 hover:text-blue-900 font-medium text-sm transition-colors hover:underline"
        >
          Update Status
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Admin Complaint List</h1>
        <p className="mt-1 text-slate-600">Review and manage all submitted campus complaints.</p>
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
