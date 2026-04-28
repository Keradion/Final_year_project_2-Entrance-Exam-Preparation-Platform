import React, { useState, useEffect, useContext, useCallback } from 'react';
import { 
  BookOpen, PlayCircle, Plus, ChevronRight, 
  CheckCircle, ArrowLeft, ArrowRight, Edit2, Trash2, LogOut, Save, 
  MonitorPlay, GraduationCap, 
  Compass, Book, Tv, FileCheck, Activity, Library, 
  PlusCircle, Menu, X, CircleUserRound, Search, Filter, RefreshCw, User, Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const TeacherDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState('subjects');
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Curriculum Management
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topicContent, setTopicContent] = useState({ concepts: [], videos: [], exercises: [], quizzes: [], examQuestions: [] });
  const [activeContentStep, setActiveContentStep] = useState(0);
  const [topicObjectives, setTopicObjectives] = useState([]);
  const [newObjective, setNewObjective] = useState('');
  const [newContent, setNewContent] = useState({ 
    id: null, title: '', url: '', type: 'concept', contentBody: '', 
    examPaperId: '', question: '', options: ['', '', '', ''], correctAnswer: 0, hint: '', difficulty: 'Medium' 
  });
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [isSavingContent, setIsSavingContent] = useState(false);
  const [examPapers, setExamPapers] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/subjects');
      const userId = user?.id || user?._id;
      const mySubjects = res.data.filter(s => s.teacher && (s.teacher._id === userId || s.teacher === userId));
      setSubjects(mySubjects);
    } catch (err) {
      setError('Failed to load subjects.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (activeSection === 'subjects') {
      fetchSubjects();
    }
  }, [activeSection, fetchSubjects]);

  const fetchTopicContent = async (topicId) => {
    try {
      const ts = Date.now();
      const [conceptsRes, videosRes, exercisesRes, quizzesRes, examQsRes] = await Promise.all([
        api.get(`/content/topics/${topicId}/concepts?t=${ts}`),
        api.get(`/content/topics/${topicId}/videos?t=${ts}`),
        api.get(`/exercises/topics/${topicId}/exercises?t=${ts}`).catch(() => ({ data: { data: [] } })),
        api.get(`/quizzes/topics/${topicId}/quizzes?t=${ts}`).catch(() => ({ data: { data: [] } })),
        api.get(`/exams/questions/search?topicId=${topicId}&t=${ts}`).catch(() => ({ data: { data: [] } }))
      ]);
      setTopicContent({
        concepts: conceptsRes.data,
        videos: videosRes.data,
        exercises: exercisesRes.data?.data || [],
        quizzes: quizzesRes.data?.data || [],
        examQuestions: examQsRes.data?.data || []
      });
    } catch (err) {
      console.error('Failed to load topic content', err);
    }
  };

  const handleManageTopic = async (topic, subjectId) => {
    const topicId = topic._id || topic.id;
    setSelectedTopic({ ...topic, _id: topicId, subjectId });
    setTopicObjectives(topic.topicObjectives || []);
    setActiveContentStep(0);
    fetchTopicContent(topicId);
    try {
      const res = await api.get(`/exams/papers/subjects/${subjectId}`);
      setExamPapers(res.data);
    } catch (err) {
      console.error('Failed to load exam papers', err);
    }
  };

  const handleUpdateObjectives = async () => {
    if (topicObjectives.length === 0) return showToast('Please add at least one goal.', 'error');
    try {
      await api.put(`/content/topics/${selectedTopic._id}`, { topicObjectives });
      showToast('Goals updated successfully!');
    } catch (err) {
      showToast('Failed to update goals.', 'error');
    }
  };

  const handleAddObjective = () => {
    if (!newObjective.trim()) return;
    setTopicObjectives([...topicObjectives, newObjective.trim()]);
    setNewObjective('');
  };

  const handleAddContent = async () => {
    setIsSavingContent(true);
    try {
      let endpoint = '';
      let method = isEditingContent ? 'put' : 'post';
      let payload = {};

      if (newContent.type === 'concept') {
        endpoint = isEditingContent ? `/content/concepts/${newContent.id}` : `/content/topics/${selectedTopic._id}/concepts`;
        payload = { title: newContent.title, content: newContent.contentBody };
      } else if (newContent.type === 'video') {
        endpoint = isEditingContent ? `/content/videos/${newContent.id}` : `/content/topics/${selectedTopic._id}/videos`;
        payload = { title: newContent.title, videoUrl: newContent.url };
      } else if (newContent.type === 'exercise') {
        endpoint = isEditingContent ? `/exercises/${newContent.id}` : '/exercises';
        payload = {
          title: newContent.title,
          topic: selectedTopic._id,
          question: newContent.question,
          options: newContent.options,
          correctAnswer: newContent.correctAnswer,
          difficulty: newContent.difficulty,
          description: newContent.contentBody
        };
      } else if (newContent.type === 'examQuestion') {
        if (!newContent.examPaperId) return showToast('Please select an exam paper.', 'error');
        endpoint = `/exams/papers/${newContent.examPaperId}/questions`;
        payload = {
          questionText: newContent.title,
          topic: selectedTopic._id,
          marks: 5,
          options: [{ optionText: 'A', isCorrect: true }, { optionText: 'B', isCorrect: false }],
          explanation: newContent.contentBody
        };
      }

      await api[method](endpoint, payload);
      showToast(`${newContent.type} saved successfully!`);
      fetchTopicContent(selectedTopic._id);
      setIsEditingContent(false);
      setNewContent({ ...newContent, id: null, title: '', url: '', contentBody: '', question: '', options: ['', '', '', ''] });
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save', 'error');
    } finally {
      setIsSavingContent(false);
    }
  };

  const handleDeleteContent = async (id, type) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const endpoints = { concept: '/content/concepts/', video: '/content/videos/', exercise: '/exercises/', examQuestion: '/exams/questions/' };
      await api.delete(`${endpoints[type]}${id}`);
      fetchTopicContent(selectedTopic._id);
      showToast('Deleted successfully');
    } catch (err) {
      showToast('Failed to delete', 'error');
    }
  };

  const SIDEBAR_ITEMS = [
    { key: 'subjects', label: 'Subjects', icon: <BookOpen size={20} /> },
  ];

  return (
    <div className="h-screen bg-white text-on-surface font-sans flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[280px] bg-white border-r border-outline/10 hidden lg:flex flex-col z-50 shrink-0 h-full">
        <div className="h-20 flex items-center gap-3 border-b border-outline/5 px-8">
          <div className="w-8 h-8 bg-primary-container rounded-lg flex items-center justify-center">
            <GraduationCap className="text-on-primary" size={20} />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Entrance Prep</h2>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => { setActiveSection(item.key); setSelectedTopic(null); }}
              className={`flex items-center gap-3 w-full px-4 py-3 transition-all font-semibold rounded-lg border-l-4 ${activeSection === item.key ? 'bg-primary-container/10 text-primary-container border-primary-container' : 'border-transparent hover:bg-surface'}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-outline/5">
          <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 text-error hover:bg-error/5 font-semibold rounded-lg">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-grow flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-outline/5 px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2"><Menu size={24} /></button>
            <h2 className="text-xl font-semibold">Teacher Dashboard</h2>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
               <p className="text-sm font-bold">{user?.firstName} {user?.lastName}</p>
               <p className="text-[10px] text-primary-container uppercase font-black tracking-widest">Instructor</p>
             </div>
             <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container border border-primary-container/20">
                <CircleUserRound size={24} />
             </div>
          </div>
        </header>

        <main className="flex-grow p-8 overflow-y-auto bg-[#fafbfc]">
          <div className="max-w-[1440px] mx-auto animate-in fade-in duration-700">
            {activeSection === 'subjects' && !selectedTopic && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {subjects.map(subject => (
                  <div key={subject._id} className="bg-white rounded-2xl border border-outline/10 p-8 shadow-sm hover:shadow-md transition-all group">
                    <div className="w-12 h-12 bg-primary-container/5 rounded-xl flex items-center justify-center text-primary-container mb-6 group-hover:bg-primary-container group-hover:text-on-primary transition-all border border-primary-container/10">
                      <BookOpen size={24} />
                    </div>
                    <h3 className="text-2xl font-bold mb-6">{subject.subjectName}</h3>
                    <div className="space-y-2">
                       {(subject.topics || []).map(topic => (
                         <button key={topic._id} onClick={() => handleManageTopic(topic, subject._id)} className="w-full flex items-center justify-between p-4 rounded-xl bg-[#fafbfc] border border-outline/5 hover:border-primary-container/30 transition-all">
                           <span className="text-sm font-bold">{topic.topicName}</span>
                           <ChevronRight size={16} className="text-outline" />
                         </button>
                       ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'subjects' && selectedTopic && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                   <button onClick={() => setSelectedTopic(null)} className="flex items-center gap-2 text-sm font-bold text-outline hover:text-on-surface transition-all">
                     <ArrowLeft size={18} /> Back to Subjects
                   </button>
                   <h2 className="text-2xl font-black">{selectedTopic.topicName}</h2>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-outline/10 p-4 flex justify-around shadow-sm overflow-x-auto">
                   {[Compass, Book, Tv, FileCheck, Activity, Library].map((Icon, idx) => (
                     <button key={idx} onClick={() => setActiveContentStep(idx)} className={`flex flex-col items-center gap-2 px-6 py-3 rounded-2xl transition-all ${activeContentStep === idx ? 'bg-on-surface text-white' : 'text-outline hover:text-on-surface-variant'}`}>
                       <Icon size={20} />
                       <span className="text-[8px] font-black uppercase tracking-widest">{['Goals', 'Concepts', 'Videos', 'Exercises', 'Quizzes', 'Exam'][idx]}</span>
                     </button>
                   ))}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-outline/10 p-10 shadow-xl min-h-[600px]">
                   {activeContentStep === 0 && (
                     <div className="max-w-2xl">
                        <h3 className="text-2xl font-bold mb-6">Learning Goals</h3>
                        <div className="flex gap-4 mb-8">
                           <input value={newObjective} onChange={e => setNewObjective(e.target.value)} placeholder="e.g. Master the quadratic formula" className="flex-grow bg-[#fafbfc] border border-outline/10 px-6 py-4 rounded-xl font-bold" />
                           <button onClick={handleAddObjective} className="bg-on-surface text-white px-8 rounded-xl font-bold text-xs uppercase">Add</button>
                        </div>
                        <div className="space-y-3">
                           {topicObjectives.map((obj, i) => (
                             <div key={i} className="flex items-center justify-between p-4 bg-[#fafbfc] rounded-xl border border-outline/5 group">
                               <span className="font-bold text-sm">{obj}</span>
                               <button onClick={() => setTopicObjectives(topicObjectives.filter((_, idx) => idx !== i))} className="text-outline hover:text-error opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18}/></button>
                             </div>
                           ))}
                        </div>
                        <button onClick={handleUpdateObjectives} className="mt-10 bg-on-surface text-white px-10 py-4 rounded-xl font-bold text-xs uppercase flex items-center gap-2"><Save size={18} /> Save All Goals</button>
                     </div>
                   )}

                   {activeContentStep === 1 && (
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-6">
                           <h4 className="text-xs font-black uppercase tracking-widest text-outline">New Concept</h4>
                           <input value={newContent.title} onChange={e => setNewContent({...newContent, title: e.target.value, type: 'concept'})} placeholder="Concept Title" className="w-full bg-[#fafbfc] border border-outline/10 px-6 py-4 rounded-xl font-bold" />
                           <textarea value={newContent.contentBody} onChange={e => setNewContent({...newContent, contentBody: e.target.value})} placeholder="Explanation..." rows="6" className="w-full bg-[#fafbfc] border border-outline/10 px-6 py-4 rounded-xl font-medium resize-none" />
                           <button onClick={handleAddContent} disabled={isSavingContent} className="w-full bg-on-surface text-white py-4 rounded-xl font-bold text-xs uppercase">{isSavingContent ? 'Saving...' : 'Commit Concept'}</button>
                        </div>
                        <div className="space-y-4">
                           {topicContent.concepts.map(c => (
                             <div key={c._id} className="p-6 border border-outline/10 rounded-2xl flex justify-between items-center group hover:border-primary-container transition-all">
                               <div><h4 className="font-bold">{c.title}</h4><p className="text-xs text-on-surface-variant truncate max-w-xs">{c.content}</p></div>
                               <button onClick={() => handleDeleteContent(c._id, 'concept')} className="text-outline hover:text-error opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18}/></button>
                             </div>
                           ))}
                        </div>
                   </div>
                   )}

                   {activeContentStep === 2 && (
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-6">
                           <h4 className="text-xs font-black uppercase tracking-widest text-outline">New Video</h4>
                           <input value={newContent.title} onChange={e => setNewContent({...newContent, title: e.target.value, type: 'video'})} placeholder="Lesson Title" className="w-full bg-[#fafbfc] border border-outline/10 px-6 py-4 rounded-xl font-bold" />
                           <input value={newContent.url} onChange={e => setNewContent({...newContent, url: e.target.value})} placeholder="YouTube URL" className="w-full bg-[#fafbfc] border border-outline/10 px-6 py-4 rounded-xl font-bold" />
                           <button onClick={handleAddContent} disabled={isSavingContent} className="w-full bg-on-surface text-white py-4 rounded-xl font-bold text-xs uppercase">Append Video</button>
                        </div>
                        <div className="space-y-4">
                           {topicContent.videos.map(v => (
                             <div key={v._id} className="p-6 border border-outline/10 rounded-2xl flex justify-between items-center group">
                               <div><h4 className="font-bold">{v.title}</h4><p className="text-[10px] text-primary-container font-black">{v.videoUrl}</p></div>
                               <button onClick={() => handleDeleteContent(v._id, 'video')} className="text-outline hover:text-error opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18}/></button>
                             </div>
                           ))}
                        </div>
                     </div>
                   )}

                   {activeContentStep === 3 && (
                     <div className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-4">
                              <label className="text-[10px] font-black uppercase text-outline">Problem Title</label>
                              <input value={newContent.title} onChange={e => setNewContent({...newContent, title: e.target.value, type: 'exercise'})} className="w-full bg-[#fafbfc] border border-outline/10 px-6 py-4 rounded-xl font-bold" />
                           </div>
                           <div className="space-y-4">
                              <label className="text-[10px] font-black uppercase text-outline">Difficulty</label>
                              <div className="flex gap-2">
                                {['Easy', 'Medium', 'Hard'].map(d => (
                                  <button key={d} onClick={() => setNewContent({...newContent, difficulty: d})} className={`flex-1 py-4 rounded-xl font-bold text-[10px] uppercase border ${newContent.difficulty === d ? 'bg-on-surface text-white border-on-surface' : 'bg-white text-outline border-outline/10'}`}>{d}</button>
                                ))}
                              </div>
                           </div>
                        </div>
                        <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase text-outline">Question Prompt</label>
                           <textarea value={newContent.question} onChange={e => setNewContent({...newContent, question: e.target.value})} rows="3" className="w-full bg-[#fafbfc] border border-outline/10 px-6 py-4 rounded-xl font-bold resize-none" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {newContent.options.map((opt, i) => (
                             <div key={i} className="relative">
                               <input value={opt} onChange={e => { const o = [...newContent.options]; o[i] = e.target.value; setNewContent({...newContent, options: o}); }} placeholder={`Option ${i+1}`} className={`w-full bg-[#fafbfc] border px-6 py-4 rounded-xl font-bold ${newContent.correctAnswer === i ? 'border-primary-container' : 'border-outline/10'}`} />
                               <button onClick={() => setNewContent({...newContent, correctAnswer: i})} className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 ${newContent.correctAnswer === i ? 'bg-primary-container border-primary-container' : 'border-outline/20'}`} />
                             </div>
                           ))}
                        </div>
                        <button onClick={handleAddContent} className="w-full bg-on-surface text-white py-5 rounded-xl font-bold text-xs uppercase shadow-lg shadow-on-surface/10">Commit Exercise</button>
                        
                        <div className="space-y-4 pt-10">
                           <h4 className="text-xs font-black uppercase text-outline">Inventory</h4>
                           {topicContent.exercises.map(e => (
                             <div key={e._id} className="p-6 border border-outline/10 rounded-2xl flex justify-between items-center group">
                               <div><h4 className="font-bold">{e.title}</h4><p className="text-xs text-on-surface-variant line-clamp-1">{e.question}</p></div>
                               <button onClick={() => handleDeleteContent(e._id, 'exercise')} className="text-outline hover:text-error opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18}/></button>
                             </div>
                           ))}
                        </div>
                     </div>
                   )}

                   {activeContentStep >= 4 && (
                     <div className="flex flex-col items-center justify-center py-40 text-center opacity-30">
                        <Activity size={64} className="mb-6" />
                        <h3 className="text-2xl font-bold mb-2">Advanced Module</h3>
                        <p className="text-sm font-medium">Stage 4 and 5 are being optimized for project parity.</p>
                     </div>
                   )}
                </div>
              </div>
            )}

            {/* No other sections for now */}
          </div>
        </main>
      </div>
      {toast.show && <div className={`fixed bottom-8 right-8 px-8 py-4 rounded-xl shadow-2xl animate-in slide-in-from-right duration-300 font-bold text-xs uppercase text-white ${toast.type === 'success' ? 'bg-on-surface' : 'bg-error'}`}>{toast.message}</div>}
    </div>
  );
};

export default TeacherDashboard;
