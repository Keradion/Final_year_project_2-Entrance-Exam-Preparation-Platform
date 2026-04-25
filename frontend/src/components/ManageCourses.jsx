import React, { useState, useEffect } from 'react';
import CreateSubjectForm from './CreateSubjectForm';
import { getSubjects, updateSubject } from '../services/subject';
import api from '../services/api';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Plus, X, User, Search, Filter, RefreshCw, ArrowRight } from 'lucide-react';

const ManageCourses = () => {
  const [subjects, setSubjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ subjectName: '', gradeLevel: '' });
  const [loading, setLoading] = useState(false);
  
  // Assignment state
  const [assigningId, setAssigningId] = useState(null);
  const [assignEmail, setAssignEmail] = useState('');
  const [assignFirstName, setAssignFirstName] = useState('');
  const [assignLastName, setAssignLastName] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const data = await getSubjects();
      setSubjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (subj) => {
    setEditingId(subj._id);
    setEditData({ subjectName: subj.subjectName, gradeLevel: subj.gradeLevel });
  };

  const handleEditSave = async (id) => {
    try {
      await updateSubject(id, editData);
      setEditingId(null);
      fetchSubjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignClick = (id) => {
    setAssigningId(id);
    setAssignEmail('');
    setAssignFirstName('');
    setAssignLastName('');
  };

  const handleAssignTeacher = async (subjectId) => {
    if (!assignEmail) return;
    setAssignLoading(true);
    try {
      await api.post(`/subjects/${subjectId}/assign-teacher`, {
        email: assignEmail,
        firstName: assignFirstName,
        lastName: assignLastName
      });
      setAssigningId(null);
      fetchSubjects();
      alert('Teacher assigned and invitation sent!');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to assign teacher');
    } finally {
      setAssignLoading(false);
    }
  };

  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');

  // Filter and then Group subjects for professional hierarchy
  const filteredSubjects = subjects.filter(subj => {
    const matchesSearch = subj.subjectName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = gradeFilter === '' || String(subj.gradeLevel) === gradeFilter;
    return matchesSearch && matchesGrade;
  });

  const groupedSubjects = filteredSubjects.reduce((acc, subj) => {
    const grade = subj.gradeLevel || 'Unassigned';
    if (!acc[grade]) acc[grade] = [];
    acc[grade].push(subj);
    return acc;
  }, {});

  const sortedGrades = Object.keys(groupedSubjects).sort((a, b) => a - b);
  const allGrades = [...new Set(subjects.map(s => String(s.gradeLevel)))].sort((a, b) => a - b);

  return (
    <div className="max-w-[1440px] mx-auto px-2 font-sans pb-20">
      {/* Enterprise Header */}
      <div className="flex items-center justify-between mb-16 border-b border-outline/5 pb-10">
        <div>
          <h1 className="text-4xl font-bold text-on-surface tracking-tight mb-1">Curriculum Architect</h1>
          <p className="text-on-surface-variant text-sm font-medium">Configure and oversee the academic curriculum hierarchy.</p>
        </div>
        
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary-container text-on-primary px-8 py-4 rounded-lg font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-3 shadow-lg shadow-primary-container/10"
        >
          <Plus size={20} strokeWidth={3} />
          Register Subject
        </button>
      </div>

      {/* Advanced Filter & Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-12">
        <div className="md:col-span-2 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary-container transition-colors" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subjects by name (e.g. Mathematics)..."
            className="w-full bg-white border border-outline/10 rounded-lg pl-14 pr-8 py-5 text-sm font-bold text-on-surface focus:border-primary-container outline-none transition-all shadow-sm focus:shadow-md"
          />
        </div>
        
        <div className="relative">
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="w-full bg-white border border-outline/10 rounded-lg px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant focus:border-primary-container outline-none shadow-sm cursor-pointer appearance-none hover:border-outline/30 transition-all"
          >
            <option value="">All Grades</option>
            {allGrades.map(g => (
              <option key={g} value={g}>Grade {g}</option>
            ))}
          </select>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant/40">
            <Filter size={16} />
          </div>
        </div>
      </div>

      {/* Add Subject Drawer-style Toggle */}
      {showAddForm && (
        <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-surface border border-outline/10 rounded-lg p-10 shadow-xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-on-surface">New Subject Registration</h3>
              <button onClick={() => setShowAddForm(false)} className="text-on-surface-variant hover:text-on-surface transition-all"><X size={20}/></button>
            </div>
            <CreateSubjectForm onCreate={() => { fetchSubjects(); setShowAddForm(false); }} />
          </div>
        </div>
      )}

      {/* Structured List View */}
      <div className="space-y-16">
        {sortedGrades.length > 0 ? (
          sortedGrades.map((grade) => (
            <div key={grade} className="animate-in fade-in duration-500">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] whitespace-nowrap">Grade {grade}</h2>
                <div className="h-px bg-outline/5 w-full"></div>
              </div>

              <div className="bg-white border border-outline/10 rounded-lg overflow-hidden shadow-sm">
                <div className="grid grid-cols-12 px-8 py-4 bg-surface/50 border-b border-outline/5 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                  <div className="col-span-5">Subject Details</div>
                  <div className="col-span-4 text-center">Teacher Assignment</div>
                  <div className="col-span-3 text-right">Actions</div>
                </div>

                <div className="divide-y divide-outline/5">
                  {groupedSubjects[grade].map((subj) => (
                    <div key={subj._id} className="group hover:bg-surface/30 transition-colors">
                      <div className="grid grid-cols-12 items-center px-8 py-6">
                        {/* Column 1: Subject */}
                        <div className="col-span-5 flex items-center gap-5">
                          <div className="w-10 h-10 bg-surface-variant rounded-lg flex items-center justify-center text-on-surface-variant font-bold text-xs group-hover:bg-primary-container group-hover:text-on-primary transition-all duration-300">
                            {subj.subjectName.charAt(0)}
                          </div>
                          {editingId === subj._id ? (
                            <div className="flex gap-2 w-full pr-4">
                              <input
                                value={editData.subjectName}
                                onChange={(e) => setEditData({...editData, subjectName: e.target.value})}
                                className="flex-1 bg-white border border-primary-container/20 rounded-md px-3 py-2 text-xs font-bold outline-none"
                              />
                              <button onClick={() => handleEditSave(subj._id)} className="text-primary-container text-[10px] font-black uppercase hover:underline">Save</button>
                            </div>
                          ) : (
                            <span className="font-bold text-on-surface">{subj.subjectName}</span>
                          )}
                        </div>

                        {/* Column 2: Teacher */}
                        <div className="col-span-4 flex justify-center">
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-surface-variant/30 text-[10px] font-black text-on-surface-variant uppercase tracking-tighter">
                            <User size={12} />
                            No Teacher Assigned
                          </div>
                        </div>

                        {/* Column 3: Actions */}
                        <div className="col-span-3 flex justify-end gap-2">
                          <button 
                            onClick={() => handleAssignClick(subj._id)}
                            className="px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest text-primary-container hover:bg-primary-container/5 transition-all"
                          >
                            Assign
                          </button>
                          <button 
                            onClick={() => handleEditClick(subj)}
                            className="px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-all"
                          >
                            Edit
                          </button>
                        </div>
                      </div>

                      {/* Inline Assignment Overlay */}
                      {assigningId === subj._id && (
                        <div className="px-8 pb-8 pt-2 animate-in slide-in-from-top-2 duration-200">
                          <div className="bg-on-surface rounded-lg p-8 text-on-primary relative overflow-hidden shadow-2xl">
                            <div className="flex justify-between items-center mb-6 relative z-10">
                              <h5 className="text-[10px] font-black text-on-primary opacity-40 uppercase tracking-widest">Teacher Assignment Invite</h5>
                              <button onClick={() => setAssigningId(null)} className="text-on-primary opacity-20 hover:opacity-100 transition-all"><X size={16}/></button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                              <div className="space-y-2">
                                <label className="text-[9px] font-black text-on-primary opacity-40 uppercase tracking-widest px-1">Email</label>
                                <input
                                  type="email"
                                  value={assignEmail}
                                  onChange={e => setAssignEmail(e.target.value)}
                                  className="w-full bg-white/10 border border-white/10 rounded-lg px-5 py-3 text-sm font-bold text-on-primary outline-none focus:border-primary-container transition-all"
                                  placeholder="name@school.com"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[9px] font-black text-on-primary opacity-40 uppercase tracking-widest px-1">First Name</label>
                                <input
                                  type="text"
                                  value={assignFirstName}
                                  onChange={e => setAssignFirstName(e.target.value)}
                                  className="w-full bg-white/10 border border-white/10 rounded-lg px-5 py-3 text-sm font-bold text-on-primary outline-none focus:border-primary-container transition-all"
                                  placeholder="John"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[9px] font-black text-on-primary opacity-40 uppercase tracking-widest px-1">Last Name</label>
                                <input
                                  type="text"
                                  value={assignLastName}
                                  onChange={e => setAssignLastName(e.target.value)}
                                  className="w-full bg-white/10 border border-white/10 rounded-lg px-5 py-3 text-sm font-bold text-on-primary outline-none focus:border-primary-container transition-all"
                                  placeholder="Doe"
                                />
                              </div>
                            </div>

                            <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
                              <p className="text-[9px] font-medium text-on-primary opacity-50 italic">Teachers will receive an invitation email to activate their account.</p>
                              <button
                                onClick={() => handleAssignTeacher(subj._id)}
                                disabled={assignLoading || !assignEmail}
                                className="bg-primary-container text-on-primary px-8 py-3 rounded-lg font-black uppercase tracking-widest text-[10px] hover:brightness-110 transition-all shadow-xl shadow-primary-container/20"
                              >
                                {assignLoading ? 'Processing...' : 'Send Assignment Invite'}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-32 text-center bg-surface rounded-lg border border-outline/10">
            <p className="text-on-surface-variant font-black uppercase tracking-widest text-xs opacity-40">No records match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCourses;
