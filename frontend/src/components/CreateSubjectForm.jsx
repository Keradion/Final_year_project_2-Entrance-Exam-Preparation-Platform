import React, { useState } from 'react';
import { getSubjects } from '../services/subject';
import api from '../services/api';
import { Plus } from 'lucide-react';

const gradeLevels = [9, 10, 11, 12];

const CreateSubjectForm = ({ onCreate }) => {
  const [grade, setGrade] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!grade || !name.trim()) {
      setError('Both grade level and subject name are required.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await api.post('/subjects', { gradeLevel: grade, subjectName: name.trim() });
      setGrade('');
      setName('');
      if (onCreate) onCreate(); // refresh subject list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create subject');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      <div className="space-y-6">
        <div>
          <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-3">Institutional Grade Level</label>
          <select
            value={grade}
            onChange={e => setGrade(e.target.value)}
            className="w-full bg-white border border-outline/10 rounded-lg px-5 py-4 font-bold text-on-surface focus:border-primary-container outline-none transition-all shadow-sm"
          >
            <option value="">Select Grade</option>
            {gradeLevels.map(g => (
              <option key={g} value={g}>Grade {g}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-3">Academic Subject Title</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-white border border-outline/10 rounded-lg px-5 py-4 font-bold text-on-surface placeholder:text-on-surface-variant/30 focus:border-primary-container outline-none transition-all shadow-sm"
            placeholder="e.g. Theoretical Physics"
          />
        </div>
      </div>

      {error && <p className="text-error text-[10px] font-black uppercase tracking-widest bg-error/5 p-3 rounded-md border border-error/10">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary-container text-on-primary py-4 rounded-lg font-black uppercase tracking-widest text-xs hover:brightness-110 transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary-container/20"
      >
        {loading ? <div className="w-4 h-4 border-2 border-on-primary/20 border-t-on-primary rounded-full animate-spin"></div> : <Plus size={18} strokeWidth={3} />}
        {loading ? 'Processing...' : 'Register Subject'}
      </button>
    </form>
  );
};

export default CreateSubjectForm;
