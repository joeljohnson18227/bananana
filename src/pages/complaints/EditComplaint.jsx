import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import ComplaintForm from '../../components/complaints/ComplaintForm';
import { useAuth } from '../../context/useAuth.js';

const EditComplaint = () => {
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

  const isOwner = () => {
    const ownerId = complaint?.studentId || complaint?.createdBy || complaint?.student;
    return user?.role === 'admin' || (ownerId && ownerId.toString() === user?.id?.toString());
  };

  const handleSubmit = async (updatedData) => {
    try {
      await api.put(`/complaints/${id}`, updatedData);
      alert('Complaint updated successfully!');
      navigate('/student/complaints');
    } catch {
      alert('Failed to update complaint.');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20 bg-pitch-black">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-acid-lime"></div>
    </div>
  );

  if (error || !complaint) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-pitch-black text-center">
        <h2 className="text-xl font-bold uppercase tracking-wide text-warm-cream">{error || 'Complaint Not Found'}</h2>
        <button 
          onClick={() => navigate('/student/complaints')}
          className="mt-6 text-xs uppercase tracking-wider text-warm-cream border-b border-charcoal-900 hover:text-acid-lime hover:border-acid-lime transition-all pb-1 cursor-pointer"
        >
          Go back to my complaints
        </button>
      </div>
    );
  }

  if (!isOwner()) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-pitch-black text-center">
        <h2 className="text-xl font-bold uppercase tracking-wide text-warm-cream">Action Not Allowed</h2>
        <p className="text-xs text-warm-cream/60 mt-2">You can only edit your own complaints.</p>
        <button 
          onClick={() => navigate('/student/complaints')}
          className="mt-6 text-xs uppercase tracking-wider text-warm-cream border-b border-charcoal-900 hover:text-acid-lime hover:border-acid-lime transition-all pb-1 cursor-pointer"
        >
          Go back to my complaints
        </button>
      </div>
    );
  }

  // Only pending complaints can be edited
  if (complaint.status.toLowerCase() !== 'pending') {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-pitch-black text-center">
        <h2 className="text-xl font-bold uppercase tracking-wide text-warm-cream">Action Not Allowed</h2>
        <p className="text-xs text-warm-cream/60 mt-2">Only pending complaints can be edited.</p>
        <button 
          onClick={() => navigate('/student/complaints')}
          className="mt-6 text-xs uppercase tracking-wider text-warm-cream border-b border-charcoal-900 hover:text-acid-lime hover:border-acid-lime transition-all pb-1 cursor-pointer"
        >
          Go back to my complaints
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 pb-12 px-4 bg-pitch-black">
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
          <h1 className="text-3xl font-black tracking-tight text-warm-cream uppercase font-oldschoolgrotesk">Edit Complaint</h1>
          <p className="text-[10px] text-warm-cream/40 font-mono tracking-wider">{id}</p>
        </div>
      </div>

      <div className="rounded-[25px] border border-charcoal-900 bg-charcoal-900/60 p-6 shadow-none relative overflow-hidden">
        <ComplaintForm 
          onSubmit={handleSubmit} 
          initialData={complaint} 
          submitButtonText="Save Changes"
        />
      </div>
    </div>
  );
};

export default EditComplaint;
