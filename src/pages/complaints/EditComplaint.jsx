import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import ComplaintForm from '../../components/complaints/ComplaintForm';

const EditComplaint = () => {
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

  const handleSubmit = async (updatedData) => {
    try {
      await api.put(`/complaints/${id}`, updatedData);
      alert('Complaint updated successfully!');
      navigate('/student/complaints');
    } catch (err) {
      alert('Failed to update complaint.');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
    </div>
  );

  if (error || !complaint) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold text-slate-900">{error || 'Complaint Not Found'}</h2>
        <button 
          onClick={() => navigate('/student/complaints')}
          className="mt-4 text-blue-600 font-bold hover:underline"
        >
          Go back to my complaints
        </button>
      </div>
    );
  }

  // Only pending complaints can be edited
  if (complaint.status.toLowerCase() !== 'pending') {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold text-slate-900">Action Not Allowed</h2>
        <p className="text-slate-600 mt-2">Only pending complaints can be edited.</p>
        <button 
          onClick={() => navigate('/student/complaints')}
          className="mt-4 text-blue-600 font-bold hover:underline"
        >
          Go back to my complaints
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 pb-12 px-4">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="rounded-full p-2 hover:bg-slate-100 transition-colors"
        >
          <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">Edit Complaint</h1>
          <p className="text-slate-500 font-mono text-xs">{id}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
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
