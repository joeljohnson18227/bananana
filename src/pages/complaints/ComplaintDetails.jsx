import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api.js';
import { useAuth } from '../../context/useAuth.js';
import StatusBadge from '../../components/ui/StatusBadge';

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/complaints/${id}`);
        setComplaint(data);
      } catch {
        setError('Complaint not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center py-20 bg-pitch-black">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-acid-lime"></div>
    </div>
  );

  if (error || !complaint) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-pitch-black text-center">
        <h2 className="text-xl font-bold uppercase tracking-wide text-warm-cream">{error || 'Complaint Not Found'}</h2>
        <p className="text-xs text-warm-cream/60 mt-2">The complaint you are looking for does not exist.</p>
        <Link 
          to="/student/complaints" 
          className="mt-6 text-xs uppercase tracking-wider text-warm-cream border-b border-charcoal-900 hover:text-acid-lime hover:border-acid-lime transition-all pb-0.5"
        >
          Go back to my complaints
        </Link>
      </div>
    );
  }

  const isPending = complaint.status.toLowerCase() === 'pending';
  const ownerId = complaint.studentId || complaint.createdBy || complaint.student;
  const canEdit =
    isPending && (user?.role === 'admin' || (ownerId && ownerId.toString() === user?.id?.toString()));

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12 px-4 bg-pitch-black">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="rounded-full p-2 hover:bg-charcoal-900 text-warm-cream/60 hover:text-warm-cream transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-3xl font-black tracking-tight text-warm-cream uppercase font-oldschoolgrotesk">Complaint Details</h1>
      </div>

      <div className="rounded-[25px] border border-charcoal-900 bg-charcoal-900/60 overflow-hidden shadow-none relative">
        <div className="bg-charcoal-900/30 px-8 py-6 border-b border-charcoal-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold uppercase tracking-widest text-warm-cream/60 font-mono">
                {complaint.id}
              </span>
              <StatusBadge status={complaint.status} />
            </div>
            <h2 className="text-2xl font-bold text-warm-cream tracking-tight mt-1">{complaint.title}</h2>
          </div>
          
          {canEdit && (
            <div className="flex items-center gap-3">
              <Link
                to={`/student/complaints/edit/${complaint.id}`}
                className="rounded-full bg-acid-lime px-6 py-2.5 text-xs font-black tracking-widest text-pitch-black hover:bg-lime-400 transition-all uppercase cursor-pointer"
              >
                Edit Complaint ↗
              </Link>
            </div>
          )}
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-warm-cream/60 uppercase tracking-wider">Category</label>
              <p className="text-base font-semibold text-warm-cream">{complaint.category}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-warm-cream/60 uppercase tracking-wider">Created Date</label>
              <p className="text-base font-semibold text-warm-cream">
                {new Date(complaint.submittedAt).toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-warm-cream/60 uppercase tracking-wider">Priority</label>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  complaint.priority === 'high' ? 'bg-ember-orange animate-pulse' : 
                  complaint.priority === 'medium' ? 'bg-schoolbus-yellow' : 'bg-acid-lime'
                }`}></span>
                <p className="text-base font-semibold text-warm-cream capitalize">{complaint.priority}</p>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-warm-cream/60 uppercase tracking-wider">Location</label>
              <p className="text-base font-semibold text-warm-cream">{complaint.location || 'Not Specified'}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-warm-cream/60 uppercase tracking-wider">Description</label>
            <div className="rounded-[25px] bg-pitch-black p-6 text-sm text-warm-cream leading-relaxed border border-charcoal-900">
              {complaint.description}
            </div>
          </div>

          {complaint.assignedTo && (
            <div className="rounded-[25px] border border-charcoal-900 bg-charcoal-900/30 p-6 space-y-3">
              <h3 className="text-[10px] font-bold text-warm-cream uppercase tracking-widest">Administration Update</h3>
              <div className="flex items-center gap-4">
                <div className="bg-pitch-black rounded-full p-2 border border-charcoal-900 text-warm-cream">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-warm-cream/60 font-medium">Assigned to: <span className="font-bold text-warm-cream">{complaint.assignedTo}</span></p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;
