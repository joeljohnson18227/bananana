import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api.js';
import { useAuth } from '../../context/useAuth.js';
import StatusBadge from '../../components/ui/StatusBadge';

const AdminComplaintDetails = () => {
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

  useEffect(() => {
    const markViewed = async () => {
      if (!complaint || user?.role !== 'admin' || complaint.viewedByAdmin) {
        return;
      }

      try {
        const { data } = await api.patch(`/admin/complaints/${complaint.id}/viewed`);
        setComplaint(data);
      } catch {
        // Non-blocking: the details page should still render if this fails.
      }
    };

    markViewed();
  }, [complaint, user?.role]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 bg-pitch-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-acid-lime"></div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-pitch-black text-center">
        <h2 className="text-xl font-bold uppercase tracking-wide text-warm-cream">{error || 'Complaint Not Found'}</h2>
        <p className="text-xs text-warm-cream/60 mt-2">The complaint you are looking for does not exist.</p>
        <Link
          to="/admin/complaints"
          className="mt-6 text-xs uppercase tracking-wider text-warm-cream border-b border-charcoal-900 hover:text-acid-lime hover:border-acid-lime transition-all pb-0.5"
        >
          Back to admin complaints
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
        <div className="space-y-1.5">
          <h1 className="text-3xl font-black tracking-tight text-warm-cream uppercase font-oldschoolgrotesk">Complaint Details</h1>
          <p className="text-[10px] text-warm-cream/40 font-mono tracking-wider">Admin access</p>
        </div>
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
                to={`/admin/complaints/${complaint.id}/status`}
                className="rounded-full bg-acid-lime px-6 py-2.5 text-xs font-black tracking-widest text-pitch-black hover:bg-lime-400 transition-all uppercase cursor-pointer"
              >
                Update Status
              </Link>
            </div>
          )}
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-warm-cream/60 uppercase tracking-wider">Student</label>
              <p className="text-base font-semibold text-warm-cream">{complaint.studentName || 'Unknown'}</p>
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
              <p className="text-base font-semibold text-warm-cream capitalize">{complaint.priority}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-warm-cream/60 uppercase tracking-wider">Location</label>
              <p className="text-base font-semibold text-warm-cream">{complaint.location || 'Not Specified'}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-warm-cream/60 uppercase tracking-wider">Viewed</label>
              {complaint.viewedByAdmin ? (
                <span className="inline-flex items-center rounded-full border border-acid-lime/40 bg-acid-lime/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-acid-lime">
                  Viewed
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full border border-charcoal-900 bg-charcoal-900/40 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-warm-cream/40">
                  Not yet viewed
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-warm-cream/60 uppercase tracking-wider">Description</label>
            <div className="rounded-[25px] bg-pitch-black p-6 text-sm text-warm-cream leading-relaxed border border-charcoal-900">
              {complaint.description}
            </div>
          </div>

          {Array.isArray(complaint.attachments) && complaint.attachments.length > 0 && (
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-warm-cream/60 uppercase tracking-wider">
                Attached Media
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                {complaint.attachments.map((attachment, index) => {
                  const isVideo = attachment.kind === 'video' || attachment.type?.startsWith('video/');

                  return (
                    <div key={`${attachment.name}-${index}`} className="rounded-[25px] border border-charcoal-900 bg-pitch-black/80 overflow-hidden">
                      <div className="aspect-video bg-charcoal-900/50">
                        {isVideo ? (
                          <video className="h-full w-full object-cover" controls src={attachment.dataUrl} />
                        ) : (
                          <img className="h-full w-full object-cover" src={attachment.dataUrl} alt={attachment.name} />
                        )}
                      </div>
                      <div className="p-4 space-y-1">
                        <p className="truncate text-sm font-semibold text-warm-cream">{attachment.name}</p>
                        <p className="text-[10px] uppercase tracking-wider text-warm-cream/40">
                          {isVideo ? 'Video' : 'Photo'} • {Math.max(1, Math.round((attachment.size || 0) / 1024))} KB
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

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
                  <p className="text-sm text-warm-cream/60 font-medium">
                    Assigned to: <span className="font-bold text-warm-cream">{complaint.assignedTo}</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminComplaintDetails;
