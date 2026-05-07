import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Layout, 
  User, 
  LogOut, 
  BookOpen, 
  ArrowRight,
  CircleUserRound,
  Menu,
  X,
  ChevronRight,
  Bell,
  Bookmark,
  TriangleAlert,
  Search,
  MessageSquarePlus,
  Send
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import {
  getUnreadNotifications,
  markNotificationRead,
  searchTopics,
  createIssue,
  getMyIssues,
  getBookmarks,
  removeBookmark,
  askQuestion
} from '../services/engagement';

const gradeMatchesFilter = (subjectGrade, selectedGrade) => {
  const g = String(subjectGrade ?? '').replace(/\D/g, '');
  const s = String(selectedGrade ?? '').replace(/\D/g, '');
  if (g && s) return g === s;
  return String(subjectGrade) === String(selectedGrade);
};

const StudentDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [myIssues, setMyIssues] = useState([]);
  const [topicSearch, setTopicSearch] = useState('');
  const [topicResults, setTopicResults] = useState([]);
  const [issueForm, setIssueForm] = useState({ title: '', issueDescription: '', issueType: 'bug' });
  const [questionForm, setQuestionForm] = useState({ topicId: '', questionText: '' });
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await api.get('/subjects');
        const subjectsList = Array.isArray(response.data) ? response.data : (response.data.data || []);
        
        const filtered = subjectsList.filter(s => 
          gradeMatchesFilter(s.gradeLevel, user.gradeLevel) && 
          (!s.stream || s.stream === user.stream)
        );
        setSubjects(filtered);
      } catch (err) {
        console.error('Failed to fetch subjects:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchSubjects();
    }
  }, [user]);

  useEffect(() => {
    const fetchEngagement = async () => {
      try {
        const [notifRes, bookmarkRes, issueRes] = await Promise.all([
          getUnreadNotifications(),
          getBookmarks(),
          getMyIssues()
        ]);
        setNotifications(notifRes?.data || []);
        setBookmarks(bookmarkRes?.data || []);
        setMyIssues(issueRes?.data || []);
      } catch (err) {
        console.error('Failed to fetch student engagement data', err);
      }
    };
    if (user?.role === 'student') {
      fetchEngagement();
    }
  }, [user]);

  useEffect(() => {
    const run = async () => {
      if (!topicSearch || topicSearch.trim().length < 2) {
        setTopicResults([]);
        return;
      }
      try {
        const res = await searchTopics(topicSearch.trim());
        const list = Array.isArray(res) ? res : (res?.data || []);
        setTopicResults(list.slice(0, 8));
      } catch (err) {
        console.error('Topic search failed', err);
      }
    };
    const t = setTimeout(run, 250);
    return () => clearTimeout(t);
  }, [topicSearch]);

  const handleSelectSubject = (subjectId) => {
    navigate(`/curriculum/subject/${subjectId}/chapters`);
  };

  const SIDEBAR_ITEMS = [
    { key: 'dashboard', label: 'Dashboard', icon: <Layout size={20} />, path: '/dashboard' },
    { key: 'curriculum', label: 'My Subjects', icon: <BookOpen size={20} />, path: '/dashboard' }, // Same as dashboard for student
    { key: 'profile', label: 'Profile', icon: <User size={20} />, path: '/profile' },
  ];

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveBookmark = async (id) => {
    try {
      await removeBookmark(id);
      setBookmarks((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenBookmark = (bookmark) => {
    if (!bookmark?.targetPath) return;
    navigate(bookmark.targetPath);
  };

  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    if (!issueForm.title || !issueForm.issueDescription) return;
    try {
      const res = await createIssue(issueForm);
      setMyIssues((prev) => [res.data, ...prev]);
      setIssueForm({ title: '', issueDescription: '', issueType: 'bug' });
      setFeedback('Issue submitted successfully.');
    } catch (err) {
      setFeedback(err?.response?.data?.message || 'Failed to submit issue.');
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!questionForm.topicId || !questionForm.questionText) return;
    try {
      await askQuestion(questionForm);
      setQuestionForm({ topicId: '', questionText: '' });
      setFeedback('Question submitted for teachers.');
    } catch (err) {
      setFeedback(err?.response?.data?.message || 'Failed to ask question.');
    }
  };

  return (
    <div className="h-screen bg-background text-on-surface font-sans flex overflow-hidden">
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
              to={item.path}
              className={`flex items-center gap-3 w-full px-4 py-3 transition-all font-semibold rounded-lg border-l-4 ${
                item.key === 'dashboard'
                  ? 'bg-primary-container/10 text-primary-container border-primary-container' 
                  : 'bg-surface text-on-surface-variant border-transparent hover:bg-surface-container-high'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-outline/5">
          <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 text-error hover:bg-error/5 transition-all font-semibold rounded-lg">
            <LogOut size={20} />
            Logout
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
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 w-full px-4 py-3 transition-all font-semibold rounded-lg border-l-4 ${
                    item.key === 'dashboard'
                      ? 'bg-primary-container/10 text-primary-container border-primary-container' 
                      : 'bg-surface text-on-surface-variant border-transparent'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t border-outline/5">
              <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 text-error hover:bg-error/5 transition-all font-semibold rounded-lg">
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-grow flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-outline/5 px-4 lg:px-gutter flex items-center justify-between sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden text-on-surface-variant p-2"><Menu size={24} /></button>
            <h2 className="text-xl font-semibold text-on-surface">Dashboard</h2>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden md:block text-right">
               <p className="text-sm font-semibold">{user?.firstName} {user?.lastName}</p>
               <p className="text-[10px] text-primary-container uppercase font-bold tracking-widest">Grade {user?.gradeLevel} • {user?.stream || 'General'}</p>
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

        {/* Main Content Area */}
        <main className="flex-grow p-gutter overflow-y-auto bg-white">
          <div className="max-w-[1440px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold">My Subjects</h3>
                <div className="px-4 py-1 bg-primary-container/10 text-primary-container rounded-full text-xs font-bold">
                  {subjects.length} Subjects Assigned
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1,2,3].map(i => <div key={i} className="h-48 bg-surface-variant/20 rounded-2xl animate-pulse"></div>)}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subjects.map(subject => (
                    <div key={subject._id} className="bg-white rounded-2xl border border-outline/10 p-6 shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
                      <div className="w-12 h-12 bg-primary-container/10 rounded-lg flex items-center justify-center text-primary-container mb-4">
                        <BookOpen size={24} />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{subject.subjectName}</h3>
                      <p className="text-outline text-sm mb-6 flex-grow">Access chapters, topics, and exercises for {subject.subjectName}.</p>
                      <button 
                        onClick={() => handleSelectSubject(subject._id)} 
                        className="w-full bg-primary-container text-white py-2.5 rounded-lg font-semibold text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2"
                      >
                        Start Learning
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  ))}
                  
                  {subjects.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-surface-variant/10 rounded-2xl border border-dashed border-outline/20">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <BookOpen size={32} className="text-outline/30" />
                      </div>
                      <h3 className="text-lg font-bold text-on-surface mb-2">No Courses Assigned</h3>
                      <p className="text-on-surface-variant text-sm max-w-xs mx-auto">
                        We couldn't find any subjects for Grade {user?.gradeLevel} {user?.stream ? `(${user?.stream} Stream)` : ''}.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-4">
                <div className="bg-white rounded-2xl border border-outline/10 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Bell size={18} className="text-primary-container" />
                    <h4 className="font-bold">Unread Notifications</h4>
                  </div>
                  <div className="space-y-3 max-h-72 overflow-auto pr-1">
                    {notifications.map((n) => (
                      <div key={n._id} className="p-3 rounded-xl border border-outline/10 bg-surface">
                        <p className="font-semibold text-sm">{n.title}</p>
                        <p className="text-xs text-on-surface-variant mt-1">{n.message}</p>
                        <button
                          onClick={() => handleMarkRead(n._id)}
                          className="mt-2 text-xs font-semibold text-primary-container hover:underline"
                        >
                          Mark as read
                        </button>
                      </div>
                    ))}
                    {notifications.length === 0 && <p className="text-sm text-on-surface-variant">No unread notifications.</p>}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-outline/10 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Bookmark size={18} className="text-primary-container" />
                    <h4 className="font-bold">My Bookmarks</h4>
                  </div>
                  <div className="space-y-2 max-h-72 overflow-auto pr-1">
                    {bookmarks.map((b) => (
                      <div key={b._id} className="p-3 rounded-xl border border-outline/10 bg-surface">
                        <button type="button" onClick={() => handleOpenBookmark(b)} className="w-full text-left" disabled={!b.targetPath}>
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary-container">{b.resourceType.replace('-', ' ')}</p>
                          <p className="text-sm font-semibold text-on-surface mt-1 line-clamp-2">{b.title || b.resourceId}</p>
                          {b.note && <p className="text-[11px] text-on-surface-variant mt-2 line-clamp-2">Note: {b.note}</p>}
                        </button>
                        <div className="flex justify-end mt-2">
                          <button onClick={() => handleRemoveBookmark(b._id)} className="text-xs text-error font-semibold">Remove</button>
                        </div>
                      </div>
                    ))}
                    {bookmarks.length === 0 && <p className="text-sm text-on-surface-variant">No bookmarks yet.</p>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-outline/10 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Search size={18} className="text-primary-container" />
                    <h4 className="font-bold">Search Topics (FR-12)</h4>
                  </div>
                  <input
                    value={topicSearch}
                    onChange={(e) => setTopicSearch(e.target.value)}
                    placeholder="Search by topic title..."
                    className="w-full border border-outline/20 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-container/20"
                  />
                  <div className="mt-3 space-y-2 max-h-56 overflow-auto pr-1">
                    {topicResults.map((t) => (
                      <div key={t._id} className="p-3 rounded-xl border border-outline/10 bg-surface">
                        <p className="text-sm font-semibold">{t.topicName}</p>
                        <button onClick={() => navigate(`/curriculum/topic/${t._id}`)} className="text-xs text-primary-container font-semibold mt-1">Open topic</button>
                      </div>
                    ))}
                    {topicSearch && topicResults.length === 0 && <p className="text-xs text-on-surface-variant">No matching topics.</p>}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-outline/10 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TriangleAlert size={18} className="text-primary-container" />
                    <h4 className="font-bold">Report Issue (FR-14)</h4>
                  </div>
                  <form onSubmit={handleIssueSubmit} className="space-y-3">
                    <input
                      value={issueForm.title}
                      onChange={(e) => setIssueForm((p) => ({ ...p, title: e.target.value }))}
                      placeholder="Issue title"
                      className="w-full border border-outline/20 rounded-xl px-4 py-2 text-sm"
                    />
                    <textarea
                      value={issueForm.issueDescription}
                      onChange={(e) => setIssueForm((p) => ({ ...p, issueDescription: e.target.value }))}
                      placeholder="Describe wrong answer / missing material / bug..."
                      className="w-full border border-outline/20 rounded-xl px-4 py-2 text-sm min-h-[90px]"
                    />
                    <div className="flex items-center gap-3">
                      <select
                        value={issueForm.issueType}
                        onChange={(e) => setIssueForm((p) => ({ ...p, issueType: e.target.value }))}
                        className="border border-outline/20 rounded-xl px-3 py-2 text-sm"
                      >
                        <option value="bug">bug</option>
                        <option value="error">error</option>
                        <option value="feature-request">feature-request</option>
                        <option value="other">other</option>
                      </select>
                      <button className="bg-primary-container text-white px-4 py-2 rounded-xl text-sm font-semibold">Submit</button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-outline/10 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquarePlus size={18} className="text-primary-container" />
                    <h4 className="font-bold">Ask Topic Question (FR-16)</h4>
                  </div>
                  <form onSubmit={handleAskQuestion} className="space-y-3">
                    <input
                      value={questionForm.topicId}
                      onChange={(e) => setQuestionForm((p) => ({ ...p, topicId: e.target.value }))}
                      placeholder="Topic ID"
                      className="w-full border border-outline/20 rounded-xl px-4 py-2 text-sm"
                    />
                    <textarea
                      value={questionForm.questionText}
                      onChange={(e) => setQuestionForm((p) => ({ ...p, questionText: e.target.value }))}
                      placeholder="Ask your question..."
                      className="w-full border border-outline/20 rounded-xl px-4 py-2 text-sm min-h-[90px]"
                    />
                    <button className="bg-primary-container text-white px-4 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-2">
                      <Send size={14} /> Send
                    </button>
                  </form>
                </div>

                <div className="bg-white rounded-2xl border border-outline/10 p-6">
                  <h4 className="font-bold mb-4">My Recent Issues</h4>
                  <div className="space-y-2 max-h-60 overflow-auto pr-1">
                    {myIssues.slice(0, 6).map((i) => (
                      <div key={i._id} className="p-3 rounded-xl border border-outline/10 bg-surface">
                        <p className="text-sm font-semibold">{i.title}</p>
                        <p className="text-xs text-on-surface-variant mt-1 capitalize">Status: {i.issueStatus}</p>
                        {i.response && <p className="text-xs mt-1 text-primary-container">Response: {i.response}</p>}
                      </div>
                    ))}
                    {myIssues.length === 0 && <p className="text-sm text-on-surface-variant">No issues reported yet.</p>}
                  </div>
                  {feedback && <p className="text-xs mt-3 text-primary-container font-semibold">{feedback}</p>}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
