import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Compass, Plus, Trash2, Edit2, ChevronLeft, Save, X } from 'lucide-react';
import api from '../services/api';
import { getTopicsByChapter, createTopic, updateTopic, deleteTopic } from '../services/chapter';
import { useAuth } from '../context/AuthContext';
import { formatTopicTitleDisplay, formatTopicBodyText } from '../utils/formatTopicDisplayText';

const TopicManagement = ({ isStudent = false }) => {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [chapter, setChapter] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // CRUD State
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [topicForm, setTopicForm] = useState({ topicName: '', topicDescription: '' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch chapter details for context
      const chapterRes = await api.get(`/content/chapters/${chapterId}`);
      const chData = chapterRes.data.data || chapterRes.data;
      
      // Fetch subject to check access
      const currentSubjectId = chData.subject?._id || chData.subject;
      const subjectRes = await api.get(`/subjects/${currentSubjectId}`);
      const subjData = subjectRes.data.data || subjectRes.data;

      if (isStudent && subjData) {
        const isAllowed = !subjData.stream || subjData.stream === user.stream;
        if (!isAllowed) {
          navigate('/dashboard');
          return;
        }
      }

      setChapter(chData);

      const topicsData = await getTopicsByChapter(chapterId);
      setTopics(topicsData);
    } catch (err) {
      setError('Failed to load topics.');
      showToast('Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  }, [chapterId, isStudent, navigate, user?.role, user?.stream]);

  useEffect(() => {
    if (chapterId) fetchData();
  }, [fetchData, chapterId]);

  const handleCreate = async () => {
    if (!topicForm.topicName.trim()) {
      return showToast('Topic name is required', 'error');
    }
    try {
      await createTopic(chapterId, topicForm);
      showToast('Topic created successfully');
      setIsAdding(false);
      setTopicForm({ topicName: '', topicDescription: '' });
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to create topic';
      showToast(msg, 'error');
    }
  };

  const handleUpdate = async (id) => {
    if (!topicForm.topicName.trim()) {
      return showToast('Topic name is required', 'error');
    }
    try {
      await api.put(`/content/topics/${id}`, topicForm);
      showToast('Topic updated successfully');
      setEditingId(null);
      setTopicForm({ topicName: '', topicDescription: '' });
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to update topic';
      showToast(msg, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this topic and all its learning resources (Concepts, Videos, etc.)? This cannot be undone.')) return;
    try {
      await deleteTopic(id);
      showToast('Topic deleted successfully');
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete topic', 'error');
    }
  };

  const content = (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-6 sm:mb-10 gap-5 sm:gap-6">
          <div className="min-w-0">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black text-outline uppercase tracking-widest hover:text-primary-container transition-all mb-4">
              <ChevronLeft size={14}/> Back to Chapters
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface break-words">Unit Topics: <span className="text-primary-container">{chapter?.chapterName || 'Loading...'}</span></h1>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-3 sm:gap-4 w-full lg:w-auto">
            {!isStudent && (
            <div className="bg-white px-5 sm:px-8 py-4 rounded-xl border border-outline/10 shadow-[0px_4px_12px_rgba(0,0,0,0.04)] flex flex-col items-center">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Topic Count</span>
              <p className="text-2xl font-bold text-primary-container leading-none">{topics.length}</p>
            </div>
            )}
            {!isStudent && (
              <button 
                onClick={() => { setIsAdding(true); setTopicForm({ topicName: '' }); }}
                className="bg-primary-container text-white h-14 px-8 rounded-xl font-bold text-sm uppercase tracking-widest hover:brightness-110 active:opacity-80 transition-all shadow-lg shadow-primary-container/20 flex items-center gap-3"
              >
                <Plus size={20} /> Add Topic
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
                    <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Topic Name</label>
                    <div className="relative">
                      <Compass className="absolute left-5 top-1/2 -translate-y-1/2 text-outline" size={20} />
                      <input 
                        autoFocus
                        value={topicForm.topicName}
                        onChange={e => setTopicForm({ ...topicForm, topicName: e.target.value })}
                        placeholder="e.g. Newton's First Law"
                        className="w-full bg-white border border-outline/20 pl-14 pr-6 py-4 rounded-xl font-bold text-on-surface focus:border-primary-container outline-none transition-all shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Focus Area (Optional Description)</label>
                    <input 
                      value={topicForm.topicDescription}
                      onChange={e => setTopicForm({ ...topicForm, topicDescription: e.target.value })}
                      placeholder="Briefly describe what this topic covers..."
                      className="w-full bg-white border border-outline/20 px-6 py-4 rounded-xl font-medium text-on-surface focus:border-primary-container outline-none transition-all shadow-sm"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:self-end">
                  <button onClick={() => setIsAdding(false)} className="bg-white border border-outline/20 text-on-surface-variant px-10 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-surface transition-all flex items-center justify-center gap-2"><X size={18} /> Discard</button>
                  <button onClick={handleCreate} className="bg-primary-container text-white px-12 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-primary-container/20 flex items-center justify-center gap-2"><Save size={18} /> Create Topic</button>
                </div>
              </div>
            )}

            {topics.length === 0 && !isAdding ? (
              <div className="text-center py-24 bg-white rounded-xl border border-dashed border-outline/20">
                <div className="flex flex-col items-center opacity-40">
                  <Compass size={64} className="mb-6 text-outline" />
                  <p className="text-lg font-bold text-on-surface-variant uppercase tracking-widest">No topics in this chapter</p>
                  <p className="text-sm mt-2">
                    {isStudent ? 'No topics have been published in this chapter yet.' : 'Click "Add Topic" to start creating learning materials.'}
                  </p>
                </div>
              </div>
            ) : (
              topics.map((topic) => (
                <div key={topic._id} className="bg-white rounded-xl border border-outline-variant p-4 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6 shadow-[0px_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0px_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 group">
                  {editingId === topic._id ? (
                    <div className="flex-grow flex flex-col gap-6 w-full animate-in fade-in">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Update Name</label>
                           <input 
                             autoFocus
                             value={topicForm.topicName}
                             onChange={e => setTopicForm({ ...topicForm, topicName: e.target.value })}
                             className="w-full bg-surface border border-outline/20 px-6 py-4 rounded-xl font-bold text-on-surface focus:border-primary-container outline-none transition-all shadow-inner"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Update Description</label>
                           <input 
                             value={topicForm.topicDescription}
                             onChange={e => setTopicForm({ ...topicForm, topicDescription: e.target.value })}
                             className="w-full bg-surface border border-outline/20 px-6 py-4 rounded-xl font-medium text-on-surface focus:border-primary-container outline-none transition-all shadow-inner"
                           />
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 sm:self-end">
                        <button onClick={() => setEditingId(null)} className="bg-white border border-outline/20 text-on-surface px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-surface transition-all">Cancel</button>
                        <button onClick={() => handleUpdate(topic._id)} className="bg-primary-container text-white px-10 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary-container/20">Update Topic</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start sm:items-center gap-4 sm:gap-6 min-w-0">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-container/5 rounded-2xl flex items-center justify-center text-primary-container border border-primary-container/10 group-hover:bg-primary-container group-hover:text-white transition-all duration-500 shadow-sm shrink-0">
                          <Compass size={24} />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <h3 className="text-xl sm:text-2xl font-bold text-on-surface leading-tight tracking-tight group-hover:text-primary-container transition-colors break-words">{formatTopicTitleDisplay(topic.topicName)}</h3>
                          </div>
                          {topic.topicDescription ? (
                            <p className="text-on-surface-variant/70 font-medium text-sm max-w-xl leading-relaxed">{formatTopicBodyText(topic.topicDescription || '')}</p>
                          ) : (
                            <p className="text-on-surface-variant/30 italic text-sm font-medium">No description provided for this topic.</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-outline/5 w-full md:w-auto">
                        {!isStudent && (
                          <div className="flex items-center gap-2 mr-4">
                            <button 
                              onClick={() => { 
                                setEditingId(topic._id); 
                                setTopicForm({ topicName: topic.topicName, topicDescription: topic.topicDescription || '' }); 
                              }}
                              className="p-2.5 rounded-lg text-outline hover:text-primary-container hover:bg-primary-container/5 transition-all"
                              title="Edit Topic"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(topic._id)}
                              className="p-2.5 rounded-lg text-outline hover:text-error hover:bg-error/5 transition-all"
                              title="Delete Topic"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                        <button 
                          onClick={() => navigate(isStudent ? `/curriculum/topic/${topic._id}/objectives` : `/teacher/topic/${topic._id}/objectives`)} 
                          className={`w-full md:w-auto md:flex-grow-0 px-10 py-3.5 rounded-lg font-semibold text-[11px] uppercase tracking-[0.1em] transition-all hover:brightness-110 shadow-md ${
                            isStudent
                              ? 'bg-error text-white shadow-error/10'
                              : 'bg-primary-container text-on-primary shadow-primary-container/10'
                          }`}
                        >
                          {isStudent ? 'Study Now' : 'Manage Content'}
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

export default TopicManagement;
