import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import Select from '../../components/ui/Select';
import StatusBadge from '../../components/ui/StatusBadge';

const UpdateStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true);
        // In our mock API, get by ID is supported or we filter from all
        const { data } = await api.get('/complaints');
        const found = data.find(c => c.id === id);
        if (found) {
          setComplaint(found);
          setNewStatus(found.status);
        } else {
          setError('Complaint not found.');
        }
      } catch (err) {
        setError('Failed to fetch complaint details.');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id]);

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      setError('');
      
      // Simulate API call to update status
      await api.patch(`/complaints/${id}`, { status: newStatus });
      
      setComplaint(prev => ({ ...prev, status: newStatus }));
      setSuccess(true);
      setShowConfirmation(false);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (error && !complaint) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-red-50 border border-red-200 rounded-xl text-center">
        <p className="text-red-700 font-medium">{error}</p>
        <Link to="/admin/complaints" className="mt-4 inline-block text-blue-700 hover:underline">
          Back to Complaints
        </Link>
      </div>
    );
  }

  const statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Resolved', value: 'resolved' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Update Status</h1>
          <p className="text-slate-600 mt-1">Manage resolution progress for #{id}</p>
        </div>
        <Link 
          to="/admin/complaints"
          className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          ← Back to list
        </Link>
      </div>

      {/* Success Notification */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p className="font-medium">Status updated successfully!</p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-semibold text-slate-950">Complaint Overview</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500 font-medium uppercase text-[10px] tracking-wider">Student</p>
              <p className="text-slate-900 mt-1 font-medium">{complaint.studentName}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium uppercase text-[10px] tracking-wider">Current Status</p>
              <div className="mt-1">
                <StatusBadge status={complaint.status} />
              </div>
            </div>
            <div className="col-span-2">
              <p className="text-slate-500 font-medium uppercase text-[10px] tracking-wider">Subject</p>
              <p className="text-slate-900 mt-1">{complaint.title}</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="max-w-xs">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Change Status To
            </label>
            <Select
              options={statusOptions}
              value={newStatus}
              onChange={(e) => {
                setNewStatus(e.target.value);
                setSuccess(false);
                setShowConfirmation(false);
              }}
            />
          </div>

          {/* Action Area */}
          {!showConfirmation ? (
            <button
              onClick={() => setShowConfirmation(true)}
              disabled={newStatus === complaint.status}
              className="px-6 py-2.5 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              Update Status
            </button>
          ) : (
            <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-amber-100 rounded-full text-amber-700">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-amber-900 font-bold">Confirm Status Change</h3>
                  <p className="text-amber-800 text-sm mt-1">
                    Are you sure you want to change the status from <span className="font-bold uppercase">{complaint.status.replace('_', ' ')}</span> to <span className="font-bold uppercase">{newStatus.replace('_', ' ')}</span>?
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={handleUpdate}
                      disabled={isUpdating}
                      className="px-4 py-2 bg-amber-600 text-white text-sm font-bold rounded-lg hover:bg-amber-700 transition-colors shadow-sm disabled:opacity-50"
                    >
                      {isUpdating ? 'Updating...' : 'Yes, Confirm'}
                    </button>
                    <button
                      onClick={() => setShowConfirmation(false)}
                      className="px-4 py-2 bg-white text-slate-700 text-sm font-bold rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateStatus;
