import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import ComplaintForm from '../../components/complaints/ComplaintForm';
import StatusBadge from '../../components/ui/StatusBadge';

const SubmitComplaint = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchHistory() {
    try {
      const { data } = await api.get('/complaints');
      setSubmissions(data.slice(0, 3));
    } catch (err) {
      console.error('Failed to fetch history', err);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchHistory();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const { data } = await api.post('/complaints', formData);
      setSubmissions((prev) => [data, ...prev]);
      alert('Complaint submitted successfully and saved!');
    } catch (err) {
      alert('Failed to submit complaint.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8 pb-10 bg-pitch-black">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-black tracking-tight text-warm-cream uppercase font-oldschoolgrotesk">Submit New Complaint</h1>
        <p className="text-xs text-warm-cream/60 tracking-wide font-light">Report an issue to campus administration. All fields are required.</p>
      </div>

      <div className="rounded-[25px] border border-charcoal-900 bg-charcoal-900/60 p-6 shadow-none relative overflow-hidden">
        <ComplaintForm onSubmit={handleSubmit} />
        {loading && (
          <p className="mt-4 text-xs font-black uppercase tracking-wider text-acid-lime animate-pulse">Submitting complaint...</p>
        )}
      </div>

      {submissions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xs font-bold tracking-[0.25em] uppercase text-warm-cream">Recent Submissions (Persisted)</h2>
          <div className="space-y-4">
            {submissions.map((sub) => (
              <div key={sub.id} className="rounded-[25px] border border-charcoal-900 bg-charcoal-900/30 p-5 shadow-none space-y-3 relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-warm-cream">{sub.title}</h3>
                    <p className="text-[10px] text-warm-cream/60 font-mono mt-0.5">{sub.id}</p>
                  </div>
                  <StatusBadge status={sub.status} />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-warm-cream/40 block uppercase tracking-wider text-[9px] font-bold">Category</span>
                    <span className="text-warm-cream font-semibold">{sub.category}</span>
                  </div>
                  <div>
                    <span className="text-warm-cream/40 block uppercase tracking-wider text-[9px] font-bold">Location</span>
                    <span className="text-warm-cream font-semibold">{sub.location}</span>
                  </div>
                </div>

                <div>
                  <span className="text-warm-cream/40 block uppercase tracking-wider text-[9px] font-bold">Description</span>
                  <p className="text-warm-cream/60 text-xs mt-1">{sub.description}</p>
                </div>

                {Array.isArray(sub.attachments) && sub.attachments.length > 0 && (
                  <div className="text-[10px] uppercase tracking-wider text-warm-cream/40">
                    {sub.attachments.length} attachment{sub.attachments.length === 1 ? '' : 's'} included
                  </div>
                )}

                <div className="pt-2 text-[10px] text-warm-cream/40 border-t border-charcoal-900">
                  Submitted: {new Date(sub.submittedAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmitComplaint;
