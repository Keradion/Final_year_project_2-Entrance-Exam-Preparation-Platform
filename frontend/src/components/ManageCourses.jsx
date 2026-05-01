import React, { useState, useEffect } from 'react';
import CreateSubjectForm from './CreateSubjectForm';
import { getSubjects, updateSubject, deleteSubject } from '../services/subject';
import api from '../services/api';
import { Plus, X, User, Search, Filter, RefreshCw, GraduationCap, BookOpen, Trash2, Edit3, Save, Check } from 'lucide-react';

const ManageSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [streamFilter, setStreamFilter] = useState('');

  // Assignment / Edit state
  const [assigningId, setAssigningId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ subjectName: '', gradeLevel: '', stream: '' });
  const [assignData, setAssignData] = useState({ email: '', firstName: '', lastName: '', stream: '' });
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignSuccess, setAssignSuccess] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const data = await getSubjects();
      setSubjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTeacher = async (subjectId) => {
    const normalizedEmail = assignData.email.trim().toLowerCase();
    if (!normalizedEmail) return;
    setAssignLoading(true);
    try {
      const response = await api.post(`/subjects/${subjectId}/invite-assign-teacher`, {
        ...assignData,
        email: normalizedEmail,
      });
      if (response.data?.subject) {
        setSubjects((prev) => prev.map((subject) => (
          subject._id === subjectId ? response.data.subject : subject
        )));
      }
      setAssignSuccess(true);
      setTimeout(() => {
        setAssigningId(null);
        setAssignSuccess(false);
        setAssignData({ email: '', firstName: '', lastName: '', stream: '' });
        fetchSubjects();
      }, 2000);
    } catch (err) {
      alert(err.response?.data?.message || 'Assignment failed');
    } finally {
      setAssignLoading(false);
    }
  };

  const handleEditSave = async (id) => {
    try {
      await updateSubject(id, editData);
      setEditingId(null);
      fetchSubjects();
    } catch (err) {
      alert('Failed to update subject');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) return;
    try {
      await deleteSubject(id);
      fetchSubjects();
    } catch (err) {
      alert('Failed to delete subject');
    }
  };

  // Filtering
  const filteredSubjects = (subjects || []).filter(subj => {
    const sQuery = searchQuery.trim().toLowerCase();
    const matchesSearch = !sQuery || subj.subjectName?.toLowerCase().includes(sQuery);
    const subjGrade = String(subj.gradeLevel || '').replace(/\D/g, '');
    const fGrade = String(gradeFilter || '').replace(/\D/g, '');
    const matchesGrade = !gradeFilter || subjGrade === fGrade;
    const matchesStream = !streamFilter || subj.stream === streamFilter;
    return matchesSearch && matchesGrade && matchesStream;
  });

  // Grouping
  const grouped = filteredSubjects.reduce((acc, subj) => {
    const gradeNum = String(subj.gradeLevel || '').replace(/\D/g, '');
    const key = gradeNum ? `Grade ${gradeNum}` : 'Unassigned';
    if (!acc[key]) acc[key] = [];
    acc[key].push(subj);
    return acc;
  }, {});

  const sortedKeys = Object.keys(grouped).sort((a, b) => {
    const nA = parseInt(a.replace(/\D/g, '')) || 0;
    const nB = parseInt(b.replace(/\D/g, '')) || 0;
    return nA - nB;
  });

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-on-surface mb-2">Subject Management</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-white px-8 py-4 rounded-xl border border-outline/10 shadow-[0px_4px_12px_rgba(0,0,0,0.04)] flex flex-col items-center">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Total Subjects</span>
            <p className="text-2xl font-bold text-primary-container leading-none">{subjects.length}</p>
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-primary-container text-on-primary px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-3 shadow-lg shadow-primary-container/20"
          >
            <Plus size={20} />
            Create Subject
          </button>
        </div>
      </div>
      
      {showAddForm && (
        <div className="bg-white rounded-2xl border border-outline/10 p-8 mb-8 animate-in slide-in-from-top-4 duration-500 shadow-sm">
          <CreateSubjectForm onCreate={() => { setShowAddForm(false); fetchSubjects(); }} />
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-10">
        <div className="md:col-span-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subjects..."
            className="w-full bg-white border border-outline/20 rounded-lg pl-12 pr-4 py-4 text-sm font-semibold focus:border-primary-container outline-none transition-all shadow-sm"
          />
        </div>
        <div className="md:col-span-3 relative">
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="w-full bg-white border border-outline/20 rounded-lg px-5 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant appearance-none cursor-pointer outline-none focus:border-primary-container shadow-sm"
          >
            <option value="">All Grades</option>
            {[9, 10, 11, 12].map(g => <option key={g} value={String(g)}>Grade {g}</option>)}
          </select>
          <Filter size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-20" />
        </div>
        <div className="md:col-span-3 relative">
          <select
            value={streamFilter}
            onChange={(e) => setStreamFilter(e.target.value)}
            className="w-full bg-white border border-outline/20 rounded-lg px-5 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant appearance-none cursor-pointer outline-none focus:border-primary-container shadow-sm"
          >
            <option value="">All Streams</option>
            <option value="Natural">Natural Sciences</option>
            <option value="Social">Social Sciences</option>
          </select>
          <BookOpen size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-20" />
        </div>
      </div>

      {/* Registry */}
      <div className="space-y-12">
        {sortedKeys.length > 0 ? (
          sortedKeys.map(key => (
            <div key={key} className="animate-in fade-in duration-500">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-[10px] font-black text-primary-container uppercase tracking-[0.3em] bg-primary-container/5 px-4 py-1 rounded-lg border border-primary-container/10">{key}</h2>
                <div className="h-px bg-outline/5 flex-grow"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {grouped[key].map(subj => (
                  <div key={subj._id} className="bg-white rounded-xl border border-outline-variant p-8 shadow-[0px_8px_24px_rgba(0,0,0,0.08)] hover:shadow-[0px_12px_32px_rgba(0,0,0,0.12)] transition-all duration-300 group relative">
                    {editingId === subj._id ? (
                      <div className="space-y-6 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-2">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-primary-container">Edit Subject</span>
                           <button onClick={() => setEditingId(null)} className="text-on-surface-variant hover:text-error transition-colors"><X size={18}/></button>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-on-surface mb-2">Subject Name</label>
                            <div className="relative">
                              <input 
                                className="w-full bg-white border border-outline/20 rounded-lg px-4 py-3 pl-11 text-sm font-medium outline-none focus:border-primary-container transition-all"
                                value={editData.subjectName}
                                onChange={e => setEditData({...editData, subjectName: e.target.value})}
                              />
                              <Edit3 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-on-surface mb-2">Grade</label>
                              <div className="relative">
                                <select
                                  className="w-full bg-white border border-outline/20 rounded-lg px-4 py-3 pl-10 text-sm font-medium outline-none focus:border-primary-container transition-all appearance-none"
                                  value={editData.gradeLevel}
                                  onChange={e => setEditData({...editData, gradeLevel: e.target.value})}
                                >
                                  {[9, 10, 11, 12].map(g => <option key={g} value={g}>Grade {g}</option>)}
                                </select>
                                <GraduationCap size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-on-surface mb-2">Stream</label>
                              <div className="relative">
                                <select
                                  className="w-full bg-white border border-outline/20 rounded-lg px-4 py-3 pl-10 text-sm font-medium outline-none focus:border-primary-container transition-all appearance-none"
                                  value={editData.stream}
                                  onChange={e => setEditData({...editData, stream: e.target.value})}
                                >
                                  <option value="">General</option>
                                  <option value="Natural">Natural</option>
                                  <option value="Social">Social</option>
                                </select>
                                <BookOpen size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleEditSave(subj._id)}
                          className="w-full bg-primary-container py-3 rounded-lg text-on-primary text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary-container/20 mt-4 flex items-center justify-center gap-2"
                        >
                          <Save size={16} />
                          Save Changes
                        </button>
                      </div>
                    ) : (
                    <>
                      <div className="flex items-start justify-between mb-8">
                        <div className="w-14 h-14 bg-primary-container/5 rounded-xl flex items-center justify-center text-primary-container font-bold text-xl group-hover:bg-primary-container group-hover:text-on-primary transition-all duration-500 shadow-sm border border-primary-container/10">
                          {subj.subjectName?.charAt(0)}
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => { setEditingId(subj._id); setEditData({ subjectName: subj.subjectName, gradeLevel: subj.gradeLevel, stream: subj.stream }); }}
                            className="p-2.5 rounded-lg border border-outline/10 text-on-surface-variant hover:text-primary-container hover:bg-primary-container/5 transition-all"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(subj._id)}
                            className="p-2.5 rounded-lg border border-outline/10 text-on-surface-variant hover:text-error hover:bg-error/5 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="mb-8">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border ${subj.stream === 'Natural' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                            {subj.stream || 'General'}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-on-surface group-hover:text-primary-container transition-colors duration-300">{subj.subjectName}</h3>
                      </div>

                      <div className="space-y-4 mb-8">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-surface border border-outline/5">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-white border border-outline/10 flex items-center justify-center">
                                 <User size={14} className="text-on-surface-variant" />
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest leading-none mb-1">Teacher</span>
                                 <span className="text-xs font-bold text-on-surface">{subj.teacher ? `${subj.teacher.firstName} ${subj.teacher.lastName}` : 'Unassigned'}</span>
                              </div>
                           </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => { 
                          setAssigningId(subj._id); 
                          setAssignData({ 
                            email: subj.teacher?.email || '', 
                            firstName: subj.teacher?.firstName || '', 
                            lastName: subj.teacher?.lastName || '', 
                            stream: subj.stream 
                          }); 
                        }}
                        className="w-full py-3 rounded-lg bg-primary-container text-on-primary text-xs font-bold uppercase tracking-widest hover:brightness-110 active:scale-[0.98] shadow-lg shadow-primary-container/20 transition-all flex items-center justify-center gap-2"
                      >
                        <GraduationCap size={18} />
                        {subj.teacher ? 'Update Teacher' : 'Assign Teacher'}
                      </button>
                    </>
                    )}

                    {/* Quick Assign Overlay */}
                    {assigningId === subj._id && (
                      <div className="absolute inset-0 z-20 bg-on-surface p-8 flex flex-col animate-in slide-in-from-bottom duration-300">
                        <div className="flex justify-between items-center mb-8">
                          <div className="flex flex-col">
                            <h4 className="text-xs font-bold text-on-primary uppercase tracking-widest">Assign Teacher</h4>
                            <span className="text-[10px] font-bold text-primary-container uppercase tracking-widest mt-1">{subj.stream || 'General'}</span>
                          </div>
                          <button onClick={() => setAssigningId(null)} className="text-on-primary opacity-40 hover:opacity-100 transition-all"><X size={24} /></button>
                        </div>
                        <div className="space-y-4 flex-grow">
                          {!assignSuccess ? (
                            <>
                              <div>
                                <label className="block text-[10px] font-bold text-on-primary opacity-60 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                                <div className="relative">
                                  <input 
                                    placeholder="teacher@academy.edu"
                                    className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 pl-11 text-sm text-on-primary outline-none focus:border-primary-container transition-all"
                                    value={assignData.email}
                                    onChange={e => setAssignData({...assignData, email: e.target.value})}
                                  />
                                  <Plus size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] font-bold text-on-primary opacity-60 uppercase tracking-widest mb-2 ml-1">First Name</label>
                                  <div className="relative">
                                    <input 
                                      placeholder="First Name"
                                      className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 pl-11 text-sm text-on-primary outline-none focus:border-primary-container transition-all"
                                      value={assignData.firstName}
                                      onChange={e => setAssignData({...assignData, firstName: e.target.value})}
                                    />
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-on-primary opacity-60 uppercase tracking-widest mb-2 ml-1">Last Name</label>
                                  <div className="relative">
                                    <input 
                                      placeholder="Last Name"
                                      className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 pl-11 text-sm text-on-primary outline-none focus:border-primary-container transition-all"
                                      value={assignData.lastName}
                                      onChange={e => setAssignData({...assignData, lastName: e.target.value})}
                                    />
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
                               <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mb-6 border border-emerald-500/20">
                                  <Check size={40} strokeWidth={3} />
                               </div>
                               <h4 className="text-xl font-bold text-on-primary mb-2">Teacher Assigned!</h4>
                               <p className="text-on-primary/60 text-xs font-medium">Notification and credentials have been queued.</p>
                            </div>
                          )}
                        </div>
                        {!assignSuccess && (
                          <button 
                            onClick={() => handleAssignTeacher(subj._id)}
                            disabled={assignLoading}
                            className="w-full bg-primary-container py-3 rounded-lg text-on-primary font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-[0.98] shadow-xl shadow-primary-container/20 mt-8 flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            {assignLoading ? 'Assigning Teacher...' : 'Confirm Assignment'}
                            {!assignLoading && <Check size={18} />}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="py-32 text-center bg-white rounded-xl border border-outline-variant shadow-[0px_8px_24px_rgba(0,0,0,0.08)] flex flex-col items-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mb-6 border border-outline/5">
              <BookOpen size={40} className="text-on-surface-variant opacity-20" />
            </div>
            <h3 className="text-xl font-bold mb-2">Registry is Empty</h3>
            <p className="text-on-surface-variant text-sm mb-8">No subjects currently match your administrative filters.</p>
            <button 
              onClick={() => setShowAddForm(true)}
              className="bg-primary-container text-on-primary px-8 py-4 rounded-lg font-bold shadow-lg shadow-primary-container/20 hover:scale-105 transition-all"
            >
              Create Subject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageSubjects;
