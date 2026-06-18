import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../ui/StatusBadge';

const ComplaintCard = ({ complaint, onDelete }) => {
  const { title, category, submittedAt, status, id } = complaint;
  
  // Requirement: Edit/Delete only for Pending complaints
  const isPending = status.toLowerCase() === 'pending';

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-100 group">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              {id}
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300"></span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-tight">
              {category}
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-blue-700 transition-colors">
            {title}
          </h3>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="mt-6 flex flex-col gap-5 border-t border-slate-50 pt-5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400">Created Date</span>
            <span className="text-sm font-medium text-slate-600">
              {new Date(submittedAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          
          <Link 
            to={`/student/complaints/${id}`}
            className="rounded-lg px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 transition-all flex items-center gap-1.5"
          >
            View Details
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Action Buttons: Only for Pending Complaints */}
        {isPending && (
          <div className="flex items-center gap-3 pt-1">
            <Link
              to={`/student/complaints/edit/${id}`}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </Link>
            <button
              onClick={() => onDelete(id)}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-rose-100 bg-rose-50 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-100 hover:border-rose-200 transition-all shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintCard;
