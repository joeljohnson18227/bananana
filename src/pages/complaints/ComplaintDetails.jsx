import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api.js';
import StatusBadge from '../../components/ui/StatusBadge';

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/complaints/${id}`);
        setComplaint(data);
      } catch (err) {
        setError('Complaint not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
    </div>
  );

  if (error || !complaint) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold text-slate-900">{error || 'Complaint Not Found'}</h2>
        <p className="text-slate-600 mt-2">The complaint you are looking for does not exist.</p>
        <Link to="/student/complaints" className="mt-4 text-blue-600 font-bold hover:underline">
          Go back to my complaints
        </Link>
      </div>
    );
  }

  const isPending = complaint.status.toLowerCase() === 'pending';

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12 px-4">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="rounded-full p-2 hover:bg-slate-100 transition-colors"
        >
          <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">Complaint Details</h1>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-8 py-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono">
                {complaint.id}
              </span>
              <StatusBadge status={complaint.status} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{complaint.title}</h2>
          </div>
          
          {isPending && (
            <div className="flex items-center gap-3">
              <Link
                to={`/student/complaints/edit/${complaint.id}`}
                className="rounded-xl bg-blue-700 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-800 transition-all shadow-md active:scale-95"
              >
                Edit Complaint
              </Link>
            </div>
          )}
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</label>
              <p className="text-lg font-semibold text-slate-800">{complaint.category}</p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Created Date</label>
              <p className="text-lg font-semibold text-slate-800">
                {new Date(complaint.submittedAt).toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Priority</label>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${
                  complaint.priority === 'high' ? 'bg-red-500' : 
                  complaint.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                }`}></span>
                <p className="text-lg font-semibold text-slate-800 capitalize">{complaint.priority}</p>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location</label>
              <p className="text-lg font-semibold text-slate-800">{complaint.location || 'Not Specified'}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</label>
            <div className="rounded-2xl bg-slate-50 p-6 text-slate-700 leading-relaxed border border-slate-100">
              {complaint.description}
            </div>
          </div>

          {complaint.assignedTo && (
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6 space-y-3">
              <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider">Administration Update</h3>
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 rounded-full p-2">
                  <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-blue-800 font-medium">Assigned to: <span className="font-bold">{complaint.assignedTo}</span></p>
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
