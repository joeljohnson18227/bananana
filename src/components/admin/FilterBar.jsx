import React from 'react';

const FilterBar = ({ children, className = '' }) => {
  return (
    <div
      className={`flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-6 ${className}`}
    >
      {children}
    </div>
  );
};

export default FilterBar;
