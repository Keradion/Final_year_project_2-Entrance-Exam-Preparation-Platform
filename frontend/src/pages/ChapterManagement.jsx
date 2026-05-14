import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layers, Plus, Trash2, Edit2, ChevronLeft, Save, X } from 'lucide-react';
import api from '../services/api';
import { getChaptersBySubject, createChapter, updateChapter, deleteChapter } from '../services/chapter';
import { getSubjectChapterProgress } from '../services/engagement';
import { useAuth } from '../context/AuthContext';

const ChapterManagement = ({ isStudent = false }) => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [subject, setSubject] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // CRUD State
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [chapterForm, setChapterForm] = useState({ chapterName: '', chapterDescription: '' });
  const [subjectProgress, setSubjectProgress] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch subject details directly
      const subjectRes = await api.get(`/subjects/${subjectId}`);
      const subjData = subjectRes.data.data || subjectRes.data;

      if (isStudent && subjData) {
        const isAllowed = !subjData.stream || subjData.stream === user.stream;
        if (!isAllowed) {
          navigate('/dashboard');
          return;
        }
      }
      setSubject(subjData);

      const chaptersData = await getChaptersBySubject(subjectId);
      setChapters(chaptersData);

      if (isStudent && user?.role === 'student') {
        const progressResponse = await getSubjectChapterProgress(subjectId);
        const progressData = progressResponse?.data || {};
        setSubjectProgress(progressData.subjectProgress || null);
      } else {
        setSubjectProgress(null);
      }
    } catch (err) {
      setError('Failed to load chapter data.');
      showToast('Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  }, [isStudent, navigate, subjectId, user?.role, user?.stream]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = async () => {
    if (!chapterForm.chapterName.trim()) {
      return showToast('Chapter name is required', 'error');
    }
    try {
      await createChapter(subjectId, chapterForm);
      showToast('Chapter created successfully');
      setIsAdding(false);
      setChapterForm({ chapterName: '', chapterDescription: '' });
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to create chapter';
      showToast(msg, 'error');
    }
  };

  const handleUpdate = async (id) => {
    if (!chapterForm.chapterName.trim()) {
      return showToast('Chapter name is required', 'error');
    }
    try {
      await updateChapter(id, chapterForm);
      showToast('Chapter updated successfully');
      setEditingId(null);
      setChapterForm({ chapterName: '', chapterDescription: '' });
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to update chapter';
      showToast(msg, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this chapter? All topics and resources within it will be removed.')) return;
    try {
      await deleteChapter(id);
      showToast('Chapter deleted successfully');
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete chapter', 'error');
    }
  };

  const content = (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-6 sm:mb-10 gap-5 sm:gap-6">
          <div className="min-w-0">
            <button onClick={() => navigate(isStudent ? '/dashboard' : '/teacher')} className="flex items-center gap-2 text-[10px] font-black text-outline uppercase tracking-widest hover:text-primary-container transition-all mb-4">
              <ChevronLeft size={14}/> Back to {isStudent ? 'Scholar Console' : 'Course Management'}
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface break-words">Curriculum: {subject?.subjectName}</h1>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-3 sm:gap-4 w-full lg:w-auto">
            {isStudent && subjectProgress && (
              <div className="bg-white px-5 sm:px-8 py-4 rounded-xl border border-outline/10 shadow-[0px_4px_12px_rgba(0,0,0,0.04)] min-w-0 sm:min-w-[280px] max-w-full">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Topic completion</span>
                  <span className="text-sm font-black text-primary-container">{subjectProgress.completionPercentage || 0}%</span>
                </div>
                <p className="text-[11px] text-on-surface-variant leading-snug mb-3">
                  {typeof subjectProgress.totalTopics === 'number' && subjectProgress.totalTopics > 0 ? (
                    <>
                      Lesson topics marked complete across this subject ({subject?.subjectName || 'subject'}):{' '}
                      <span className="font-semibold text-on-surface">
                        {subjectProgress.completedTopics ?? 0} of {subjectProgress.totalTopics}
                      </span>
                      .
                    </>
                  ) : (
                    <>No published lesson topics are recorded for this subject yet.</>
                  )}
                </p>
                <div className="h-2 rounded-full bg-surface border border-outline/10 overflow-hidden">
                  <div className="h-full bg-primary-container" style={{ width: `${subjectProgress.completionPercentage || 0}%` }} />
                </div>
              </div>
            )}
            <div className="bg-white px-5 sm:px-8 py-4 rounded-xl border border-outline/10 shadow-[0px_4px_12px_rgba(0,0,0,0.04)] flex flex-col items-center">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Total Chapters</span>
              <p className="text-2xl font-bold text-primary-container leading-none">{chapters.length}</p>
            </div>
            {!isStudent && (
              <button 
                onClick={() => { setIsAdding(true); setChapterForm({ chapterName: '' }); }}
                className="bg-primary-container text-white h-14 px-8 rounded-xl font-bold text-sm uppercase tracking-widest hover:brightness-110 active:opacity-80 transition-all shadow-lg shadow-primary-container/20 flex items-center gap-3"
              >
                <Plus size={20} /> Add Chapter
              </button>
            )}
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {isAdding && (
              <div className="bg-white rounded-xl border border-primary-container/30 p-5 sm:p-10 shadow-[0px_8px_24px_rgba(0,86,210,0.1)] flex flex-col gap-6 animate-in slide-in-from-top-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Chapter Name</label>
                    <div className="relative">
                      <Layers className="absolute left-5 top-1/2 -translate-y-1/2 text-outline" size={20} />
                      <input 
                        autoFocus
                        value={chapterForm.chapterName}
                        onChange={e => setChapterForm({ ...chapterForm, chapterName: e.target.value })}
                        placeholder="e.g. Chapter 1: Introduction to Mechanics"
                        className="w-full bg-white border border-outline/20 pl-14 pr-6 py-4 rounded-xl font-bold text-on-surface focus:border-primary-container outline-none transition-all shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Short Description (Optional)</label>
                    <input 
                      value={chapterForm.chapterDescription}
                      onChange={e => setChapterForm({ ...chapterForm, chapterDescription: e.target.value })}
                      placeholder="Briefly describe the focus of this chapter..."
                      className="w-full bg-white border border-outline/20 px-6 py-4 rounded-xl font-medium text-on-surface focus:border-primary-container outline-none transition-all shadow-sm"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:self-end">
                  <button onClick={() => setIsAdding(false)} className="bg-white border border-outline/20 text-on-surface-variant px-10 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-surface transition-all flex items-center justify-center gap-2"><X size={18} /> Discard</button>
                  <button onClick={handleCreate} className="bg-primary-container text-white px-12 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-primary-container/20 flex items-center justify-center gap-2"><Save size={18} /> Create Chapter</button>
                </div>
              </div>
            )}

            {chapters.length === 0 && !isAdding ? (
              <div className="text-center py-24 bg-white rounded-xl border border-dashed border-outline/20">
                <div className="flex flex-col items-center opacity-40">
                  <Layers size={64} className="mb-6 text-outline" />
                  <p className="text-lg font-bold text-on-surface-variant uppercase tracking-widest">No chapters defined yet</p>
                  <p className="text-sm mt-2">
                    {isStudent ? 'No chapters have been published for this subject yet.' : 'Click "Add Chapter" to begin structuring your curriculum.'}
                  </p>
                </div>
              </div>
            ) : (
              chapters.map((chapter) => (
                <div key={chapter._id} className="bg-white rounded-xl border border-outline-variant p-4 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6 shadow-[0px_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0px_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 group">
                  {editingId === chapter._id ? (
                    <div className="flex-grow flex flex-col gap-6 w-full animate-in fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Update Name</label>
                           <input 
                             autoFocus
                             value={chapterForm.chapterName}
                             onChange={e => setChapterForm({ ...chapterForm, chapterName: e.target.value })}
                             className="w-full bg-surface border border-outline/20 px-6 py-4 rounded-xl font-bold text-on-surface focus:border-primary-container outline-none transition-all shadow-inner"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Update Description</label>
                           <input 
                             value={chapterForm.chapterDescription}
                             onChange={e => setChapterForm({ ...chapterForm, chapterDescription: e.target.value })}
                             className="w-full bg-surface border border-outline/20 px-6 py-4 rounded-xl font-medium text-on-surface focus:border-primary-container outline-none transition-all shadow-inner"
                           />
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 sm:self-end">
                        <button onClick={() => setEditingId(null)} className="bg-white border border-outline/20 text-on-surface px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-surface transition-all">Cancel</button>
                        <button onClick={() => handleUpdate(chapter._id)} className="bg-primary-container text-white px-10 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary-container/20">Update Chapter</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start sm:items-center gap-4 sm:gap-6 min-w-0">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-container/5 rounded-2xl flex items-center justify-center text-primary-container border border-primary-container/10 group-hover:bg-primary-container group-hover:text-white transition-all duration-500 shadow-sm shrink-0">
                          <Layers size={24} />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <h3 className="text-xl sm:text-2xl font-bold text-on-surface leading-tight tracking-tight group-hover:text-primary-container transition-colors break-words">{chapter.chapterName}</h3>
                          </div>
                          {chapter.chapterDescription ? (
                            <p className="text-on-surface-variant/70 font-medium text-sm max-w-xl leading-relaxed">{chapter.chapterDescription}</p>
                          ) : (
                            <p className="text-on-surface-variant/30 italic text-sm font-medium">No description provided for this chapter.</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-outline/5 w-full md:w-auto">
                        {!isStudent && (
                          <div className="flex items-center gap-2 mr-4">
                            <button 
                              onClick={() => { 
                                setEditingId(chapter._id); 
                                setChapterForm({ chapterName: chapter.chapterName, chapterDescription: chapter.chapterDescription || '' }); 
                              }}
                              className="p-2.5 rounded-lg text-outline hover:text-primary-container hover:bg-primary-container/5 transition-all"
                              title="Edit Chapter"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(chapter._id)}
                              className="p-2.5 rounded-lg text-outline hover:text-error hover:bg-error/5 transition-all"
                              title="Delete Chapter"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                        <button 
                          onClick={() => navigate(isStudent ? `/curriculum/chapter/${chapter._id}/topics` : `/teacher/chapter/${chapter._id}/topics`)} 
                          className={`w-full md:w-auto md:flex-grow-0 px-10 py-3.5 rounded-lg font-semibold text-[11px] uppercase tracking-[0.1em] transition-all hover:brightness-110 shadow-md ${
                            isStudent
                              ? 'bg-error text-white shadow-error/10'
                              : 'bg-primary-container text-on-primary shadow-primary-container/10'
                          }`}
                        >
                          {isStudent ? 'View Topics' : 'Manage Topics'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        )}
    </div>
  );

  return (
    <>
      {toast.show && (
        <div className={`fixed bottom-4 right-4 z-[100] px-6 py-3 rounded-xl shadow-lg border animate-in slide-in-from-bottom-4 ${toast.type === 'error' ? 'bg-error/10 border-error/20 text-error' : 'bg-primary-container/10 border-primary-container/20 text-primary-container'}`}>
          <p className="font-bold">{toast.message}</p>
        </div>
      )}
      {content}
    </>
  );
};

export default ChapterManagement;
