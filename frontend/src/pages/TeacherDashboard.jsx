import React, { useState, useEffect, useContext, useCallback } from 'react';
import { 
  BookOpen, PlayCircle, Plus, ChevronRight, 
  CheckCircle, ArrowLeft, ArrowRight, Edit2, Trash2, LogOut, Save, 
  MonitorPlay, GraduationCap, 
  Compass, Book, Tv, FileCheck, Activity, Library, 
  PlusCircle, Menu, X, CircleUserRound, Search, Filter, RefreshCw, User, Settings, Layout, TriangleAlert, MessageCircle, Send, Bell
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { getIssuesForReview, updateIssueStatus, listQuestions, answerQuestion, getUnreadNotifications, markNotificationRead } from '../services/engagement';

const TeacherDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [issues, setIssues] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answerDrafts, setAnswerDrafts] = useState({});
  const [feedback, setFeedback] = useState('');
  const [activeSection, setActiveSection] = useState('courses');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [qaStatusFilter, setQaStatusFilter] = useState('');
  const [qaSearch, setQaSearch] = useState('');

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
    fetchSubjects();
  }, [fetchSubjects]);

  useEffect(() => {
    const fetchTeacherFeeds = async () => {
      try {
        const [issueRes, questionRes, notificationRes] = await Promise.all([
          getIssuesForReview(),
          listQuestions({ limit: 100 }),
          getUnreadNotifications()
        ]);
        setIssues(issueRes?.data || []);
        setQuestions(questionRes?.data || []);
        setNotifications(notificationRes?.data || []);
      } catch (err) {
        console.error('Failed to load teacher dashboard feeds', err);
      }
    };
    fetchTeacherFeeds();
  }, []);

  const SIDEBAR_ITEMS = [
    { key: 'courses', label: 'Course Management', icon: <BookOpen size={20} /> },
    { key: 'qa', label: 'Q&A Management', icon: <MessageCircle size={20} /> },
  ];

  const filteredQuestions = questions.filter((question) => {
    const status = question.status === 'answered' ? 'answered' : 'open';
    const matchesStatus = !qaStatusFilter || status === qaStatusFilter;
    const query = qaSearch.trim().toLowerCase();
    const matchesSearch = !query
      || question.questionText?.toLowerCase().includes(query)
      || question.studentId?.firstName?.toLowerCase().includes(query)
      || question.studentId?.lastName?.toLowerCase().includes(query)
      || question.topicId?.topicName?.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const handleIssueStatus = async (issueId, issueStatus) => {
    try {
      const res = await updateIssueStatus(issueId, { issueStatus, response: 'Thanks, we reviewed this item.' });
      setIssues((prev) => prev.map((it) => (it._id === issueId ? res.data : it)));
      setFeedback('Issue status updated.');
    } catch (err) {
      setFeedback(err?.response?.data?.message || 'Failed to update issue.');
    }
  };

  const handleAnswerQuestion = async (questionId) => {
    const answerText = answerDrafts[questionId];
    if (!answerText) return;
    try {
      await answerQuestion(questionId, { answerText });
      setAnswerDrafts((prev) => ({ ...prev, [questionId]: '' }));
      setQuestions((prev) => prev.map((question) => (
        question._id === questionId ? { ...question, status: 'answered' } : question
      )));
      setFeedback('Answer submitted.');
    } catch (err) {
      setFeedback(err?.response?.data?.message || 'Failed to submit answer.');
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      await markNotificationRead(notification._id);
      setNotifications((prev) => prev.filter((item) => item._id !== notification._id));
    } catch (err) {
      setFeedback('Failed to update notification.');
    }
  };

  return (
    <div className="h-screen bg-background text-on-surface font-sans flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[280px] bg-background border-r border-outline/10 hidden lg:flex flex-col z-50 shrink-0 h-full">
        <div className="h-20 flex items-center gap-3 border-b border-outline/5 px-6">
          <div className="w-9 h-9 bg-primary-container rounded-lg flex items-center justify-center shadow-sm">
            <GraduationCap className="text-on-primary" size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight">Entrance Exam Prep</h2>
            <p className="text-[10px] font-black text-primary-container uppercase tracking-widest">Teacher</p>
          </div>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => item.path ? navigate(item.path) : setActiveSection(item.key)}
              className={`flex items-center gap-3 w-full px-3 py-2.5 transition-all font-semibold rounded-lg ${activeSection === item.key ? 'bg-primary-container/10 text-primary-container' : 'text-on-surface-variant hover:bg-primary-container/5'}`}
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
        <header className="h-20 bg-white/95 backdrop-blur border-b border-outline/10 px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2"><Menu size={24} /></button>
            <h2 className="text-xl font-semibold">{activeSection === 'qa' ? 'Q&A Management' : 'Course Management'}</h2>
          </div>
          <div className="flex items-center gap-4">
             <div className="relative">
               <button
                 type="button"
                 onClick={() => setShowNotifications((value) => !value)}
                 className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container border border-primary-container/20 relative"
                 title="Notifications"
               >
                 <Bell size={20} />
                 {notifications.length > 0 && (
                   <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-primary-container text-white text-[10px] font-bold flex items-center justify-center">
                     {notifications.length > 9 ? '9+' : notifications.length}
                   </span>
                 )}
               </button>
               {showNotifications && (
                 <div className="absolute right-0 top-12 w-80 max-w-[calc(100vw-2rem)] bg-white border border-outline/10 rounded-2xl shadow-2xl p-3 z-50">
                   <div className="flex items-center justify-between px-2 py-2 border-b border-outline/5">
                     <p className="font-bold text-sm">Notifications</p>
                     <span className="text-xs text-on-surface-variant">{notifications.length} unread</span>
                   </div>
                   <div className="max-h-80 overflow-auto mt-2 space-y-2">
                     {notifications.map((notification) => (
                       <button
                         key={notification._id}
                         type="button"
                         onClick={() => handleNotificationClick(notification)}
                         className="w-full text-left p-3 rounded-xl hover:bg-surface transition-colors"
                       >
                         <p className="text-sm font-bold text-on-surface">{notification.title}</p>
                         <p className="text-xs text-on-surface-variant mt-1">{notification.message}</p>
                       </button>
                     ))}
                     {notifications.length === 0 && (
                       <p className="text-sm text-on-surface-variant p-3">No unread notifications.</p>
                     )}
                   </div>
                 </div>
               )}
             </div>
             <div className="text-right hidden sm:block">
               <p className="text-sm font-bold">{user?.firstName} {user?.lastName}</p>
               <p className="text-[10px] text-primary-container uppercase font-black tracking-widest">Teacher</p>
             </div>
             <Link to="/profile" className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container border border-primary-container/20 overflow-hidden hover:opacity-80 transition-opacity" title="Open profile">
                {user?.profileImage ? <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" /> : <CircleUserRound size={24} />}
             </Link>
          </div>
        </header>

        <main className="flex-grow p-8 overflow-y-auto bg-background">
          <div className="max-w-[1440px] mx-auto animate-in fade-in duration-700">
            {activeSection === 'courses' && (
              <>
                <div className="mb-10">
                  <h3 className="text-2xl font-bold mb-2">Assigned Courses</h3>
                  <p className="text-on-surface-variant">Select a course to manage its chapters, topics, and learning materials.</p>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1,2,3].map(i => <div key={i} className="h-64 bg-surface-variant/20 rounded-2xl animate-pulse"></div>)}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {subjects.map(subject => (
                      <div key={subject._id} className="bg-white rounded-2xl border border-outline/10 p-8 shadow-sm hover:shadow-md transition-all group flex flex-col">
                        <div className="w-12 h-12 bg-primary-container/5 rounded-xl flex items-center justify-center text-primary-container mb-6 border border-primary-container/10 group-hover:bg-primary-container group-hover:text-white transition-all">
                          <BookOpen size={24} />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{subject.subjectName}</h3>
                        <p className="text-on-surface-variant text-sm mb-8 flex-grow">Manage the curriculum for Grade {subject.gradeLevel} {subject.stream ? `${subject.stream} Stream` : ''}.</p>
                        <button 
                          onClick={() => navigate(`/teacher/subject/${subject._id}/chapters`)} 
                          className="w-full bg-primary-container text-on-primary py-4 rounded-lg font-semibold text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2"
                        >
                          Manage Curriculum
                          <ArrowRight size={18} />
                        </button>
                      </div>
                    ))}
                    
                    {subjects.length === 0 && (
                      <div className="col-span-full py-32 text-center bg-surface-variant/10 rounded-2xl border border-dashed border-outline/20">
                        <BookOpen size={48} className="text-outline/40 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">No Courses Assigned</h3>
                        <p className="text-on-surface-variant max-w-sm mx-auto">You haven't been assigned as a teacher to any subjects yet. Please contact the administrator.</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {activeSection === 'courses' && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
              <div className="bg-white rounded-2xl border border-outline/10 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TriangleAlert size={18} className="text-primary-container" />
                  <h4 className="font-bold">Student Reported Issues (FR-24)</h4>
                </div>
                <p className="text-xs text-on-surface-variant mb-4">
                  Showing reports only for subjects assigned to you.
                </p>
                <div className="space-y-3 max-h-80 overflow-auto pr-1">
                  {issues.slice(0, 10).map((issue) => (
                    <div key={issue._id} className="p-3 rounded-xl border border-outline/10 bg-surface">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-semibold text-sm">{issue.title}</p>
                        <span className="text-[11px] px-2 py-1 rounded bg-primary-container/10 text-primary-container capitalize shrink-0">{issue.issueStatus}</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant mt-1">
                        {issue.studentId?.firstName || 'Student'} {issue.studentId?.lastName || ''} • {issue.topicId?.chapter?.subject?.subjectName || 'Subject'} • {issue.topicId?.topicName || 'Topic'}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-1">{issue.issueDescription}</p>
                      {issue.response && (
                        <p className="text-xs text-primary-container mt-1">Outcome: {issue.response}</p>
                      )}
                      <div className="mt-3 flex items-center gap-2">
                        <button onClick={() => handleIssueStatus(issue._id, 'in-progress')} className="text-xs font-semibold text-primary-container">Set in-progress</button>
                        <button onClick={() => handleIssueStatus(issue._id, 'resolved')} className="text-xs font-semibold text-primary-container">Resolve</button>
                      </div>
                    </div>
                  ))}
                  {issues.length === 0 && <p className="text-sm text-on-surface-variant">No open issues right now.</p>}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-outline/10 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MessageCircle size={18} className="text-primary-container" />
                  <h4 className="font-bold">Student Questions (FR-16)</h4>
                </div>
                <div className="space-y-3 max-h-80 overflow-auto pr-1">
                  {questions.map((q) => (
                    <div key={q._id} className="p-3 rounded-xl border border-outline/10 bg-surface">
                      <p className="font-semibold text-sm">{q.questionText}</p>
                      <p className="text-xs text-on-surface-variant mt-1">
                        {q.studentId?.firstName} {q.studentId?.lastName} • {q.topicId?.topicName || 'Topic'}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <input
                          value={answerDrafts[q._id] || ''}
                          onChange={(e) => setAnswerDrafts((prev) => ({ ...prev, [q._id]: e.target.value }))}
                          placeholder="Write answer..."
                          className="flex-1 border border-outline/20 rounded-lg px-3 py-2 text-xs"
                        />
                        <button
                          onClick={() => handleAnswerQuestion(q._id)}
                          className="px-3 py-2 rounded-lg bg-primary-container text-white text-xs font-semibold inline-flex items-center gap-1"
                        >
                          <Send size={12} /> Reply
                        </button>
                      </div>
                    </div>
                  ))}
                  {questions.length === 0 && <p className="text-sm text-on-surface-variant">No questions yet.</p>}
                </div>
              </div>
            </div>
            )}
            {activeSection === 'qa' && (
              <div className="bg-white rounded-2xl border border-outline/10 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
                  <div>
                    <h3 className="text-2xl font-bold">Q&A Management</h3>
                    <p className="text-sm text-on-surface-variant mt-1">Review student questions for your assigned subjects and post teacher replies.</p>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      const questionRes = await listQuestions({ limit: 100 });
                      setQuestions(questionRes?.data || []);
                    }}
                    className="px-4 py-2 rounded-lg border border-outline/20 text-sm font-semibold"
                  >
                    Refresh
                  </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-5">
                  <div className="lg:col-span-6 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={16} />
                    <input
                      type="text"
                      value={qaSearch}
                      onChange={(e) => setQaSearch(e.target.value)}
                      placeholder="Search by question, student, or topic..."
                      className="w-full bg-white border border-outline/20 rounded-xl pl-11 pr-4 py-3 text-sm font-semibold outline-none focus:border-primary-container"
                    />
                  </div>
                  <div className="lg:col-span-6 flex flex-wrap items-center gap-2">
                    {[
                      { label: 'All', value: '' },
                      { label: 'Open', value: 'open' },
                      { label: 'Answered', value: 'answered' },
                    ].map((filter) => (
                      <button
                        key={filter.label}
                        type="button"
                        onClick={() => setQaStatusFilter(filter.value)}
                        className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-colors ${qaStatusFilter === filter.value ? 'bg-primary-container text-white border-primary-container' : 'bg-white text-on-surface-variant border-outline/20 hover:bg-surface'}`}
                      >
                        {filter.label}
                      </button>
                    ))}
                    <span className="text-xs text-on-surface-variant font-semibold ml-auto">
                      {filteredQuestions.length} shown
                    </span>
                  </div>
                </div>
                <div className="space-y-4 max-h-[70vh] overflow-auto pr-1">
                  {filteredQuestions.map((q) => (
                    <div key={q._id} className="p-5 rounded-2xl border border-outline/10 bg-surface">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-bold text-on-surface">{q.questionText}</p>
                            <span className={`text-[10px] px-2 py-1 rounded font-black uppercase tracking-widest ${q.status === 'answered' ? 'bg-primary-container/10 text-primary-container' : 'bg-amber-500/10 text-amber-600'}`}>
                              {q.status === 'answered' ? 'Answered' : 'Open'}
                            </span>
                          </div>
                          <p className="text-xs text-on-surface-variant mt-2">
                            {q.studentId?.firstName} {q.studentId?.lastName} • {q.topicId?.topicName || 'Topic'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => q.topicId?._id && navigate(`/teacher/topic/${q.topicId._id}/qa`)}
                          className="text-xs font-bold text-primary-container"
                        >
                          Open Topic Q&A
                        </button>
                      </div>
                      <div className="mt-4 flex flex-col md:flex-row gap-2">
                        <textarea
                          value={answerDrafts[q._id] || ''}
                          onChange={(e) => setAnswerDrafts((prev) => ({ ...prev, [q._id]: e.target.value }))}
                          placeholder="Write teacher answer..."
                          rows={2}
                          className="flex-1 border border-outline/20 rounded-xl px-3 py-2 text-sm resize-none bg-white"
                        />
                        <button
                          onClick={() => handleAnswerQuestion(q._id)}
                          disabled={!answerDrafts[q._id]?.trim()}
                          className="px-4 py-2 rounded-xl bg-primary-container text-white text-xs font-black uppercase tracking-widest inline-flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <Send size={14} /> Reply
                        </button>
                      </div>
                    </div>
                  ))}
                  {filteredQuestions.length === 0 && <p className="text-sm text-on-surface-variant py-10 text-center">No questions match the current filters.</p>}
                </div>
              </div>
            )}
            {feedback && <p className="text-sm text-primary-container font-semibold mt-4">{feedback}</p>}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;
