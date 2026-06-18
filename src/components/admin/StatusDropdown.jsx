import React from 'react';
import Select from '../ui/Select';

const StatusDropdown = ({ value, onChange, label, className = '' }) => {
  const options = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <Select
      label={label}
      value={value}
      onChange={onChange}
      options={options}
      className={`w-full md:min-w-[150px] md:w-auto ${className}`}
    />
  );
};

export default StatusDropdown;
