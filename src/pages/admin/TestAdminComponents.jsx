import React, { useState } from 'react';
import { 
  AdminTable, 
  StatusDropdown, 
  FilterBar, 
  SearchBox 
} from '../../components/admin';
import StatusBadge from '../../components/ui/StatusBadge';

const TestAdminComponents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('all');

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Title', accessor: 'title' },
    { 
      header: 'Status', 
      cell: (row) => <StatusBadge status={row.status} /> 
    },
    { header: 'User', accessor: 'user' },
    { 
      header: 'Actions', 
      cell: (row) => (
        <button className="text-blue-600 hover:underline font-medium">
          View Details
        </button>
      ) 
    },
  ];

  const data = [
    { id: '1', title: 'Broken Window', status: 'pending', user: 'John Doe' },
    { id: '2', title: 'Wi-Fi Down', status: 'in_progress', user: 'Jane Smith' },
    { id: '3', title: 'Leaking Pipe', status: 'resolved', user: 'Mike Ross' },
  ];

  const filteredData = data.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = status === 'all' || item.status === status;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 md:p-8 space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Admin Components Test Bench</h2>
        <p className="text-slate-600 mb-6">Testing reusability and responsive behavior.</p>
        
        <FilterBar>
          <SearchBox 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="flex-1"
          />
          <StatusDropdown 
            value={status} 
            onChange={(e) => setStatus(e.target.value)} 
          />
        </FilterBar>

        <AdminTable 
          columns={columns} 
          data={filteredData} 
          isLoading={false}
        />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Loading State Test</h2>
        <AdminTable 
          columns={columns} 
          data={[]} 
          isLoading={true} 
        />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Empty State Test</h2>
        <AdminTable 
          columns={columns} 
          data={[]} 
          isLoading={false} 
          emptyMessage="Custom empty message: No records match your criteria."
        />
      </section>
    </div>
  );
};

export default TestAdminComponents;
