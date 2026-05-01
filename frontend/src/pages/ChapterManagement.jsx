import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { BookOpen, Layers, Plus, Trash2, Edit2, ChevronLeft, Save, X, GraduationCap, LogOut, Menu, CircleUserRound } from 'lucide-react';
import api from '../services/api';
import { getChaptersBySubject, createChapter, updateChapter, deleteChapter } from '../services/chapter';
import { getSubjectChapterProgress } from '../services/engagement';
import { useAuth } from '../context/AuthContext';

const SIDEBAR_ITEMS = [
  { key: 'courses', label: 'Course Management', icon: <BookOpen size={20} /> },
];

const ChapterManagement = ({ isStudent = false }) => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [subject, setSubject] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [subjectProgress, setSubjectProgress] = useState(null);
  const [chapterProgressById, setChapterProgressById] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // CRUD State
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [chapterForm, setChapterForm] = useState({ chapterName: '', chapterDescription: '' });

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
        setChapterProgressById((progressData.chapters || []).reduce((acc, chapter) => {
          acc[String(chapter.chapterId)] = chapter;
          return acc;
        }, {}));
      } else {
        setSubjectProgress(null);
        setChapterProgressById({});
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
    <main className="flex-grow p-4 sm:p-gutter overflow-y-auto bg-white">
      <div className="max-w-[1440px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-6 sm:mb-10 gap-5 sm:gap-6">
          <div className="min-w-0">
            <button onClick={() => navigate(isStudent ? '/dashboard' : '/teacher')} className="flex items-center gap-2 text-[10px] font-black text-outline uppercase tracking-widest hover:text-primary-container transition-all mb-4">
              <ChevronLeft size={14}/> Back to {isStudent ? 'Scholar Console' : 'Course Management'}
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface break-words">Curriculum: {subject?.subjectName}</h1>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-3 sm:gap-4 w-full lg:w-auto">
            {isStudent && subjectProgress && (
              <div className="bg-white px-5 sm:px-8 py-4 rounded-xl border border-outline/10 shadow-[0px_4px_12px_rgba(0,0,0,0.04)] min-w-0 sm:min-w-[220px]">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Subject Progress</span>
                  <span className="text-sm font-black text-primary-container">{subjectProgress.completionPercentage || 0}%</span>
                </div>
                <div className="h-2 rounded-full bg-surface border border-outline/10 overflow-hidden">
                  <div className="h-full bg-primary-container" style={{ width: `${subjectProgress.completionPercentage || 0}%` }} />
                </div>
                <p className="text-[11px] text-on-surface-variant mt-2">
                  {subjectProgress.completedTopics || 0} of {subjectProgress.totalTopics || 0} topics completed
                </p>
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
              chapters.map(chapter => {
                const progress = chapterProgressById[String(chapter._id)] || {};
                return (
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
                            <span className="px-2.5 py-1 rounded-lg bg-surface text-[10px] font-black uppercase tracking-widest border border-outline/5 text-on-surface-variant/40">
                              {chapter._id.slice(-6)}
                            </span>
                          </div>
                          {chapter.chapterDescription ? (
                            <p className="text-on-surface-variant/70 font-medium text-sm max-w-xl leading-relaxed">{chapter.chapterDescription}</p>
                          ) : (
                            <p className="text-on-surface-variant/30 italic text-sm font-medium">No description provided for this chapter.</p>
                          )}
                          {isStudent && (
                            <div className="mt-4 max-w-md">
                              <div className="flex items-center justify-between text-[11px] font-bold text-on-surface-variant mb-2">
                                <span>Topic completion</span>
                                <span>{progress.completedTopics || 0}/{progress.totalTopics || 0} topics • {progress.completionPercentage || 0}%</span>
                              </div>
                              <div className="h-2 rounded-full bg-surface border border-outline/10 overflow-hidden">
                                <div className="h-full bg-primary-container" style={{ width: `${progress.completionPercentage || 0}%` }} />
                              </div>
                            </div>
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
                );
              })
            )}
          </div>
        )}
      </div>
    </main>
  );

  if (isStudent) {
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
  }

  return (
    <div className="h-screen bg-background text-on-surface font-sans flex overflow-hidden">
      {toast.show && (
        <div className={`fixed bottom-4 right-4 z-[100] px-6 py-3 rounded-xl shadow-lg border animate-in slide-in-from-bottom-4 ${toast.type === 'error' ? 'bg-error/10 border-error/20 text-error' : 'bg-primary-container/10 border-primary-container/20 text-primary-container'}`}>
          <p className="font-bold">{toast.message}</p>
        </div>
      )}

      {/* Sidebar (Desktop) */}
      <aside className="w-[280px] bg-white border-r border-outline/10 hidden lg:flex flex-col z-50 shadow-[4px_0_12px_rgba(0,0,0,0.02)] shrink-0 h-full sticky top-0">
        <div className="p-gutter h-20 flex items-center gap-3 border-b border-outline/5 px-8">
          <div className="w-8 h-8 bg-primary-container rounded-lg flex items-center justify-center">
            <GraduationCap className="text-on-primary" size={20} />
          </div>
          <h2 className="text-xl font-semibold tracking-tight">Entrance Exam Prep</h2>
        </div>
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          <div className="h-4"></div>
          {SIDEBAR_ITEMS.map((item) => (
            <Link
              key={item.key}
              to={isStudent ? "/dashboard" : "/teacher"}
              className="flex items-center gap-3 w-full px-4 py-3 transition-all font-semibold rounded-lg border-l-4 bg-primary-container/10 text-primary-container border-primary-container"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-outline/5">
          <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 text-error hover:bg-error/5 transition-all font-semibold rounded-lg">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col">
            <div className="p-gutter h-20 flex items-center justify-between border-b border-outline/5 px-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-container rounded-lg flex items-center justify-center">
                  <GraduationCap className="text-on-primary" size={20} />
                </div>
                <span className="text-xl font-semibold tracking-tight">Entrance Exam Prep</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-on-surface-variant p-2">
                <X size={24} />
              </button>
            </div>
            <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
              <div className="h-4"></div>
              {SIDEBAR_ITEMS.map((item) => (
                <Link
                  key={item.key}
                  to={isStudent ? "/dashboard" : "/teacher"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 w-full px-4 py-3 transition-all font-semibold rounded-lg border-l-4 bg-primary-container/10 text-primary-container border-primary-container"
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-outline/5">
              <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 text-error hover:bg-error/5 transition-all font-semibold rounded-lg">
                <LogOut size={20} /> Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-grow flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-outline/5 px-4 lg:px-gutter flex items-center justify-between sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden text-on-surface-variant p-2"><Menu size={24} /></button>
            <h2 className="text-xl font-semibold text-on-surface">Course Management</h2>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:block text-right">
               <p className="text-sm font-semibold">{user?.firstName} {user?.lastName}</p>
               <p className="text-[10px] text-primary-container uppercase font-bold tracking-widest">{isStudent ? 'Scholar' : 'Teacher'}</p>
             </div>
             <Link to="/profile" className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container border border-primary-container/20 overflow-hidden hover:opacity-80 transition-opacity">
               {user?.profileImage ? (
                 <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <CircleUserRound size={24} />
               )}
             </Link>
          </div>
        </header>

        {content}
      </div>
    </div>
  );
};

export default ChapterManagement;
