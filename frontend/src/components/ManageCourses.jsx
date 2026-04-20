
import React, { useState, useEffect } from 'react';
import CreateSubjectForm from './CreateSubjectForm';
import { getSubjects, updateSubject } from '../services/subject';
import api from '../services/api';


const ManageCourses = () => {
  const [subjects, setSubjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ gradeLevel: '', subjectName: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [assigningId, setAssigningId] = useState(null);
  const [assignEmail, setAssignEmail] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState('');
  const [assignSuccess, setAssignSuccess] = useState('');
  const [assignFirstName, setAssignFirstName] = useState('');
  const [assignLastName, setAssignLastName] = useState('');
  const handleAssignClick = (subjectId) => {
    setAssigningId(subjectId);
    setAssignEmail('');
    setAssignFirstName('');
    setAssignLastName('');
    setAssignError('');
    setAssignSuccess('');
  };

  useEffect(() => {
    fetchSubjects();
    // eslint-disable-next-line
  }, []);

  const handleEditClick = (subject) => {
    setEditingId(subject._id);
    setEditData({ gradeLevel: subject.gradeLevel, subjectName: subject.subjectName });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (id) => {
    setLoading(true);
    setError('');
    try {
      await updateSubject(id, editData);
      setSuccess('Subject updated successfully');
      setEditingId(null);
      fetchSubjects();
    } catch (err) {
      setError('Failed to update subject');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getSubjects();
      setSubjects(data);
    } catch (err) {
      setError('Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTeacher = async (subjectId) => {
    setAssignLoading(true);
    setAssignError('');
    setAssignSuccess('');
    try {
      const res = await api.post(`/subjects/${subjectId}/invite-assign-teacher`, {
        email: assignEmail,
        firstName: assignFirstName,
        lastName: assignLastName
      });
      if (res.data && res.data.isNew) {
        setAssignSuccess(`A new teacher account was created for ${assignFirstName} ${assignLastName} (${assignEmail}). An invitation email has been sent.`);
      } else {
        setAssignSuccess(`The teacher (${assignEmail}) was assigned to this subject and notified by email.`);
      }
      setAssigningId(null);
      fetchSubjects();
    } catch (err) {
      if (err.response?.data?.message) {
        setAssignError(`Assignment failed: ${err.response.data.message}`);
      } else {
        setAssignError('Assignment failed due to a network or server error.');
      }
    } finally {
      setAssignLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="rounded-2xl border border-[#e3e6ea] bg-white p-8 shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Create Subject</h2>
        <CreateSubjectForm onCreate={fetchSubjects} />
      </div>
      <div className="rounded-2xl border border-[#e3e6ea] bg-white p-8 shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Subjects</h2>
        {loading && <p className="text-gray-600">Loading...</p>}
        {error && <p className="text-red-600 font-medium">{error}</p>}
        {success && <p className="text-green-600 font-medium">{success}</p>}
        {subjects.length === 0 ? (
          <p className="text-[#5f6368]">No subjects found.</p>
        ) : (
          <ul className="space-y-4">
            {subjects.map((subj) => (
              <li key={subj._id} className="border rounded-xl px-6 py-4 flex flex-col md:flex-row md:items-center md:gap-6 gap-2 bg-[#f9fafb] shadow-sm">
                <div className="flex-1 flex flex-col md:flex-row md:items-center md:gap-6 gap-1">
                  {editingId === subj._id ? (
                    <>
                      <input
                        name="gradeLevel"
                        value={editData.gradeLevel}
                        onChange={handleEditChange}
                        className="border border-blue-400 rounded-lg px-3 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Grade"
                      />
                      <input
                        name="subjectName"
                        value={editData.subjectName}
                        onChange={handleEditChange}
                        className="border border-blue-400 rounded-lg px-3 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Subject Name"
                      />
                      <button onClick={() => handleEditSave(subj._id)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold ml-2 transition">Save</button>
                      <button onClick={() => setEditingId(null)} className="ml-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition">Cancel</button>
                    </>
                  ) : (
                    <>
                      <span className="font-semibold text-lg text-blue-700">Grade {subj.gradeLevel}</span>
                      <span className="text-gray-800 text-lg">{subj.subjectName}</span>
                      <button onClick={() => handleEditClick(subj)} className="ml-4 px-4 py-2 rounded-lg border border-blue-600 text-blue-700 hover:bg-blue-50 font-medium transition">Edit</button>
                      <button onClick={() => handleAssignClick(subj._id)} className="ml-2 px-4 py-2 rounded-lg border border-green-600 bg-green-50 text-green-700 hover:bg-green-100 font-medium transition">Assign Teacher</button>
                    </>
                  )}
                </div>
                {/* Inline assign teacher form */}
                {assigningId === subj._id && (
                  <div className="mt-4 md:mt-0 flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
                    <input
                      type="email"
                      placeholder="Teacher email"
                      value={assignEmail}
                      onChange={e => setAssignEmail(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-56 focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                    <input
                      type="text"
                      placeholder="First name"
                      value={assignFirstName}
                      onChange={e => setAssignFirstName(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                    <input
                      type="text"
                      placeholder="Last name"
                      value={assignLastName}
                      onChange={e => setAssignLastName(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                    <div className="flex gap-2 mt-2 md:mt-0">
                      <button
                        onClick={() => handleAssignTeacher(subj._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
                        disabled={assignLoading}
                      >
                        {assignLoading ? 'Assigning...' : 'Send Invite'}
                      </button>
                      <button onClick={() => setAssigningId(null)} className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100">Cancel</button>
                    </div>
                    {assignError && <div className="text-red-600 text-sm font-medium mt-1">{assignError}</div>}
                    {assignSuccess && <div className="text-green-600 text-sm font-medium mt-1">{assignSuccess}</div>}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ManageCourses;
