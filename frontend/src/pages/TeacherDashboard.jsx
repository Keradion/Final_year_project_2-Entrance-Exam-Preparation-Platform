import React, { useState, useEffect, useContext } from 'react';
import { 
  BookOpen, Folders, FileText, Video, PlayCircle, Plus, ChevronDown, ChevronRight, 
  CheckCircle, List, ArrowLeft, ArrowRight, Edit2, Trash2, User, LogOut, Save, 
  Eye, EyeOff, Layout, Layers, Settings, PlusCircle, MonitorPlay, GraduationCap, 
  Compass, Book, Tv, FileCheck, Activity, Library, Circle, Target, BrainCircuit, 
  Lightbulb, ClipboardList, Rocket, FileQuestion, History, Info, Clock, Search, 
  Filter, RefreshCw, ChevronLeft, MoreVertical, AlertCircle 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { updateProfile as updateProfileRequest, changePassword as changePasswordRequest } from '../services/auth';

const TeacherDashboard = () => {
  const { user, setUser, logout } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState('subjects');
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [expandedSubjectId, setExpandedSubjectId] = useState(null);
  const [chaptersBySubject, setChaptersBySubject] = useState({});
  const [expandedChapterId, setExpandedChapterId] = useState(null);
  const [topicsByChapter, setTopicsByChapter] = useState({});

  const [newChapterName, setNewChapterName] = useState('');
  const [newTopicName, setNewTopicName] = useState('');

  // Topic Content Management State
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topicContent, setTopicContent] = useState({ concepts: [], videos: [], exercises: [], quizzes: [], examQuestions: [] });
  const [activeContentStep, setActiveContentStep] = useState(0);
  const [topicObjectives, setTopicObjectives] = useState([]);
  const [newObjective, setNewObjective] = useState('');
  const [newContent, setNewContent] = useState({ 
    id: null, title: '', url: '', type: 'concept', contentBody: '', 
    examPaperId: '', question: '', options: ['', '', '', ''], correctAnswer: 0, hint: '', difficulty: 'Medium' 
  });
  const [editingObjectiveIndex, setEditingObjectiveIndex] = useState(null);
  const [editingObjectiveText, setEditingObjectiveText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [examPapers, setExamPapers] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [fieldErrors, setFieldErrors] = useState({});

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    if (activeSection === 'subjects') {
      fetchSubjects();
    }
  }, [user, activeSection]);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const res = await api.get('/subjects');
      // Show subjects assigned to this teacher
      const userId = user.id || user._id;
      const mySubjects = res.data.filter(s => s.teacher && (s.teacher._id === userId || s.teacher === userId));
      setSubjects(mySubjects);
    } catch (err) {
      setError('Failed to load subjects.');
    } finally {
      setLoading(false);
    }
  };

  const fetchChapters = async (subjectId) => {
    try {
      const res = await api.get(`/content/subjects/${subjectId}/chapters?t=${Date.now()}`);
      setChaptersBySubject(prev => ({ ...prev, [subjectId]: res.data }));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTopics = async (chapterId) => {
    try {
      const res = await api.get(`/content/chapters/${chapterId}/topics?t=${Date.now()}`);
      setTopicsByChapter(prev => ({ ...prev, [chapterId]: res.data }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleSubject = (subjectId) => {
    // Clear any active edits when switching subjects
    setEditingChapterId(null);
    setNewChapterName('');
    setEditingTopicId(null);
    setNewTopicName('');
    
    if (expandedSubjectId === subjectId) {
      setExpandedSubjectId(null);
    } else {
      setExpandedSubjectId(subjectId);
      if (!chaptersBySubject[subjectId]) {
        fetchChapters(subjectId);
      }
    }
  };

  const handleToggleChapter = (chapterId) => {
    // Clear topic edits when switching chapters
    setEditingTopicId(null);
    setNewTopicName('');
    
    if (expandedChapterId === chapterId) {
      setExpandedChapterId(null);
    } else {
      setExpandedChapterId(chapterId);
      if (!topicsByChapter[chapterId]) {
        fetchTopics(chapterId);
      }
    }
  };

  const [isAddingChapter, setIsAddingChapter] = useState(false);
  const [editingChapterId, setEditingChapterId] = useState(null);

  const handleAddChapter = async (subjectId) => {
    if (!newChapterName || isAddingChapter) return;
    setIsAddingChapter(true);
    try {
      if (editingChapterId) {
        const res = await api.put(`/content/chapters/${editingChapterId}`, { chapterName: newChapterName });
        setChaptersBySubject(prev => ({
          ...prev,
          [subjectId]: prev[subjectId].map(c => c._id === editingChapterId ? res.data : c)
        }));
        setEditingChapterId(null);
      } else {
        const res = await api.post('/content/chapters', { subjectId, chapterName: newChapterName });
        setChaptersBySubject(prev => ({
          ...prev,
          [subjectId]: [...(prev[subjectId] || []), res.data]
        }));
      }
      setNewChapterName('');
    } catch (err) {
      console.error(err);
      alert('Failed to save chapter. Please try again.');
      await fetchChapters(subjectId); // Fallback
    } finally {
      setIsAddingChapter(false);
    }
  };

  const handleDeleteChapter = async (chapterId, subjectId) => {
    if (!window.confirm('Are you sure you want to delete this chapter and all its topics?')) return;
    try {
      await api.delete(`/content/chapters/${chapterId}`);
      setChaptersBySubject(prev => ({
        ...prev,
        [subjectId]: prev[subjectId].filter(c => c._id !== chapterId)
      }));
      if (expandedChapterId === chapterId) {
        setExpandedChapterId(null);
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Failed to delete chapter. It may contain protected content.';
      alert(msg);
      await fetchChapters(subjectId); // Fallback
    }
  };

  const handleEditChapterClick = (chapter) => {
    setEditingChapterId(chapter._id);
    setNewChapterName(chapter.chapterName);
  };

  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [editingTopicId, setEditingTopicId] = useState(null);

  const handleAddTopic = async (chapterId, subjectId) => {
    if (!newTopicName || isAddingTopic) return;
    setIsAddingTopic(true);
    try {
      if (editingTopicId) {
        const res = await api.put(`/content/topics/${editingTopicId}`, { topicName: newTopicName });
        setTopicsByChapter(prev => ({
          ...prev,
          [chapterId]: prev[chapterId].map(t => t._id === editingTopicId ? res.data : t)
        }));
        setEditingTopicId(null);
      } else {
        const res = await api.post('/content/topics', { chapterId, topicName: newTopicName });
        setTopicsByChapter(prev => ({
          ...prev,
          [chapterId]: [...(prev[chapterId] || []), res.data]
        }));
      }
      setNewTopicName('');
    } catch (err) {
      console.error(err);
      await fetchTopics(chapterId); // Fallback
    } finally {
      setIsAddingTopic(false);
    }
  };

  const handleDeleteTopic = async (topicId, chapterId) => {
    if (!window.confirm('Are you sure you want to delete this topic and all its content?')) return;
    try {
      await api.delete(`/content/topics/${topicId}`);
      setTopicsByChapter(prev => ({
        ...prev,
        [chapterId]: prev[chapterId].filter(t => t._id !== topicId)
      }));
      if (selectedTopic && selectedTopic._id === topicId) {
        setSelectedTopic(null);
      }
    } catch (err) {
      console.error(err);
      await fetchTopics(chapterId); // Fallback
    }
  };

  const handleEditTopicClick = (topic) => {
    setEditingTopicId(topic._id);
    setNewTopicName(topic.topicName);
  };

  const handleManageTopic = async (topic, subjectId) => {
    const topicId = topic._id || topic.id;
    if (!topicId) {
      console.error('Topic ID missing', topic);
      alert('Error: Could not identify topic.');
      return;
    }
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

  const handleUpdateObjectives = async () => {
    if (topicObjectives.length === 0) {
      showToast('Please add at least one objective.', 'error');
      return;
    }
    setIsSavingContent(true);
    try {
      const res = await api.put(`/content/topics/${selectedTopic._id}`, { 
        topicObjectives: topicObjectives 
      });
      setSelectedTopic(res.data.data || res.data);
      showToast('Learning objectives saved successfully!');
    } catch (err) {
      console.error('Failed to update objectives', err);
      showToast('Failed to save objectives.', 'error');
    } finally {
      setIsSavingContent(false);
    }
  };

  const handleAddObjective = () => {
    if (!newObjective.trim()) return;
    setTopicObjectives([...topicObjectives, newObjective.trim()]);
    setNewObjective('');
  };

  const removeObjective = (index) => {
    setTopicObjectives(topicObjectives.filter((_, i) => i !== index));
  };

  const [isSavingContent, setIsSavingContent] = useState(false);

  const validateForm = () => {
    const errors = {};
    if (!newContent.title?.trim()) errors.title = 'Title is required';
    
    if (newContent.type === 'concept') {
      if (!newContent.contentBody?.trim()) errors.contentBody = 'Content text is required';
    }
    
    if (newContent.type === 'video') {
      if (!newContent.url?.trim()) {
        errors.url = 'Video URL is required';
      } else if (!newContent.url.includes('youtube.com') && !newContent.url.includes('youtu.be') && !newContent.url.includes('vimeo.com')) {
        errors.url = 'Please enter a valid YouTube or Vimeo URL';
      }
    }
    
    if (newContent.type === 'exercise') {
      if (!newContent.question?.trim()) errors.question = 'Question text is required';
      if (newContent.options.some(opt => !opt.trim())) errors.options = 'All 4 options must be filled';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddContent = async () => {
    if (!validateForm() || isSavingContent) return;
    
    setIsSavingContent(true);
    try {
      if (newContent.type === 'concept') {
        const formData = new FormData();
        formData.append('title', newContent.title);
        formData.append('content', newContent.contentBody || 'Concept content...');
        if (selectedFile) {
          formData.append('contentImage', selectedFile);
        }

        if (isEditingContent) {
          const res = await api.put(`/content/concepts/${newContent.id}`, formData);
          setTopicContent(prev => ({ ...prev, concepts: prev.concepts.map(c => c._id === newContent.id ? res.data : c) }));
        } else {
          const res = await api.post(`/content/topics/${selectedTopic._id}/concepts`, formData);
          setTopicContent(prev => ({ ...prev, concepts: [...prev.concepts, res.data] }));
        }
      } else if (newContent.type === 'video') {
        if (isEditingContent) {
          const res = await api.put(`/content/videos/${newContent.id}`, { title: newContent.title, videoUrl: newContent.url });
          setTopicContent(prev => ({ ...prev, videos: prev.videos.map(v => v._id === newContent.id ? res.data : v) }));
        } else {
          const res = await api.post(`/content/topics/${selectedTopic._id}/videos`, { title: newContent.title, videoUrl: newContent.url || 'https://www.youtube.com/watch?v=placeholder' });
          setTopicContent(prev => ({ ...prev, videos: [...prev.videos, res.data] }));
        }
      } else if (newContent.type === 'exercise') {
        const payload = {
          title: newContent.title,
          topic: selectedTopic._id,
          question: newContent.question,
          options: newContent.options,
          correctAnswer: newContent.correctAnswer,
          hint: newContent.hint,
          difficulty: newContent.difficulty,
          description: newContent.contentBody || 'Exercise description'
        };
        if (isEditingContent) {
          const res = await api.put(`/exercises/${newContent.id}`, payload);
          const updatedExercise = res.data.data || res.data;
          setTopicContent(prev => ({ ...prev, exercises: prev.exercises.map(e => e._id === newContent.id ? updatedExercise : e) }));
        } else {
          const res = await api.post('/exercises', payload);
          const newExercise = res.data.data || res.data;
          setTopicContent(prev => ({ ...prev, exercises: [...prev.exercises, newExercise] }));
        }
      } else if (newContent.type === 'examQuestion') {
        if (isEditingContent) {
          const res = await api.put(`/exams/questions/${newContent.id}`, { questionText: newContent.title });
          setTopicContent(prev => ({ ...prev, examQuestions: prev.examQuestions.map(q => q._id === newContent.id ? { ...q, questionText: res.data.questionText } : q) }));
        } else {
          if (!newContent.examPaperId) {
            alert('Please select an Exam Paper to add this question to.');
            setIsSavingContent(false);
            return;
          }
          const res = await api.post(`/exams/papers/${newContent.examPaperId}/questions`, {
            questionText: newContent.title,
            topic: selectedTopic._id,
            marks: 5, // Default marks
            options: [
              { optionText: 'Option A', isCorrect: true },
              { optionText: 'Option B', isCorrect: false }
            ],
            explanation: newContent.contentBody || 'Explanation'
          });
          setTopicContent(prev => ({ ...prev, examQuestions: [...prev.examQuestions, res.data] }));
        }
      }
      // Reset form but preserve type if we are in the wizard steps
      const currentType = activeContentStep === 1 ? 'concept' : 
                         activeContentStep === 2 ? 'video' : 
                         activeContentStep === 3 ? 'exercise' : 
                         activeContentStep === 5 ? 'examQuestion' : 'concept';
                         
      setNewContent({ 
        id: null, title: '', url: '', type: currentType, contentBody: '', 
        examPaperId: '', question: '', options: ['', '', '', ''], correctAnswer: 0, hint: '', difficulty: 'Medium' 
      });
      setSelectedFile(null);
      setFilePreview(null);
      setFieldErrors({});
      showToast(`${currentType.charAt(0).toUpperCase() + currentType.slice(1)} added successfully!`);
    } catch (err) {
      console.error('Error saving content', err);
      const errorMsg = err.response?.data?.message || err.message || 'An unexpected error occurred';
      showToast(errorMsg, 'error');
      await fetchTopicContent(selectedTopic._id); // Fallback
    } finally {
      setIsSavingContent(false);
    }
  };

  const handleEditContent = (item, type) => {
    setIsEditingContent(true);
    setSelectedFile(null);
    setFilePreview(item.contentImageUrl ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${item.contentImageUrl}` : null);
    if (type === 'concept') {
      setNewContent({ id: item._id, title: item.title, url: '', type, contentBody: item.content, examPaperId: '' });
    } else if (type === 'video') {
      setNewContent({ id: item._id, title: item.title, url: item.videoUrl, type, contentBody: '', examPaperId: '' });
    } else if (type === 'exercise') {
      setNewContent({ 
        id: item._id, title: item.title, url: '', type, 
        contentBody: item.description, examPaperId: '',
        question: item.question || '',
        options: item.options || ['', '', '', ''],
        correctAnswer: item.correctAnswer || 0,
        hint: item.hint || '',
        difficulty: item.difficulty || 'Medium'
      });
    } else if (type === 'examQuestion') {
      setNewContent({ id: item._id, title: item.questionText, url: '', type, contentBody: item.explanation || '', examPaperId: item.examPaper || '' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteContent = async (id, type) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    try {
      if (type === 'concept') {
        await api.delete(`/content/concepts/${id}`);
        setTopicContent(prev => ({ ...prev, concepts: prev.concepts.filter(c => c._id !== id) }));
      } else if (type === 'video') {
        await api.delete(`/content/videos/${id}`);
        setTopicContent(prev => ({ ...prev, videos: prev.videos.filter(v => v._id !== id) }));
      } else if (type === 'exercise') {
        await api.delete(`/exercises/${id}`);
        setTopicContent(prev => ({ ...prev, exercises: prev.exercises.filter(e => e._id !== id) }));
      } else if (type === 'examQuestion') {
        await api.delete(`/exams/questions/${id}`);
        setTopicContent(prev => ({ ...prev, examQuestions: prev.examQuestions.filter(q => q._id !== id) }));
      }
    } catch (err) {
      console.error('Error deleting content', err);
      await fetchTopicContent(selectedTopic._id); // Fallback
    }
  };

  // Profile Form States
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phoneNumber: user?.phoneNumber || '',
      profileImageFile: undefined,
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    watch,
    reset: resetPasswordForm,
    formState: { errors: passwordFormErrors, isSubmitting: isPasswordSubmitting },
  } = useForm({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPasswordValue = watch('newPassword');

  useEffect(() => {
    if (activeSection === 'profile') {
      reset({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        phoneNumber: user?.phoneNumber || '',
        profileImageFile: undefined,
      });
    }
  }, [user, reset, activeSection]);

  const onProfileSubmit = async (formValues) => {
    try {
      setServerError('');
      setSuccessMessage('');
      const payload = new FormData();
      payload.append('firstName', formValues.firstName?.trim() || '');
      payload.append('lastName', formValues.lastName?.trim() || '');
      if (formValues.phoneNumber?.trim()) payload.append('phoneNumber', formValues.phoneNumber.trim());
      if (formValues.profileImageFile?.[0]) payload.append('profileImageFile', formValues.profileImageFile[0]);
      const response = await updateProfileRequest(payload);
      const updatedUser = response?.data || response;
      setUser(updatedUser);
      setSuccessMessage('Profile updated successfully.');
    } catch (error) {
      setServerError(error.response?.data?.message || 'Failed to update profile.');
    }
  };

  const onChangePassword = async (formValues) => {
    try {
      setPasswordError('');
      setPasswordSuccess('');
      const response = await changePasswordRequest({
        oldPassword: formValues.oldPassword,
        newPassword: formValues.newPassword,
      });
      setPasswordSuccess(response?.message || 'Password updated successfully.');
      resetPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setPasswordError(error.response?.data?.message || 'Failed to change password.');
    }
  };
  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans flex overflow-hidden">
      {/* Institutional Sidebar */}
      <aside className="w-[280px] bg-white border-r border-outline/10 hidden lg:flex flex-col z-50 shadow-[4px_0_12px_rgba(0,0,0,0.02)] shrink-0 h-screen sticky top-0">
        <div className="p-gutter h-20 flex items-center gap-3 border-b border-outline/5">
          <div className="w-8 h-8 bg-primary-container rounded flex items-center justify-center">
            <BookOpen className="text-on-primary" size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight">Faculty Console</span>
        </div>
        
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant px-4 mb-4 mt-2">Instructional Tools</p>
          
          <button
            onClick={() => { setActiveSection('subjects'); setSelectedTopic(null); }}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded transition-all font-medium ${activeSection === 'subjects' ? 'bg-primary-container text-on-primary' : 'text-on-surface-variant hover:bg-surface'}`}
          >
            <Layout size={20} />
            Curriculum Architect
          </button>

          <div className="h-[1px] bg-outline/5 my-6 mx-4"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant px-4 mb-4">Identity</p>
          
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded text-on-surface-variant hover:bg-surface transition-all font-medium">
            <GraduationCap size={20} />
            Landing Portal
          </Link>
          <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded text-on-surface-variant hover:bg-surface transition-all font-medium">
            <User size={20} />
            My Account
          </Link>
        </nav>

        <div className="p-4 border-t border-outline/5">
          <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 rounded text-error hover:bg-error/5 transition-all font-medium">
            <LogOut size={20} />
            Terminate Session
          </button>
        </div>
      </aside>

      <div className="flex-grow flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-outline/5 px-gutter flex items-center justify-between sticky top-0 z-40 shrink-0">
           <div>
             <h2 className="text-lg font-bold text-on-surface">Instructional Operations</h2>
             <p className="text-xs text-on-surface-variant uppercase tracking-widest font-black">Faculty Access Level</p>
           </div>
           
           <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
               <p className="text-sm font-bold">{user?.firstName || 'Faculty'}</p>
               <p className="text-[10px] text-primary-container uppercase font-bold tracking-widest">Instructor</p>
             </div>
             <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container border border-primary-container/20 overflow-hidden">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <BookOpen size={24} />
                )}
             </div>
           </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow p-gutter overflow-y-auto bg-surface/50">
          <div className="max-w-[1440px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {activeSection === 'subjects' && (
              !selectedTopic ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">Curriculum Architecture</h2>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Select a subject to manage topics and resources</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {subjects.map(subject => (
                      <div key={subject._id} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <BookOpen size={24} />
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-slate-900">{subject.name}</h3>
                        <div className="space-y-3 mb-6">
                          {subject.topics && subject.topics.length > 0 ? (
                            subject.topics.map(topic => (
                              <button 
                                key={topic._id} 
                                onClick={() => setSelectedTopic(topic)}
                                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all text-left group"
                              >
                                <span className="font-medium text-slate-700 group-hover:text-blue-600 transition-colors truncate">{topic.topicName}</span>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                              </button>
                            ))
                          ) : (
                            <p className="text-sm text-slate-400 italic py-2">No topics configured yet.</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setSelectedTopic(null)}
                        className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">{selectedTopic.topicName}</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Resource Architect Editor</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
                        <MonitorPlay size={20} />
                      </div>
                    </div>
                  </div>

              {/* Enterprise Step Indicator */}
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 mb-10 overflow-x-auto">
                <div className="flex items-center justify-between min-w-[800px] px-4">
                  {[
                    { icon: Compass, label: 'Objectives' },
                    { icon: Book, label: 'Concepts' },
                    { icon: Tv, label: 'Videos' },
                    { icon: FileCheck, label: 'Exercises' },
                    { icon: Activity, label: 'Quizzes' },
                    { icon: Library, label: 'Entrance' }
                  ].map((step, idx) => (
                    <div key={idx} className="flex items-center">
                      <button 
                        onClick={() => {
                          setActiveContentStep(idx);
                          setNewContent({ 
                            id: null, title: '', url: '', 
                            type: idx === 1 ? 'concept' : idx === 2 ? 'video' : idx === 3 ? 'exercise' : idx === 5 ? 'examQuestion' : 'concept', 
                            contentBody: '', examPaperId: '',
                            question: '', options: ['', '', '', ''], correctAnswer: 0, hint: '', difficulty: 'Medium'
                          });
                          setIsEditingContent(false);
                        }}
                        className={`flex flex-col items-center gap-3 transition-all duration-300 ${activeContentStep === idx ? 'text-blue-600' : 'text-slate-300 hover:text-slate-500'}`}
                      >
                        <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center transition-all ${activeContentStep === idx ? 'bg-slate-900 text-white shadow-2xl scale-110' : 'bg-slate-50'}`}>
                          <step.icon size={22} />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">{step.label}</span>
                      </button>
                      {idx < 5 && (
                        <div className={`h-px w-16 mx-4 rounded-full ${activeContentStep > idx ? 'bg-blue-500' : 'bg-slate-100'}`}></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/40 border border-slate-100 overflow-hidden min-h-[650px] flex flex-col">
                <div className="p-12 border-b border-slate-50 bg-slate-50/20 flex-1">
                  
                  {/* STEP 0: OBJECTIVES */}
                  {activeContentStep === 0 && (
                    <div className="animate-in fade-in duration-500 max-w-4xl">
                      <div className="mb-10">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Learning Objectives</h2>
                        <p className="text-slate-400 text-sm font-medium">Define the core academic outcomes for this specific topic.</p>
                      </div>
                      
                      <div className="space-y-8">
                        <div className="flex gap-4 p-2 bg-slate-50 rounded-2xl border border-slate-100">
                          <input 
                            type="text" 
                            placeholder="Specify a new achievement outcome..."
                            value={newObjective}
                            onChange={(e) => setNewObjective(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddObjective()}
                            className="flex-1 bg-white px-6 py-4 rounded-xl border border-slate-200 focus:border-blue-400 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                          />
                          <button 
                            onClick={handleAddObjective}
                            className="bg-slate-900 text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-lg"
                          >
                            Add Outcome
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          {topicObjectives.map((obj, i) => (
                            <div key={i} className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-100 group hover:border-blue-400 transition-all shadow-sm">
                              <div className="flex items-center gap-5 flex-1">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-300 flex items-center justify-center font-black text-[10px] border border-slate-100">
                                  {String(i + 1).padStart(2, '0')}
                                </div>
                                {editingObjectiveIndex === i ? (
                                  <input 
                                    type="text"
                                    value={editingObjectiveText}
                                    onChange={(e) => setEditingObjectiveText(e.target.value)}
                                    onBlur={() => {
                                      if (editingObjectiveText.trim()) {
                                        const newObjs = [...topicObjectives];
                                        newObjs[i] = editingObjectiveText.trim();
                                        setTopicObjectives(newObjs);
                                      }
                                      setEditingObjectiveIndex(null);
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        if (editingObjectiveText.trim()) {
                                          const newObjs = [...topicObjectives];
                                          newObjs[i] = editingObjectiveText.trim();
                                          setTopicObjectives(newObjs);
                                        }
                                        setEditingObjectiveIndex(null);
                                      }
                                    }}
                                    autoFocus
                                    className="flex-1 font-bold text-slate-800 bg-slate-50 px-4 py-2 rounded-lg outline-none border border-blue-200"
                                  />
                                ) : (
                                  <span className="font-bold text-slate-700 tracking-tight">{obj}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all ml-4">
                                <button 
                                  onClick={() => {
                                    setEditingObjectiveIndex(i);
                                    setEditingObjectiveText(obj);
                                  }}
                                  className="p-2 text-slate-300 hover:text-blue-600 transition-all"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button onClick={() => removeObjective(i)} className="p-2 text-slate-300 hover:text-red-500 transition-all">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                          {topicObjectives.length === 0 && (
                            <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                              <Compass className="w-12 h-12 mx-auto mb-4 text-slate-200" />
                              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No objectives defined</p>
                            </div>
                          )}
                        </div>

                        <div className="mt-12 pt-10 border-t border-slate-100 flex justify-end">
                           <button 
                             onClick={handleUpdateObjectives}
                             className="flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200"
                           >
                             <Save size={16} /> Save Curriculum Goals
                           </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 1: CONCEPTS */}
                  {activeContentStep === 1 && (
                    <div className="animate-in fade-in duration-500 max-w-6xl">
                      <div className="mb-10">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Theoretical Framework</h2>
                        <p className="text-slate-400 text-sm font-medium">Document the core concepts, theories, and academic context.</p>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-1">
                          <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8 space-y-6 sticky top-0">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Registration Terminal</h4>
                            
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Concept Identity</label>
                                <input 
                                  type="text" 
                                  placeholder="Title of the concept..."
                                  value={newContent.title}
                                  onChange={(e) => {
                                    setNewContent({...newContent, type: 'concept', title: e.target.value});
                                    if(fieldErrors.title) setFieldErrors({...fieldErrors, title: null});
                                  }}
                                  className={`w-full bg-white border px-5 py-3 rounded-xl text-sm font-bold text-slate-700 focus:border-blue-400 outline-none transition-all ${fieldErrors.title ? 'border-red-200' : 'border-slate-100'}`}
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Detailed Content</label>
                                <textarea 
                                  placeholder="Formulate the academic theory..."
                                  value={newContent.contentBody}
                                  onChange={(e) => {
                                    setNewContent({...newContent, contentBody: e.target.value});
                                    if(fieldErrors.contentBody) setFieldErrors({...fieldErrors, contentBody: null});
                                  }}
                                  rows="6"
                                  className={`w-full bg-white border px-5 py-3 rounded-xl text-sm font-medium text-slate-600 focus:border-blue-400 outline-none transition-all resize-none ${fieldErrors.contentBody ? 'border-red-200' : 'border-slate-100'}`}
                                ></textarea>
                              </div>

                              <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Schematic Illustration</label>
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                      setSelectedFile(file);
                                      setFilePreview(URL.createObjectURL(file));
                                    }
                                  }}
                                  className="hidden" 
                                  id="concept-image-upload"
                                />
                                <label 
                                  htmlFor="concept-image-upload"
                                  className="flex items-center gap-3 px-5 py-3 rounded-xl border border-slate-100 bg-white hover:border-blue-400 cursor-pointer transition-all text-[11px] font-black text-slate-400 hover:text-blue-600"
                                >
                                  <PlusCircle size={16} />
                                  {selectedFile ? selectedFile.name : 'Attach Diagram'}
                                </label>
                              </div>

                              <button 
                                onClick={handleAddContent}
                                disabled={!newContent.title || isSavingContent}
                                className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-lg mt-4"
                              >
                                {isEditingContent ? 'Update Registry' : 'Commit Concept'}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="lg:col-span-2 space-y-6">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-1">Curriculum Pool</h4>
                          <div className="grid grid-cols-1 gap-4">
                            {topicContent.concepts.map(concept => (
                              <div key={concept._id} className="bg-white border border-slate-100 p-6 rounded-[2rem] flex items-start gap-5 group hover:border-blue-400 hover:shadow-md transition-all">
                                 <div className="w-16 h-16 bg-slate-50 border border-slate-100 text-slate-300 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
                                   {concept.contentImageUrl ? (
                                     <img src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${concept.contentImageUrl}`} alt={concept.title} className="w-full h-full object-cover" />
                                   ) : <FileText size={24} />}
                                 </div>
                                 <div className="flex-1 min-w-0">
                                   <h4 className="font-black text-slate-800 text-base mb-1 tracking-tight">{concept.title}</h4>
                                   <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 font-medium">{concept.content}</p>
                                 </div>
                                 <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                   <button onClick={() => handleEditContent(concept, 'concept')} className="p-2 text-slate-300 hover:text-blue-500 transition-colors"><Edit2 size={16}/></button>
                                   <button onClick={() => handleDeleteContent(concept._id, 'concept')} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                                 </div>
                              </div>
                            ))}
                            {topicContent.concepts.length === 0 && (
                              <div className="text-center py-32 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No theoretical content registered</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: VIDEOS */}
                  {activeContentStep === 2 && (
                    <div className="animate-in fade-in duration-500 max-w-6xl">
                      <div className="mb-12 flex items-center justify-between">
                        <div>
                          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Visual Resource Repository</h2>
                          <p className="text-slate-400 text-sm font-medium">Curate a professional playlist of academic video lessons.</p>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 px-5 py-2 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          {topicContent.videos.length} Active Records
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                        <div className="lg:col-span-1 space-y-6">
                           <div className="bg-slate-900 rounded-[2rem] p-8 text-white space-y-6 shadow-2xl">
                              <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">Ingest Module</h4>
                              
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <label className="text-[9px] font-black text-white/40 uppercase tracking-widest px-1">Lesson Identity</label>
                                  <input 
                                    type="text" 
                                    placeholder="e.g. 01. Fundamental Principles"
                                    value={newContent.title}
                                    onChange={(e) => setNewContent({...newContent, type: 'video', title: e.target.value})}
                                    className="w-full bg-white/10 border border-white/10 rounded-xl px-5 py-3 text-sm font-bold text-white outline-none focus:border-blue-500 transition-all placeholder:text-white/20"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <label className="text-[9px] font-black text-white/40 uppercase tracking-widest px-1">Source URL</label>
                                  <input 
                                    type="text" 
                                    placeholder="YouTube / Vimeo Integration Link"
                                    value={newContent.url}
                                    onChange={(e) => setNewContent({...newContent, type: 'video', url: e.target.value})}
                                    className="w-full bg-white/10 border border-white/10 rounded-xl px-5 py-3 text-sm font-bold text-white outline-none focus:border-blue-500 transition-all placeholder:text-white/20"
                                  />
                                </div>

                                <button 
                                  onClick={handleAddContent}
                                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 mt-4"
                                >
                                  {isEditingContent ? 'Update Feed' : 'Append to Library'}
                                </button>
                              </div>
                           </div>
                        </div>

                        <div className="lg:col-span-3">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             {topicContent.videos.map((video, idx) => (
                               <div key={video._id} className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden group hover:border-blue-400 hover:shadow-xl transition-all duration-500">
                                  <div className="aspect-video bg-slate-900 relative group-hover:scale-105 transition-transform duration-700">
                                     <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300">
                                          <MonitorPlay size={24} />
                                        </div>
                                     </div>
                                     <div className="absolute top-4 left-4">
                                        <span className="bg-black/50 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/10">Video {idx + 1}</span>
                                     </div>
                                  </div>
                                  <div className="p-6">
                                     <h4 className="font-black text-slate-800 text-base mb-1 truncate tracking-tight">{video.title}</h4>
                                     <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest truncate">{video.videoUrl}</p>
                                     
                                     <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-all">
                                        <button onClick={() => handleEditContent(video, 'video')} className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={14}/></button>
                                        <button onClick={() => handleDeleteContent(video._id, 'video')} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={14}/></button>
                                     </div>
                                  </div>
                               </div>
                             ))}
                             {topicContent.videos.length === 0 && (
                               <div className="col-span-full py-40 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                                 <Tv className="w-12 h-12 mx-auto mb-4 text-slate-200" />
                                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Visual repository is empty</p>
                               </div>
                             )}
                           </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: EXERCISES */}
                  {activeContentStep === 3 && (
                    <div className="animate-in fade-in duration-500 max-w-5xl">
                      <div className="mb-10">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Cognitive Exercises</h2>
                        <p className="text-slate-400 text-sm font-medium">Construct practice sets to reinforce conceptual understanding.</p>
                      </div>
                      
                      <div className="space-y-12">
                        <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-10">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                             <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Exercise Taxonomy</label>
                                <input 
                                  type="text" 
                                  placeholder="Set Title (e.g. Fundamental Principles Practice)"
                                  value={newContent.title}
                                  onChange={(e) => setNewContent({...newContent, type: 'exercise', title: e.target.value})}
                                  className="w-full bg-white border border-slate-200 px-6 py-4 rounded-2xl text-sm font-bold text-slate-700 focus:border-blue-400 outline-none transition-all"
                                />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Academic Difficulty</label>
                                <div className="flex gap-2">
                                  {['Easy', 'Medium', 'Hard'].map((level) => (
                                    <button
                                      key={level}
                                      onClick={() => setNewContent({...newContent, difficulty: level})}
                                      className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 ${newContent.difficulty === level ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-100 text-slate-300 hover:border-slate-200'}`}
                                    >
                                      {level}
                                    </button>
                                  ))}
                                </div>
                             </div>
                          </div>

                          <div className="space-y-6 bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm">
                            <div className="space-y-2">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Question Specification</label>
                              <textarea 
                                placeholder="Formulate the core challenge question..."
                                value={newContent.question}
                                onChange={(e) => setNewContent({...newContent, question: e.target.value})}
                                rows="3"
                                className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-sm font-bold text-slate-700 focus:border-blue-400 outline-none transition-all resize-none"
                              ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {newContent.options.map((opt, idx) => (
                                <div key={idx} className="space-y-2">
                                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center justify-between">
                                    Option {idx + 1}
                                    {newContent.correctAnswer === idx && <span className="text-blue-500 font-black">Key Answer</span>}
                                  </label>
                                  <div className="relative group">
                                    <input 
                                      type="text"
                                      placeholder={`Hypothesis ${idx + 1}...`}
                                      value={opt}
                                      onChange={(e) => {
                                        const newOpts = [...newContent.options];
                                        newOpts[idx] = e.target.value;
                                        setNewContent({...newContent, options: newOpts});
                                      }}
                                      className={`w-full bg-white border px-6 py-4 rounded-xl text-sm font-bold text-slate-700 outline-none transition-all ${newContent.correctAnswer === idx ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-slate-100 focus:border-slate-300'}`}
                                    />
                                    <button 
                                      onClick={() => setNewContent({...newContent, correctAnswer: idx})}
                                      className={`absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 transition-all ${newContent.correctAnswer === idx ? 'bg-blue-600 border-blue-600' : 'border-slate-100 group-hover:border-slate-300'}`}
                                    ></button>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="pt-6 border-t border-slate-50 flex justify-end">
                               <button 
                                 onClick={handleAddContent}
                                 disabled={!newContent.title || !newContent.question || isSavingContent}
                                 className="bg-slate-900 text-white px-12 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center gap-3"
                               >
                                 <PlusCircle size={18} /> {isEditingContent ? 'Update Logic' : 'Commit Exercise'}
                               </button>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Inventory Storage</h4>
                          <div className="grid grid-cols-1 gap-6">
                            {topicContent.exercises.map((exercise, idx) => (
                              <div key={exercise._id} className="bg-white border border-slate-100 p-8 rounded-[3rem] group hover:border-blue-400 hover:shadow-xl transition-all duration-500">
                                <div className="flex items-center justify-between mb-6">
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-300 flex items-center justify-center font-black text-[10px] border border-slate-100">
                                      {String(idx + 1).padStart(2, '0')}
                                    </div>
                                    <div>
                                      <h4 className="font-black text-slate-800 text-lg leading-tight tracking-tight">{exercise.title}</h4>
                                      <div className="flex items-center gap-3 mt-1">
                                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border ${exercise.difficulty === 'Easy' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : exercise.difficulty === 'Medium' ? 'bg-amber-50 border-amber-100 text-amber-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                                          {exercise.difficulty || 'Medium'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                    <button onClick={() => handleEditContent(exercise, 'exercise')} className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={16}/></button>
                                    <button onClick={() => handleDeleteContent(exercise._id, 'exercise')} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16}/></button>
                                  </div>
                                </div>
                                
                                <div className="bg-slate-50/50 rounded-[2rem] p-8 border border-slate-100">
                                  <p className="font-bold text-slate-700 text-sm mb-6 leading-relaxed">{exercise.question}</p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {(exercise.options || []).map((opt, i) => (
                                      <div key={i} className={`px-5 py-4 rounded-xl border flex items-center gap-4 transition-all ${i === exercise.correctAnswer ? 'bg-white border-blue-200 text-blue-700 shadow-sm' : 'bg-transparent border-slate-100 text-slate-400 opacity-60'}`}>
                                        <div className={`w-2 h-2 rounded-full ${i === exercise.correctAnswer ? 'bg-blue-500' : 'bg-slate-200'}`}></div>
                                        <span className="text-[11px] font-black uppercase tracking-tight">{opt}</span>
                                        {i === exercise.correctAnswer && <span className="ml-auto text-[8px] font-black uppercase bg-blue-50 px-2 py-0.5 rounded">Key</span>}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: QUIZZES */}
                  {activeContentStep === 4 && (
                    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
                       <div className="text-center py-20">
                          <div className="w-24 h-24 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl">
                             <Activity size={40} />
                          </div>
                          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Assessment Integration</h2>
                          <p className="text-slate-400 text-base max-w-md mx-auto mb-10 font-medium">Design time-sensitive evaluation modules to measure student mastery.</p>
                          
                          <button className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-2xl hover:-translate-y-1">
                             Construct Evaluation Module
                          </button>
                       </div>

                       <div className="space-y-4">
                         {topicContent.quizzes.map(quiz => (
                           <div key={quiz._id} className="bg-white border border-slate-100 p-8 rounded-[2.5rem] flex justify-between items-center group hover:border-blue-400 hover:shadow-xl transition-all">
                              <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                  <Activity size={24} />
                                </div>
                                <div>
                                  <h4 className="font-black text-slate-800 text-lg tracking-tight">{quiz.title}</h4>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Standardized Assessment</p>
                                </div>
                              </div>
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button className="p-3 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest px-6">Modify</button>
                                <button className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest px-6">Decommission</button>
                              </div>
                           </div>
                         ))}
                       </div>
                    </div>
                  )}

                  {/* STEP 5: ENTRANCE QUESTIONS */}
                  {activeContentStep === 5 && (
                    <div className="animate-in fade-in duration-500 max-w-6xl">
                      <div className="mb-10">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Historical Exam Inventory</h2>
                        <p className="text-slate-400 text-sm font-medium">Link institutional past-year exam questions to the curriculum hierarchy.</p>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                         <div className="lg:col-span-1">
                            <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8 space-y-6">
                               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Inventory Linker</h4>
                               
                               <div className="space-y-4">
                                  <div className="space-y-2">
                                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Source Repository</label>
                                     <select
                                       value={newContent.examPaperId}
                                       onChange={(e) => setNewContent({...newContent, type: 'examQuestion', examPaperId: e.target.value})}
                                       className="w-full bg-white border border-slate-100 px-5 py-3 rounded-xl text-sm font-bold text-slate-700 focus:border-blue-400 outline-none transition-all cursor-pointer"
                                     >
                                       <option value="">Select Paper Pool</option>
                                       {examPapers.map(paper => (
                                         <option key={paper._id} value={paper._id}>{paper.title} ({paper.year})</option>
                                       ))}
                                     </select>
                                  </div>

                                  <div className="space-y-2">
                                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Transcript Copy</label>
                                     <textarea 
                                       placeholder="Paste original question text..."
                                       value={newContent.title}
                                       onChange={(e) => setNewContent({...newContent, type: 'examQuestion', title: e.target.value})}
                                       rows="6"
                                       className="w-full bg-white border border-slate-100 px-5 py-3 rounded-xl text-sm font-medium text-slate-600 focus:border-blue-400 outline-none transition-all resize-none"
                                     ></textarea>
                                  </div>

                                  <button 
                                    onClick={handleAddContent}
                                    disabled={!newContent.title || !newContent.examPaperId || isSavingContent}
                                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-lg mt-4"
                                  >
                                    Link to Curriculum
                                  </button>
                               </div>
                            </div>
                         </div>

                         <div className="lg:col-span-3 space-y-6">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Associated Inventory</h4>
                            <div className="grid grid-cols-1 gap-4">
                              {topicContent.examQuestions.map(q => (
                                <div key={q._id} className="bg-white border border-slate-100 p-8 rounded-[3rem] flex items-start justify-between group hover:border-blue-400 transition-all">
                                   <div className="flex gap-6">
                                     <div className="w-14 h-14 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                                       <Library size={24} />
                                     </div>
                                     <div>
                                       <p className="font-bold text-slate-700 leading-relaxed mb-3 text-sm">{q.questionText}</p>
                                       <div className="flex items-center gap-2">
                                          <span className="text-[8px] font-black uppercase bg-blue-50 text-blue-500 px-3 py-1 rounded-full border border-blue-100 tracking-widest">
                                            {q.examPaperDoc?.title || 'External Pool'}
                                          </span>
                                       </div>
                                     </div>
                                   </div>
                                   <button onClick={() => handleDeleteContent(q._id, 'examQuestion')} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18}/></button>
                                </div>
                              ))}
                              {topicContent.examQuestions.length === 0 && (
                                <div className="py-32 text-center bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-100">
                                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No exam inventory linked</p>
                                </div>
                              )}
                            </div>
                         </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* Wizard Footer Controls */}
                <div className="px-12 py-10 border-t border-slate-50 bg-slate-50/20 flex items-center justify-between">
                   <button 
                     disabled={activeContentStep === 0}
                     onClick={() => setActiveContentStep(activeContentStep - 1)}
                     className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeContentStep === 0 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-slate-900 hover:bg-white'}`}
                   >
                     <ArrowLeft size={18} /> Previous Stage
                   </button>
                   
                   <div className="hidden sm:flex gap-2">
                     {[0,1,2,3,4,5].map(i => (
                       <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${activeContentStep === i ? 'w-10 bg-slate-900' : 'w-2 bg-slate-200'}`}></div>
                     ))}
                   </div>

                   <button 
                     disabled={activeContentStep === 5}
                     onClick={() => setActiveContentStep(activeContentStep + 1)}
                     className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeContentStep === 5 ? 'bg-slate-100 text-slate-200 cursor-not-allowed' : 'bg-slate-900 text-white shadow-2xl shadow-slate-200 hover:bg-black hover:-translate-y-1'}`}
                   >
                     {activeContentStep === 5 ? 'Finalized' : 'Advance Stage'} <ArrowRight size={18} />
                   </button>
                </div>
              </div>
            </div>
          )
        )}
        </div>
      </main>
      </div>
      
      {/* TOAST NOTIFICATION SYSTEM */}
      {toast.show && (
        <div className={`fixed bottom-8 right-8 z-[9999] px-8 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right duration-300 flex items-center gap-3 font-black text-sm uppercase tracking-widest ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.type === 'success' ? <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center font-bold">✓</div> : <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center font-bold">!</div>}
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
