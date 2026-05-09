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
    <div className="h-screen bg-background text-on-surface font-sans flex overflow-hidden min-w-0 max-w-[100vw]">
      {/* Sidebar (Desktop) */}
      <aside className="w-[280px] max-w-[85vw] bg-white border-r border-outline/10 hidden lg:flex flex-col z-50 shadow-[4px_0_12px_rgba(0,0,0,0.02)] shrink-0 h-full sticky top-0 min-w-0">
        <div className="p-4 sm:p-gutter h-[4.5rem] sm:h-20 flex items-center gap-3 border-b border-outline/5 px-4 sm:px-8 min-w-0">
          <div className="w-8 h-8 bg-primary-container rounded-lg flex items-center justify-center shrink-0">
            <GraduationCap className="text-on-primary" size={20} />
          </div>
          <h2 className="text-base sm:text-xl font-semibold tracking-tight truncate min-w-0">Entrance Exam Prep</h2>
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
          <div className="absolute left-0 top-0 bottom-0 w-[min(280px,calc(100vw-48px))] max-w-[min(280px,92vw)] bg-white shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col min-w-0">
            <div className="p-4 sm:p-gutter h-[4.5rem] sm:h-20 flex items-center justify-between gap-2 border-b border-outline/5 px-4 sm:px-8 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 bg-primary-container rounded-lg flex items-center justify-center shrink-0">
                  <GraduationCap className="text-on-primary" size={20} />
                </div>
                <span className="text-base sm:text-xl font-semibold tracking-tight truncate min-w-0">Entrance Exam Prep</span>
              </div>
              <button type="button" onClick={() => setIsMobileMenuOpen(false)} className="text-on-surface-variant p-2 shrink-0 min-h-11 min-w-11 flex items-center justify-center rounded-lg" aria-label="Close menu">
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
        <header className="min-h-[4rem] sm:h-20 bg-white border-b border-outline/5 px-3 sm:px-4 lg:px-gutter grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-1 sticky top-0 z-40 shrink-0 min-w-0 py-2 sm:py-0">
          <div className="flex items-center gap-2 min-w-0 overflow-hidden">
            <button type="button" onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden text-on-surface-variant p-2 shrink-0 rounded-lg hover:bg-surface min-h-11 min-w-11 flex items-center justify-center" aria-label="Open menu"><Menu size={24} /></button>
            <h2 className="text-base sm:text-xl font-semibold text-on-surface truncate min-w-0">Dashboard</h2>
          </div>

          <div className="flex items-center justify-end gap-2 sm:gap-4 shrink-0 flex-nowrap min-w-0 [&>*]:shrink-0">
             <div className="hidden md:block text-right max-w-[140px] lg:max-w-none min-w-0">
               <p className="text-sm font-semibold truncate">{user?.firstName} {user?.lastName}</p>
               <p className="text-[10px] text-primary-container uppercase font-bold tracking-widest truncate">Grade {user?.gradeLevel} • {user?.stream || 'General'}</p>
             </div>
             <Link to="/profile" className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container border border-primary-container/20 overflow-hidden hover:opacity-80 transition-opacity shrink-0">
               {user?.profileImage ? (
                 <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <CircleUserRound size={24} />
               )}
             </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow px-3 py-4 sm:p-gutter overflow-y-auto overflow-x-hidden bg-white min-w-0">
          <div className="max-w-[1440px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 min-w-0">
            <div className="space-y-5 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold break-words">My Subjects</h3>
                <div className="px-4 py-1.5 bg-primary-container/10 text-primary-container rounded-full text-xs font-bold w-fit shrink-0">
                  {subjects.length} Subjects Assigned
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {[1,2,3].map(i => <div key={i} className="h-48 bg-surface-variant/20 rounded-2xl animate-pulse"></div>)}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {subjects.map(subject => (
                    <div key={subject._id} className="bg-white rounded-2xl border border-outline/10 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all group flex flex-col h-full min-w-0">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 bg-primary-container/10 rounded-lg flex items-center justify-center text-primary-container mb-3 sm:mb-4 shrink-0">
                        <BookOpen size={24} />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold mb-2 break-words">{subject.subjectName}</h3>
                      <p className="text-outline text-sm mb-4 sm:mb-6 flex-grow break-words">Access chapters, topics, and exercises for {subject.subjectName}.</p>
                      <button 
                        type="button"
                        onClick={() => handleSelectSubject(subject._id)} 
                        className="w-full bg-primary-container text-white py-2.5 sm:py-3 rounded-lg font-semibold text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2 min-h-11"
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

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 pt-3 sm:pt-4">
                <div className="bg-white rounded-2xl border border-outline/10 p-4 sm:p-6 min-w-0 overflow-hidden">
                  <div className="flex items-center gap-2 mb-4">
                    <Bell size={18} className="text-primary-container" />
                    <h4 className="font-bold">Unread Notifications</h4>
                  </div>
                  <div className="space-y-3 max-h-72 min-w-0 overflow-y-auto overflow-x-hidden overscroll-x-contain pr-1">
                    {notifications.map((n) => (
                      <div key={n._id} className="p-3 rounded-xl border border-outline/10 bg-surface min-w-0">
                        <p className="font-semibold text-sm break-words">{n.title}</p>
                        <p className="text-xs text-on-surface-variant mt-1 break-words">{n.message}</p>
                        <button
                          type="button"
                          onClick={() => handleMarkRead(n._id)}
                          className="mt-2 text-xs font-semibold text-primary-container hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-container/40 rounded"
                        >
                          Mark as read
                        </button>
                      </div>
                    ))}
                    {notifications.length === 0 && <p className="text-sm text-on-surface-variant">No unread notifications.</p>}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-outline/10 p-4 sm:p-6 min-w-0 overflow-hidden">
                  <div className="flex items-center gap-2 mb-4 min-w-0">
                    <Bookmark size={18} className="text-primary-container shrink-0" />
                    <h4 className="font-bold">My Bookmarks</h4>
                  </div>
                  <div className="space-y-2 max-h-72 min-w-0 overflow-y-auto overflow-x-hidden overscroll-x-contain pr-1">
                    {bookmarks.map((b) => (
                      <div key={b._id} className="p-3 rounded-xl border border-outline/10 bg-surface min-w-0">
                        <button
                          type="button"
                          onClick={() => handleOpenBookmark(b)}
                          className="w-full min-w-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-container/40 rounded-lg"
                          disabled={!b.targetPath}
                        >
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary-container break-words">{b.resourceType.replace('-', ' ')}</p>
                          <p className="text-sm font-semibold text-on-surface mt-1 line-clamp-2 break-words">{b.title || b.resourceId}</p>
                          {b.note && <p className="text-[11px] text-on-surface-variant mt-2 line-clamp-2 break-words">Note: {b.note}</p>}
                        </button>
                        <div className="flex justify-end mt-2">
                          <button type="button" onClick={() => handleRemoveBookmark(b._id)} className="text-xs text-error font-semibold">
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                    {bookmarks.length === 0 && <p className="text-sm text-on-surface-variant">No bookmarks yet.</p>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-white rounded-2xl border border-outline/10 p-4 sm:p-6 min-w-0 overflow-hidden">
                  <div className="flex items-center gap-2 mb-4 min-w-0">
                    <Search size={18} className="text-primary-container shrink-0" />
                    <h4 className="font-bold">Search Topics (FR-12)</h4>
                  </div>
                  <input
                    value={topicSearch}
                    onChange={(e) => setTopicSearch(e.target.value)}
                    placeholder="Search by topic title..."
                    className="w-full min-h-11 border border-outline/20 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-container/20"
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

                <div className="bg-white rounded-2xl border border-outline/10 p-4 sm:p-6 min-w-0 overflow-hidden">
                  <div className="flex items-center gap-2 mb-4 min-w-0">
                    <TriangleAlert size={18} className="text-primary-container shrink-0" />
                    <h4 className="font-bold">Report Issue (FR-14)</h4>
                  </div>
                  <form onSubmit={handleIssueSubmit} className="space-y-3">
                    <input
                      value={issueForm.title}
                      onChange={(e) => setIssueForm((p) => ({ ...p, title: e.target.value }))}
                      placeholder="Issue title"
                      className="w-full min-h-11 border border-outline/20 rounded-xl px-4 py-2 text-sm"
                    />
                    <textarea
                      value={issueForm.issueDescription}
                      onChange={(e) => setIssueForm((p) => ({ ...p, issueDescription: e.target.value }))}
                      placeholder="Describe wrong answer / missing material / bug..."
                      className="w-full border border-outline/20 rounded-xl px-4 py-2 text-sm min-h-[90px] resize-y"
                    />
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <select
                        value={issueForm.issueType}
                        onChange={(e) => setIssueForm((p) => ({ ...p, issueType: e.target.value }))}
                        className="border border-outline/20 rounded-xl px-3 py-2.5 text-sm min-h-11 w-full sm:w-auto sm:min-w-[140px]"
                      >
                        <option value="bug">bug</option>
                        <option value="error">error</option>
                        <option value="feature-request">feature-request</option>
                        <option value="other">other</option>
                      </select>
                      <button type="submit" className="bg-primary-container text-white px-4 py-2.5 rounded-xl text-sm font-semibold min-h-11 w-full sm:w-auto">Submit</button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-white rounded-2xl border border-outline/10 p-4 sm:p-6 min-w-0 overflow-hidden">
                  <div className="flex items-center gap-2 mb-4 min-w-0">
                    <MessageSquarePlus size={18} className="text-primary-container shrink-0" />
                    <h4 className="font-bold">Ask Topic Question (FR-16)</h4>
                  </div>
                  <form onSubmit={handleAskQuestion} className="space-y-3">
                    <input
                      value={questionForm.topicId}
                      onChange={(e) => setQuestionForm((p) => ({ ...p, topicId: e.target.value }))}
                      placeholder="Topic ID"
                      className="w-full min-h-11 border border-outline/20 rounded-xl px-4 py-2 font-mono text-xs sm:text-sm"
                    />
                    <textarea
                      value={questionForm.questionText}
                      onChange={(e) => setQuestionForm((p) => ({ ...p, questionText: e.target.value }))}
                      placeholder="Ask your question..."
                      className="w-full border border-outline/20 rounded-xl px-4 py-2 text-sm min-h-[90px] resize-y"
                    />
                    <button type="submit" className="w-full sm:w-auto bg-primary-container text-white px-4 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2 min-h-11">
                      <Send size={14} /> Send
                    </button>
                  </form>
                </div>

                <div className="bg-white rounded-2xl border border-outline/10 p-4 sm:p-6 min-w-0 overflow-hidden">
                  <h4 className="font-bold mb-4 break-words">My Recent Issues</h4>
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
