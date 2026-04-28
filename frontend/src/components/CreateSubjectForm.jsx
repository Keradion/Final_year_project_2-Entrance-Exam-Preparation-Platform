import React, { useState } from 'react';
import { getSubjects } from '../services/subject';
import api from '../services/api';
import { Plus, GraduationCap, BookOpen, Save } from 'lucide-react';

const gradeLevels = [9, 10, 11, 12];

const CreateSubjectForm = ({ onCreate }) => {
  const [grade, setGrade] = useState('');
  const [name, setName] = useState('');
  const [stream, setStream] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!grade || !name.trim()) {
      setError('Grade and subject name are required.');
      return;
    }
    
    // For grade 11 and 12, stream might be expected but we allow General/None
    const finalStream = stream || null;

    setError('');
    setLoading(true);
    try {
      await api.post('/subjects', { 
        gradeLevel: grade, 
        subjectName: name.trim(),
        stream: finalStream
      });
      setGrade('');
      setName('');
      setStream('');
      if (onCreate) onCreate(); // refresh subject list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create subject');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto py-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-2">Academic Grade</label>
            <div className="relative">
              <select
                value={grade}
                onChange={e => setGrade(e.target.value)}
                className="w-full bg-white border border-outline/20 rounded-lg px-4 py-3 pl-11 text-sm font-medium outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all appearance-none cursor-pointer"
              >
                <option value="">Select Grade Level</option>
                {gradeLevels.map(g => (
                  <option key={g} value={g}>Grade {g}</option>
                ))}
              </select>
              <GraduationCap size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-on-surface mb-2">Academic Stream</label>
            <div className="relative">
              <select
                value={stream}
                onChange={e => setStream(e.target.value)}
                className="w-full bg-white border border-outline/20 rounded-lg px-4 py-3 pl-11 text-sm font-medium outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all appearance-none cursor-pointer"
              >
                <option value="">General</option>
                <option value="Natural">Natural</option>
                <option value="Social">Social</option>
              </select>
              <BookOpen size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-2">Subject Name</label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-white border border-outline/20 rounded-lg px-4 py-3 pl-11 text-sm font-medium outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                placeholder="e.g. Advanced Mathematics"
              />
              <Plus size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
            </div>
          </div>
          
          <div className="pt-7">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-container text-on-primary py-3 rounded-lg font-bold text-sm uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary-container/20"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-on-primary/20 border-t-on-primary rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save size={18} />
                  Create Subject
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 rounded-lg bg-error-container text-on-error-container text-sm flex items-center gap-3 animate-in shake-1">
          <Plus size={20} className="rotate-45" />
          <p>{error}</p>
        </div>
      )}
    </form>
  );
};

export default CreateSubjectForm;
