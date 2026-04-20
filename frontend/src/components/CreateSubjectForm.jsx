
import React, { useState } from 'react';
import { getSubjects } from '../services/subject';
import api from '../services/api';

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
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className="block mb-1 font-semibold">Grade Level</label>
        <select
          value={grade}
          onChange={e => setGrade(e.target.value)}
          className="w-full rounded border px-3 py-2"
        >
          <option value="">Select grade</option>
          {gradeLevels.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1 font-semibold">Subject Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full rounded border px-3 py-2"
          placeholder="e.g. Mathematics"
        />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button
        type="submit"
        className="bg-[#1a73e8] text-white px-4 py-2 rounded font-bold hover:bg-[#1765cc]"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Subject'}
      </button>
    </form>
  );
};

export default CreateSubjectForm;
