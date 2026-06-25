import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth.js';
import StatusBadge from '../ui/StatusBadge';

const ComplaintCard = ({ complaint, onDelete }) => {
  const { user } = useAuth();
  const { title, category, submittedAt, status, id } = complaint;
  
  const ownerId = complaint.studentId || complaint.createdBy || complaint.student;
  const isOwner = user?.role === 'admin' || (ownerId && ownerId.toString() === user?.id?.toString());
  const isPending = status.toLowerCase() === 'pending';
  const canModify = isPending && isOwner;

  return (
    <div className="flex flex-col rounded-[25px] border border-charcoal-900 bg-charcoal-900/60 p-6 shadow-none transition-all hover:border-warm-cream/20 group relative overflow-hidden">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-warm-cream/60 font-mono">
              {id}
            </span>
            <span className="h-1 w-1 rounded-full bg-charcoal-900"></span>
            <span className="text-[10px] font-bold text-warm-cream/60 uppercase tracking-wider">
              {category}
            </span>
          </div>
          <h3 className="text-base font-semibold text-warm-cream leading-tight transition-colors">
            {title}
          </h3>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="mt-6 flex flex-col gap-5 border-t border-charcoal-900 pt-5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-bold tracking-widest text-warm-cream/40">Created Date</span>
            <span className="text-xs font-semibold text-warm-cream mt-0.5">
              {new Date(submittedAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          
          <Link 
            to={`/student/complaints/${id}`}
            className="rounded-full border border-charcoal-900 bg-transparent px-4 py-2 text-[10px] font-bold tracking-widest text-warm-cream hover:bg-warm-cream hover:text-pitch-black hover:border-warm-cream transition-all flex items-center gap-1 uppercase"
          >
            View Details ↗
          </Link>
        </div>

        {/* Action Buttons: Only for Pending Complaints */}
        {canModify && (
          <div className="flex items-center gap-3 pt-1">
            <Link
              to={`/student/complaints/edit/${id}`}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-full border border-charcoal-900 bg-transparent py-2.5 text-[10px] font-bold tracking-widest text-warm-cream hover:bg-charcoal-900 transition-all uppercase cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-warm-cream/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </Link>
            <button
              onClick={() => onDelete(id)}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-full border border-ember-orange/40 bg-transparent py-2.5 text-[10px] font-bold tracking-widest text-ember-orange hover:bg-ember-orange/10 transition-all uppercase cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
