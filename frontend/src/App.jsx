import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { CircleUserRound, GraduationCap, LogOut, ShieldCheck, BookOpen, ArrowRight, Menu, X, Bell, Bookmark, Search, TriangleAlert, Flame } from 'lucide-react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import api from './services/api';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import ChapterManagement from './pages/ChapterManagement';
import TopicManagement from './pages/TopicManagement';
import TopicDetailsLayout from './pages/TopicDetailsLayout';
import TopicObjectives from './pages/TopicObjectives';
import TopicConcept from './pages/TopicConcept';
import TopicVideo from './pages/TopicVideo';
import TopicExercise from './pages/TopicExercise';
import TopicQuiz from './pages/TopicQuiz';
import TopicExam from './pages/TopicExam';
import TopicReports from './pages/TopicReports';
import TopicQA from './pages/TopicQA';
import ProtectedRoute from './components/ProtectedRoute';
import StudentChatBot from './components/StudentChatBot';
import { getChaptersBySubject, getTopicsByChapter } from './services/chapter';
import {
  getUnreadNotifications,
  markNotificationRead,
  getBookmarks,
  removeBookmark,
  searchTopics,
  getMyIssues,
  getGradeProgress,
  getLearningStreak,
  getStudentResultsSummary,
  getSubjectChapterProgress,
  getSubjectProgress
} from './services/engagement';

// Student Layout Component with Persistent Sidebar
const StudentLayout = ({ children, selectedGrade, setSelectedGrade }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showGradeMenu, setShowGradeMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [navSubjects, setNavSubjects] = useState([]);
  const [navChapters, setNavChapters] = useState([]);
  const [navTopics, setNavTopics] = useState([]);
  const [navSubjectProgress, setNavSubjectProgress] = useState(null);
  const [progressRefreshToken, setProgressRefreshToken] = useState(0);
  const [activeSubjectId, setActiveSubjectId] = useState(null);
  const [activeChapterId, setActiveChapterId] = useState(null);
  const [topicSearchQuery, setTopicSearchQuery] = useState('');
  const [topicSearchResults, setTopicSearchResults] = useState([]);
  const [myReports, setMyReports] = useState([]);

  const userRole = user?.role?.toLowerCase();
  const GRADE_ITEMS = [
    { key: '9', label: 'Grade 9' },
    { key: '10', label: 'Grade 10' },
    { key: '11', label: 'Grade 11' },
    { key: '12', label: 'Grade 12' },
  ];

  const ACTION_ITEMS = [];
  if (userRole === 'admin') ACTION_ITEMS.push({ key: 'admin', label: 'Admin Console', icon: <ShieldCheck size={20} />, path: '/admin' });
  if (userRole === 'teacher' || userRole === 'admin') ACTION_ITEMS.push({ key: 'teacher', label: 'Course Management', icon: <GraduationCap size={20} />, path: '/teacher' });
  const activeTopicId = location.pathname.match(/\/curriculum\/topic\/([^/]+)/)?.[1] || null;

  const handleGradeClick = (grade) => {
    if (setSelectedGrade) {
      setSelectedGrade(grade);
      setShowGradeMenu(false);
      navigate('/dashboard');
    }
  };

  useEffect(() => {
    const fetchGradeSubjects = async () => {
      try {
        const [response, progressResponse] = await Promise.all([
          api.get('/subjects'),
          getSubjectProgress(),
        ]);
        const subjectsList = Array.isArray(response.data) ? response.data : (response.data.data || []);
        const progressList = progressResponse?.data || [];
        const progressMap = progressList.reduce((acc, item) => {
          const subjectId = item.subjectId?._id || item.subjectId;
          if (subjectId) acc[String(subjectId)] = item;
          return acc;
        }, {});
        setNavSubjects(subjectsList.filter((subject) =>
          String(subject.gradeLevel) === String(selectedGrade) &&
          (!subject.stream || subject.stream === user?.stream)
        ).map((subject) => ({
          ...subject,
          progress: progressMap[String(subject._id)] || null,
        })));
      } catch (_err) {
        setNavSubjects([]);
      }
    };

    if (user?.role === 'student') {
      fetchGradeSubjects();
    }
  }, [selectedGrade, user]);

  useEffect(() => {
    let isMounted = true;

    const resolveActivePath = async () => {
      const subjectMatch = location.pathname.match(/\/curriculum\/subject\/([^/]+)\/chapters/);
      const chapterMatch = location.pathname.match(/\/curriculum\/chapter\/([^/]+)\/topics/);
      const topicMatch = location.pathname.match(/\/curriculum\/topic\/([^/]+)/);

      let nextSubjectId = subjectMatch?.[1] || null;
      let nextChapterId = chapterMatch?.[1] || null;

      try {
        if (topicMatch?.[1]) {
          const topicRes = await api.get(`/content/topics/${topicMatch[1]}`);
          const topicData = topicRes.data?.data || topicRes.data;
          nextChapterId = topicData?.chapter?._id || topicData?.chapter || null;
        }

        if (nextChapterId && !nextSubjectId) {
          const chapterRes = await api.get(`/content/chapters/${nextChapterId}`);
          const chapterData = chapterRes.data?.data || chapterRes.data;
          nextSubjectId = chapterData?.subject?._id || chapterData?.subject || null;
        }
      } catch (_err) {
        // Route context is best-effort; keep navigation usable if one lookup fails.
      }

      if (isMounted) {
        setActiveSubjectId(nextSubjectId);
        setActiveChapterId(nextChapterId);
      }
    };

    resolveActivePath();
    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  useEffect(() => {
    const handleProgressRefresh = () => setProgressRefreshToken((value) => value + 1);
    window.addEventListener('student-progress-refresh', handleProgressRefresh);
    return () => window.removeEventListener('student-progress-refresh', handleProgressRefresh);
  }, []);

  useEffect(() => {
    const fetchChapters = async () => {
      if (!activeSubjectId) {
        setNavChapters([]);
        return;
      }

      try {
        const response = await getSubjectChapterProgress(activeSubjectId);
        const data = response?.data || {};
        setNavSubjectProgress(data.subjectProgress || null);
        setNavChapters((data.chapters || []).map((chapter) => ({
          _id: chapter.chapterId,
          chapterName: chapter.chapterName,
          completionPercentage: chapter.completionPercentage,
          completedTopics: chapter.completedTopics,
          totalTopics: chapter.totalTopics,
          status: chapter.status,
          topics: chapter.topics || [],
        })));
      } catch (_err) {
        setNavSubjectProgress(null);
        try {
          setNavChapters(await getChaptersBySubject(activeSubjectId));
        } catch {
          setNavChapters([]);
        }
      }
    };

    fetchChapters();
  }, [activeSubjectId, progressRefreshToken]);

  useEffect(() => {
    const fetchTopics = async () => {
      if (!activeChapterId) {
        setNavTopics([]);
        return;
      }

      try {
        const chapterProgress = navChapters.find((chapter) => String(chapter._id) === String(activeChapterId));
        if (chapterProgress?.topics?.length) {
          setNavTopics(chapterProgress.topics.map((topic) => ({
            _id: topic.topicId,
            topicName: topic.topicName,
            completed: topic.completed,
          })));
          return;
        }

        setNavTopics(await getTopicsByChapter(activeChapterId));
      } catch (_err) {
        setNavTopics([]);
      }
    };

    fetchTopics();
  }, [activeChapterId, navChapters]);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const [notificationResponse, reportResponse, bookmarkResponse] = await Promise.all([
          getUnreadNotifications(),
          getMyIssues(),
          getBookmarks(),
        ]);
        setNotifications(notificationResponse?.data || []);
        setMyReports((reportResponse?.data || []).slice(0, 6));
        setBookmarks(bookmarkResponse?.data || []);
      } catch (_err) {
        setNotifications([]);
        setMyReports([]);
        setBookmarks([]);
      }
    };
    if (user?.role === 'student') {
      fetchUnread();
    }

    window.addEventListener('student-notifications-refresh', fetchUnread);
    return () => window.removeEventListener('student-notifications-refresh', fetchUnread);
  }, [user]);

  useEffect(() => {
    const run = async () => {
      const q = topicSearchQuery?.trim();
      if (!q || q.length < 2) {
        setTopicSearchResults([]);
        return;
      }
      try {
        const res = await searchTopics(q);
        const list = Array.isArray(res) ? res : (res?.data || []);
        setTopicSearchResults(list.slice(0, 8));
      } catch (_err) {
        setTopicSearchResults([]);
      }
    };
    const t = setTimeout(run, 280);
    return () => clearTimeout(t);
  }, [topicSearchQuery]);

  const handleMarkReadFromNav = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (_err) {
      // Keep nav interaction non-blocking
    }
  };

  const handleRemoveBookmarkFromNav = async (id) => {
    try {
      await removeBookmark(id);
      setBookmarks((prev) => prev.filter((bookmark) => bookmark._id !== id));
    } catch (_err) {
      // Keep nav interaction non-blocking
    }
  };

  const handleOpenBookmark = (bookmark) => {
    if (!bookmark?.targetPath) return;
    setShowBookmarks(false);
    navigate(bookmark.targetPath);
  };

  const renderCurriculumNav = (closeAfterNavigate = false) => (
    <div className="space-y-5 px-3 pt-3 border-t border-outline/5">
      <div className="rounded-xl bg-white border border-outline-variant p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black text-primary-container uppercase tracking-widest">Learning Map</p>
          <span className="text-[10px] font-black text-primary-container bg-primary-container/10 px-2 py-1 rounded-md">G{selectedGrade}</span>
        </div>
        {navSubjectProgress && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              <span>Subject</span>
              <span>{navSubjectProgress.completionPercentage || 0}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-surface border border-outline/10 overflow-hidden mt-2">
              <div className="h-full bg-primary-container" style={{ width: `${navSubjectProgress.completionPercentage || 0}%` }} />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black text-outline uppercase tracking-widest">1. Subjects</p>
          <span className="text-[10px] text-on-surface-variant">{navSubjects.length}</span>
        </div>
        <div className="space-y-1.5 max-h-48 overflow-auto pr-1">
          {navSubjects.map((subject) => (
            <button
              key={subject._id}
              type="button"
              onClick={() => {
                navigate(`/curriculum/subject/${subject._id}/chapters`);
                if (closeAfterNavigate) setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold transition-colors ${
                activeSubjectId === subject._id
                  ? 'bg-primary-container text-on-primary shadow-sm'
                  : 'bg-white text-on-surface hover:bg-primary-container/5'
              }`}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="line-clamp-1">{subject.subjectName}</span>
                <span className={activeSubjectId === subject._id ? 'text-on-primary/80' : 'text-primary-container'}>
                  {subject.progress?.completionPercentage || 0}%
                </span>
              </span>
            </button>
          ))}
          {navSubjects.length === 0 && (
            <p className="text-[11px] text-on-surface-variant">No subjects for this grade.</p>
          )}
        </div>
      </div>

      {activeSubjectId && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black text-outline uppercase tracking-widest">2. Chapters</p>
            <span className="text-[10px] text-on-surface-variant">{navChapters.length}</span>
          </div>
          <div className="space-y-1.5 max-h-52 overflow-auto pr-1">
            {navChapters.map((chapter) => (
              <button
                key={chapter._id}
                type="button"
                onClick={() => {
                  navigate(`/curriculum/chapter/${chapter._id}/topics`);
                  if (closeAfterNavigate) setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeChapterId === chapter._id
                    ? 'bg-primary-container/10 text-primary-container'
                    : 'bg-white text-on-surface hover:bg-primary-container/5'
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="line-clamp-1">{chapter.chapterName}</span>
                  <span className="text-[10px] font-black">
                    {chapter.completedTopics || 0}/{chapter.totalTopics || 0}
                  </span>
                </span>
                <div className="h-1 rounded-full bg-white/70 border border-outline/10 overflow-hidden mt-2">
                  <div className="h-full bg-primary-container" style={{ width: `${chapter.completionPercentage || 0}%` }} />
                </div>
              </button>
            ))}
            {navChapters.length === 0 && (
              <p className="text-[11px] text-on-surface-variant">Select a subject to load chapters.</p>
            )}
          </div>
        </div>
      )}

      {activeChapterId && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black text-outline uppercase tracking-widest">3. Topics</p>
            <span className="text-[10px] text-on-surface-variant">{navTopics.length}</span>
          </div>
          <div className="space-y-1.5 max-h-72 overflow-auto pr-1">
            {navTopics.map((topicItem) => (
              <button
                key={topicItem._id}
                type="button"
                onClick={() => {
                  navigate(`/curriculum/topic/${topicItem._id}/objectives`);
                  if (closeAfterNavigate) setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors flex items-start justify-between gap-2 ${
                  activeTopicId === topicItem._id
                    ? 'bg-primary-container/10 text-primary-container'
                    : 'bg-white text-on-surface hover:bg-primary-container/5'
                }`}
              >
                <span className="line-clamp-2">{topicItem.topicName}</span>
                <span className={`shrink-0 mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-black ${
                  topicItem.completed
                    ? 'bg-primary-container text-on-primary border-primary-container'
                    : 'bg-white text-on-surface-variant border-outline/20'
                }`}>
                  {topicItem.completed ? '✓' : <ArrowRight size={12} />}
                </span>
              </button>
            ))}
            {navTopics.length === 0 && (
              <p className="text-[11px] text-on-surface-variant">Select a chapter to load topics.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderMobileCurriculumNav = () => (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white border border-outline-variant p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black text-primary-container uppercase tracking-widest">Learning Map</p>
            <p className="text-xs text-on-surface-variant mt-1">Grade {selectedGrade}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              navigate('/dashboard');
              setIsMobileMenuOpen(false);
            }}
            className="px-3 py-2 rounded-lg bg-primary-container/10 text-primary-container text-xs font-black"
          >
            Home
          </button>
        </div>
      </div>

      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <p className="text-[10px] font-black text-outline uppercase tracking-widest">Subjects</p>
          <span className="text-[10px] text-on-surface-variant">{navSubjects.length}</span>
        </div>
        <div className="grid grid-cols-1 gap-2 max-h-44 overflow-auto pr-1">
          {navSubjects.map((subject) => (
            <button
              key={subject._id}
              type="button"
              onClick={() => {
                navigate(`/curriculum/subject/${subject._id}/chapters`);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full min-h-[48px] text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                activeSubjectId === subject._id
                  ? 'bg-primary-container text-on-primary shadow-sm'
                  : 'bg-white text-on-surface hover:bg-primary-container/5'
              }`}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="line-clamp-1">{subject.subjectName}</span>
                <span className={activeSubjectId === subject._id ? 'text-on-primary/80' : 'text-primary-container'}>
                  {subject.progress?.completionPercentage || 0}%
                </span>
              </span>
            </button>
          ))}
          {navSubjects.length === 0 && (
            <p className="text-xs text-on-surface-variant px-1">No subjects for this grade.</p>
          )}
        </div>
      </section>

      {activeSubjectId && (
        <section className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <p className="text-[10px] font-black text-outline uppercase tracking-widest">Chapters</p>
            <span className="text-[10px] text-on-surface-variant">{navChapters.length}</span>
          </div>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-auto pr-1">
            {navChapters.map((chapter) => (
              <button
                key={chapter._id}
                type="button"
                onClick={() => {
                  navigate(`/curriculum/chapter/${chapter._id}/topics`);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full min-h-[52px] text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  activeChapterId === chapter._id
                    ? 'bg-primary-container/10 text-primary-container'
                    : 'bg-white text-on-surface hover:bg-primary-container/5'
                }`}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="line-clamp-1">{chapter.chapterName}</span>
                  <span className="text-[11px] font-black shrink-0">
                    {chapter.completedTopics || 0}/{chapter.totalTopics || 0}
                  </span>
                </span>
                <div className="h-1 rounded-full bg-surface border border-outline/10 overflow-hidden mt-2">
                  <div className="h-full bg-primary-container" style={{ width: `${chapter.completionPercentage || 0}%` }} />
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {activeChapterId && (
        <section className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <p className="text-[10px] font-black text-outline uppercase tracking-widest">Topics</p>
            <span className="text-[10px] text-on-surface-variant">{navTopics.length}</span>
          </div>
          <div className="grid grid-cols-1 gap-2 max-h-56 overflow-auto pr-1">
            {navTopics.map((topicItem) => (
              <button
                key={topicItem._id}
                type="button"
                onClick={() => {
                  navigate(`/curriculum/topic/${topicItem._id}/objectives`);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full min-h-[52px] text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between gap-3 ${
                  activeTopicId === topicItem._id
                    ? 'bg-primary-container/10 text-primary-container'
                    : 'bg-white text-on-surface hover:bg-primary-container/5'
                }`}
              >
                <span className="line-clamp-2">{topicItem.topicName}</span>
                <span className={`shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-black ${
                  topicItem.completed
                    ? 'bg-primary-container text-on-primary border-primary-container'
                    : 'bg-white text-on-surface-variant border-outline/20'
                }`}>
                  {topicItem.completed ? '✓' : <ArrowRight size={13} />}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  return (
    <div className="h-screen bg-background text-on-surface font-sans flex overflow-hidden">
      {/* Sidebar (Desktop) */}
      <aside className="w-[300px] bg-background border-r border-outline/10 hidden lg:flex flex-col z-50 shadow-[4px_0_12px_rgba(0,0,0,0.02)] shrink-0 h-full sticky top-0">
        <div className="h-20 flex items-center gap-3 border-b border-outline/5 px-6">
          <div className="w-9 h-9 bg-primary-container rounded-lg flex items-center justify-center shadow-sm">
            <GraduationCap className="text-on-primary" size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight">Entrance Exam Prep</h2>
          </div>
        </div>
        <nav className="flex-grow p-4 space-y-5 overflow-y-auto">
          <div className="space-y-2 px-3 pt-2 pb-1">
            <label htmlFor="sidebar-topic-search" className="text-[10px] font-black text-outline uppercase tracking-widest">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" size={16} aria-hidden />
              <input
                id="sidebar-topic-search"
                value={topicSearchQuery}
                onChange={(e) => setTopicSearchQuery(e.target.value)}
                placeholder="Search by topic title..."
                autoComplete="off"
                className="w-full bg-surface border border-outline/10 pl-9 pr-3 py-2.5 rounded-lg text-sm font-semibold text-on-surface placeholder:text-on-surface-variant/60 focus:ring-2 focus:ring-primary-container/20 outline-none"
              />
            </div>
            <div className="max-h-44 overflow-auto space-y-1 pr-1 pt-1">
              {topicSearchResults.map((t) => (
                <button
                  key={t._id}
                  type="button"
                  onClick={() => { navigate(`/curriculum/topic/${t._id}/objectives`); }}
                  className="w-full text-left px-3 py-2 rounded-lg bg-white hover:bg-primary-container/5 transition-colors flex items-start justify-between gap-2"
                >
                  <span className="text-xs font-semibold text-on-surface line-clamp-2">{t.topicName}</span>
                  <ArrowRight size={14} className="shrink-0 text-primary-container mt-0.5" aria-hidden />
                </button>
              ))}
              {topicSearchQuery.trim().length >= 2 && topicSearchResults.length === 0 && (
                <p className="text-[11px] text-on-surface-variant px-1">No matching topics.</p>
              )}
            </div>
          </div>

          {userRole === 'student' && renderCurriculumNav()}

          {ACTION_ITEMS.length > 0 && (
            <>
              <div className="border-t border-outline/5 my-3 mx-3"></div>
              <div className="px-3 py-1 text-[10px] font-black text-outline uppercase tracking-widest">Manage</div>
              {ACTION_ITEMS.map((item) => (
                <button
                  key={item.key}
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 bg-white text-on-surface-variant hover:bg-primary-container/5 transition-all font-semibold rounded-lg"
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </>
          )}

          {userRole === 'student' && (
            <div className="space-y-2 px-3 pt-4 border-t border-outline/5">
              <div className="flex items-center gap-2 text-[10px] font-black text-outline uppercase tracking-widest">
                <TriangleAlert size={14} />
                My Reports
              </div>
              <div className="space-y-2 max-h-44 overflow-auto pr-1">
                {myReports.map((issue) => (
                  <button
                    key={issue._id}
                    type="button"
                    onClick={() => issue.topicId?._id && navigate(`/curriculum/topic/${issue.topicId._id}/reports`)}
                    className="w-full text-left p-3 rounded-lg bg-white hover:bg-primary-container/5"
                  >
                    <p className="text-xs font-semibold line-clamp-1">{issue.topicId?.topicName || issue.title}</p>
                    <p className="text-[11px] text-primary-container capitalize mt-1">{issue.issueStatus}</p>
                  </button>
                ))}
                {myReports.length === 0 && <p className="text-[11px] text-on-surface-variant">None</p>}
              </div>
            </div>
          )}
        </nav>
        <div className="p-4 border-t border-outline/5">
          <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 text-error hover:bg-error/5 transition-all font-semibold rounded-lg">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute left-0 top-0 bottom-0 w-[min(92vw,380px)] bg-background shadow-2xl flex flex-col">
            <div className="h-16 flex items-center justify-between border-b border-outline/5 px-4 shrink-0">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-primary-container rounded-lg flex items-center justify-center">
                   <GraduationCap className="text-on-primary" size={20} />
                 </div>
                 <span className="text-sm font-bold">Entrance Exam Prep</span>
               </div>
               <button onClick={() => setIsMobileMenuOpen(false)} className="text-on-surface-variant p-2 rounded-lg hover:bg-surface"><X size={22} /></button>
            </div>
            <nav className="flex-grow p-3 space-y-4 overflow-y-auto overscroll-contain pb-6">
              <div className="space-y-2">
                <label htmlFor="mobile-topic-search" className="text-[10px] font-black text-outline uppercase tracking-widest">Find topic</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" size={16} aria-hidden />
                  <input
                    id="mobile-topic-search"
                    value={topicSearchQuery}
                    onChange={(e) => setTopicSearchQuery(e.target.value)}
                    placeholder="Search by topic title..."
                    autoComplete="off"
                    className="w-full bg-surface border border-outline/10 pl-9 pr-3 py-3 rounded-xl text-sm font-semibold"
                  />
                </div>
                <div className="max-h-44 overflow-auto space-y-1.5">
                  {topicSearchResults.map((t) => (
                    <button
                      key={t._id}
                      type="button"
                      onClick={() => {
                        navigate(`/curriculum/topic/${t._id}/objectives`);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-3 rounded-xl border border-outline/10 bg-white text-sm font-semibold"
                    >
                      {t.topicName}
                    </button>
                  ))}
                </div>
              </div>
              {userRole === 'student' && renderMobileCurriculumNav()}
              {ACTION_ITEMS.map((item) => (
                <button key={item.key} onClick={() => { navigate(item.path); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 w-full px-4 py-3 font-semibold rounded-xl bg-white border border-outline/10">{item.icon} {item.label}</button>
              ))}
            </nav>
            <div className="p-3 border-t border-outline/5 shrink-0 bg-background">
              <button onClick={logout} className="flex items-center justify-center gap-3 w-full px-4 py-3 text-error font-semibold rounded-xl bg-error/5"><LogOut size={20} /> Logout</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-grow flex flex-col min-w-0">
        <header className="h-20 bg-white/95 backdrop-blur border-b border-outline/10 px-4 lg:px-gutter flex items-center justify-between sticky top-0 z-40 shrink-0">
           <div className="flex items-center gap-3">
             <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden text-on-surface-variant p-2"><Menu size={24} /></button>
             {userRole === 'student' && (
               <div className="relative">
                 <button
                   type="button"
                   onClick={() => setShowGradeMenu((value) => !value)}
                   className="min-w-[160px] bg-surface border border-outline/10 rounded-2xl px-4 py-2.5 shadow-sm hover:border-primary-container/30 hover:bg-white transition-all flex items-center justify-between gap-3"
                   title="Choose grade"
                 >
                   <span className="text-left">
                     <span className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Current Grade</span>
                     <span className="block text-sm font-black text-on-surface leading-tight">Grade {selectedGrade}</span>
                   </span>
                   <span className="w-7 h-7 rounded-lg bg-primary-container/10 text-primary-container flex items-center justify-center text-xs font-black">▾</span>
                 </button>
                 {showGradeMenu && (
                   <div className="absolute left-0 top-14 w-56 bg-white border border-outline-variant rounded-2xl shadow-[0px_12px_32px_rgba(0,0,0,0.12)] p-2 z-50">
                     <div className="px-3 py-2 border-b border-outline/10 mb-1">
                       <p className="text-[10px] font-black uppercase tracking-widest text-primary-container">Select Grade Level</p>
                       <p className="text-xs text-on-surface-variant mt-1">Switch your dashboard and learning map.</p>
                     </div>
                     {GRADE_ITEMS.map((item) => {
                       const isSelected = item.key === selectedGrade;
                       return (
                         <button
                           key={item.key}
                           type="button"
                           onClick={() => handleGradeClick(item.key)}
                           className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between gap-3 ${
                             isSelected
                               ? 'bg-primary-container text-on-primary shadow-sm'
                               : 'text-on-surface hover:bg-primary-container/5'
                           }`}
                         >
                           <span>
                             <span className="block text-sm font-black">{item.label}</span>
                             {isSelected && (
                               <span className="text-[10px] font-bold uppercase tracking-widest text-on-primary/80">
                                 Active grade
                               </span>
                             )}
                           </span>
                           <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-black ${isSelected ? 'border-on-primary/50 bg-white/20' : 'border-outline/20'}`}>
                             {isSelected ? '✓' : ''}
                           </span>
                         </button>
                       );
                     })}
                   </div>
                 )}
               </div>
             )}
           </div>
           <div className="flex items-center gap-4">
             {userRole === 'student' && (
               <div className="relative">
                 <button
                   onClick={() => setShowBookmarks((v) => !v)}
                   className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container border border-primary-container/20 relative"
                   title="My bookmarks"
                 >
                   <Bookmark size={18} />
                   {bookmarks.length > 0 && (
                     <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-primary-container text-white text-[10px] font-bold flex items-center justify-center">
                       {bookmarks.length > 9 ? '9+' : bookmarks.length}
                     </span>
                   )}
                 </button>
                 {showBookmarks && (
                   <div className="absolute right-0 mt-2 w-[320px] max-h-[360px] overflow-auto rounded-xl border border-outline/10 bg-white shadow-xl z-50">
                     <div className="px-4 py-3 border-b border-outline/10 flex items-center justify-between">
                       <p className="text-sm font-semibold">My Bookmarks</p>
                       <span className="text-xs text-on-surface-variant">{bookmarks.length} saved</span>
                     </div>
                     <div className="p-2 space-y-2">
                      {bookmarks.map((bookmark) => (
                        <div key={bookmark._id} className="p-3 rounded-lg border border-outline/10 bg-surface">
                          <button
                            type="button"
                            onClick={() => handleOpenBookmark(bookmark)}
                            disabled={!bookmark.targetPath}
                            className="w-full text-left disabled:cursor-not-allowed"
                          >
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary-container">
                              {bookmark.resourceType.replace('-', ' ')}
                            </p>
                            <p className="text-sm font-semibold text-on-surface line-clamp-2 mt-1">
                              {bookmark.title || bookmark.resourceId}
                            </p>
                            {bookmark.note && (
                              <p className="text-[11px] text-on-surface-variant mt-2 line-clamp-2">
                                Note: {bookmark.note}
                              </p>
                            )}
                          </button>
                          <div className="flex justify-end mt-2">
                            <button
                              onClick={() => handleRemoveBookmarkFromNav(bookmark._id)}
                              className="text-xs text-error font-semibold shrink-0"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                       {bookmarks.length === 0 && (
                         <p className="text-sm text-on-surface-variant p-3">No bookmarks yet.</p>
                       )}
                     </div>
                   </div>
                 )}
               </div>
             )}
             <div className="relative">
               <button
                 onClick={() => setShowNotifications((v) => !v)}
                 className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container border border-primary-container/20 relative"
                 title="Notifications"
               >
                 <Bell size={18} />
                 {notifications.length > 0 && (
                   <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-error text-white text-[10px] font-bold flex items-center justify-center">
                     {notifications.length > 9 ? '9+' : notifications.length}
                   </span>
                 )}
               </button>
               {showNotifications && (
                 <div className="absolute right-0 mt-2 w-[320px] max-h-[360px] overflow-auto rounded-xl border border-outline/10 bg-white shadow-xl z-50">
                   <div className="px-4 py-3 border-b border-outline/10 flex items-center justify-between">
                     <p className="text-sm font-semibold">Notifications</p>
                     <span className="text-xs text-on-surface-variant">{notifications.length} unread</span>
                   </div>
                   <div className="p-2 space-y-2">
                     {notifications.map((n) => (
                       <div key={n._id} className="p-3 rounded-lg border border-outline/10 bg-surface">
                         <p className="text-sm font-semibold">{n.title}</p>
                         <p className="text-xs text-on-surface-variant mt-1">{n.message}</p>
                         <button
                           onClick={() => handleMarkReadFromNav(n._id)}
                           className="text-xs text-primary-container font-semibold mt-2"
                         >
                           Mark as read
                         </button>
                       </div>
                     ))}
                     {notifications.length === 0 && (
                       <p className="text-sm text-on-surface-variant p-3">No unread notifications.</p>
                     )}
                   </div>
                 </div>
               )}
             </div>
             <div className="text-right hidden md:block">
               <p className="text-sm font-semibold">{user?.firstName} {user?.lastName}</p>
               <p className="text-[10px] text-primary-container uppercase font-bold tracking-widest">{user?.stream || 'Student'}</p>
             </div>
             <Link to="/profile" className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container border border-primary-container/20 overflow-hidden hover:opacity-80 transition-opacity">
               {user?.profileImage ? <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" /> : <CircleUserRound size={24} />}
             </Link>
           </div>
        </header>
        <main className="flex-grow p-gutter overflow-y-auto bg-background">
          <div className="max-w-[1440px] mx-auto">
            {children}
          </div>
        </main>
        {userRole === 'student' && <StudentChatBot />}
      </div>
    </div>
  );
};

const Dashboard = ({ selectedGrade }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [progressBySubject, setProgressBySubject] = useState({});
  const [gradeProgress, setGradeProgress] = useState(null);
  const [resultsSummary, setResultsSummary] = useState(null);
  const [learningStreak, setLearningStreak] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setIsLoading(true);
        const [response, progressResponse, gradeProgressResponse, resultsResponse, streakResponse] = await Promise.all([
          api.get('/subjects'),
          getSubjectProgress(),
          getGradeProgress(selectedGrade),
          getStudentResultsSummary(selectedGrade),
          getLearningStreak(),
        ]);
        const subjectsList = Array.isArray(response.data) ? response.data : (response.data.data || []);
        const progressList = progressResponse?.data || [];
        const progressMap = progressList.reduce((acc, item) => {
          const subjectId = item.subjectId?._id || item.subjectId;
          if (subjectId) acc[String(subjectId)] = item;
          return acc;
        }, {});
        const filtered = subjectsList.filter(s => 
          String(s.gradeLevel) === String(selectedGrade) &&
          (!s.stream || s.stream === user?.stream)
        );
        setSubjects(filtered);
        setProgressBySubject(progressMap);
        setGradeProgress(gradeProgressResponse?.data || null);
        setResultsSummary(resultsResponse?.data || null);
        setLearningStreak(streakResponse?.data || null);
      } catch (err) {
        console.error('Failed to fetch subjects:', err);
        setGradeProgress(null);
        setResultsSummary(null);
        setLearningStreak(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchSubjects();
    }
  }, [user, selectedGrade]);

  const overallProgress = gradeProgress?.completionPercentage || 0;
  const subjectProgressCards = subjects.map((subject) => ({
    subject,
    progress: progressBySubject[String(subject._id)] || {},
  }));
  const resultCards = [
    { label: 'Exercises', value: resultsSummary?.byType?.Exercises },
    { label: 'Quizzes', value: resultsSummary?.byType?.Quizzes },
    { label: 'Exams', value: resultsSummary?.byType?.Exams },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-5 sm:space-y-8">
      <section className="bg-white rounded-xl border border-outline-variant p-4 sm:p-8 shadow-[0px_8px_24px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-container">Student Learning Hub</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface mt-2">
              Welcome back, {user?.firstName || 'Student'}
            </h2>
            <p className="text-sm text-on-surface-variant mt-3 max-w-2xl">
              Pick a subject, choose a chapter, then follow each topic step by step from objectives to practice and exam review.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg bg-gradient-to-br from-orange-500 via-amber-500 to-red-500 text-white px-5 py-4 text-center shadow-[0px_10px_24px_rgba(249,115,22,0.25)] border border-orange-200/40 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-white/15" />
              <div className="relative flex items-center justify-center gap-2">
                <Flame size={22} />
                <p className="text-2xl font-black">{learningStreak?.currentStreak || 0}</p>
              </div>
              <p className="relative text-[10px] font-bold uppercase tracking-widest text-white/85">Overall Streak</p>
            </div>
            <div className="rounded-lg bg-primary-container/10 border border-primary-container/10 px-5 py-4 text-center">
              <p className="text-2xl font-black text-primary-container">{subjects.length}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary-container">Subjects</p>
            </div>
            <div className="rounded-lg bg-surface border border-outline/10 px-5 py-4 text-center">
              <p className="text-2xl font-black text-on-surface">{overallProgress}%</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Overall Progress</p>
            </div>
          </div>
        </div>
        <div className="mt-6 rounded-lg bg-surface border border-outline/10 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3 mb-2">
            <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Grade {selectedGrade} Completion</span>
            <span className="text-sm font-black text-primary-container">
              {gradeProgress?.completedTopics || 0}/{gradeProgress?.totalTopics || 0} topics
            </span>
          </div>
          <div className="h-2 rounded-full bg-white border border-outline/10 overflow-hidden">
            <div className="h-full bg-primary-container transition-all" style={{ width: `${overallProgress}%` }} />
          </div>
          <div className="grid grid-cols-4 gap-2 mt-3">
            {[25, 50, 75, 100].map((milestone) => (
              <div key={milestone} className="text-center">
                <div className={`mx-auto w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-black ${
                  overallProgress >= milestone
                    ? 'bg-primary-container text-on-primary border-primary-container'
                    : 'bg-white text-on-surface-variant border-outline/20'
                }`}>
                  {milestone}
                </div>
                <p className="text-[10px] font-bold text-on-surface-variant mt-1">{milestone}%</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-outline-variant p-4 sm:p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-container">Progress & Results</p>
            <h3 className="text-xl sm:text-2xl font-semibold text-on-surface mt-1">Grade {selectedGrade} Learning Performance</h3>
            <p className="text-sm text-on-surface-variant mt-1">
              Track this grade's overall progress, subject progress, and answer accuracy. Changing grade updates this section.
            </p>
          </div>
          <div className="rounded-lg bg-primary-container/10 border border-primary-container/10 px-5 py-4 text-center min-w-[150px]">
            <p className="text-2xl font-black text-primary-container">{overallProgress}%</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary-container">Grade Progress</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-4 mb-5">
          <div className="rounded-xl bg-surface border border-outline/10 p-5">
            <div className="flex items-center justify-between gap-3 mb-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Overall Grade Level Progress</p>
              <span className="text-sm font-black text-primary-container">{overallProgress}%</span>
            </div>
            <div className="h-2 rounded-full bg-white border border-outline/10 overflow-hidden">
              <div className="h-full bg-primary-container transition-all" style={{ width: `${overallProgress}%` }} />
            </div>
            <p className="text-xs text-on-surface-variant mt-3">
              {gradeProgress?.completedTopics || 0} of {gradeProgress?.totalTopics || 0} Grade {selectedGrade} topics completed
            </p>
          </div>
          <div className="rounded-xl bg-surface border border-outline/10 p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Grade Results</p>
            <p className="text-3xl font-black text-on-surface mt-2">{resultsSummary?.accuracy || 0}%</p>
            <p className="text-xs text-on-surface-variant mt-1">
              {resultsSummary?.correct || 0} of {resultsSummary?.attempted || 0} correct in Grade {selectedGrade}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div className="rounded-xl bg-surface border border-outline/10 p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Longest Streak</p>
            <p className="text-3xl font-black text-on-surface mt-2">{learningStreak?.longestStreak || 0}</p>
            <p className="text-xs text-on-surface-variant mt-1">best consecutive learning days overall</p>
          </div>
          <div className="rounded-xl bg-surface border border-outline/10 p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Last Active</p>
            <p className="text-lg font-black text-on-surface mt-3">
              {learningStreak?.lastActiveDate || 'No activity yet'}
            </p>
            <p className="text-xs text-on-surface-variant mt-1">{learningStreak?.activeDays || 0} total active days overall</p>
          </div>
        </div>

        <div className="mb-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-3">Subject Level Progress</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {subjectProgressCards.map(({ subject, progress }) => {
              const percentage = progress.completionPercentage || 0;
              return (
                <div key={subject._id} className="rounded-xl bg-surface border border-outline/10 p-4">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="text-sm font-bold text-on-surface line-clamp-1">{subject.subjectName}</p>
                    <span className="text-sm font-black text-primary-container">{percentage}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white border border-outline/10 overflow-hidden">
                    <div className="h-full bg-primary-container transition-all" style={{ width: `${percentage}%` }} />
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-2">
                    {progress.completedTopics || 0} of {progress.totalTopics || 0} topics completed
                  </p>
                </div>
              );
            })}
            {subjectProgressCards.length === 0 && (
              <div className="md:col-span-2 xl:col-span-3 rounded-xl bg-surface border border-dashed border-outline/20 p-6 text-center text-sm text-on-surface-variant">
                No subjects found for Grade {selectedGrade}.
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl bg-surface border border-outline/10 p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Total Results</p>
            <p className="text-3xl font-black text-on-surface mt-2">{resultsSummary?.correct || 0}/{resultsSummary?.attempted || 0}</p>
            <p className="text-xs text-on-surface-variant mt-1">correct answers</p>
          </div>
          {resultCards.map((card) => {
            const attempted = card.value?.attempted || 0;
            const correct = card.value?.correct || 0;
            const accuracy = card.value?.accuracy || 0;
            return (
              <div key={card.label} className="rounded-xl bg-surface border border-outline/10 p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">{card.label}</p>
                  <span className="text-sm font-black text-primary-container">{accuracy}%</span>
                </div>
                <div className="h-2 rounded-full bg-white border border-outline/10 overflow-hidden mt-3">
                  <div className="h-full bg-primary-container transition-all" style={{ width: `${accuracy}%` }} />
                </div>
                <p className="text-xs text-on-surface-variant mt-3">{correct} of {attempted} correct</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-white rounded-xl border border-outline-variant p-4 sm:p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.08)]">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-on-surface">Grade {selectedGrade} Subjects</h3>
            <p className="text-sm text-on-surface-variant mt-1">Start with the subject you want to study today.</p>
          </div>
          <div className="w-fit px-4 py-2 bg-primary-container/10 text-primary-container rounded-lg text-xs font-bold">
            {subjects.length} Subjects Available
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[1,2,3].map(i => <div key={i} className="h-44 bg-surface rounded-xl animate-pulse"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {subjects.map(subject => {
              const progress = progressBySubject[String(subject._id)] || {};
              const percentage = progress.completionPercentage || 0;
              return (
              <div key={subject._id} className="bg-white rounded-xl border border-outline/10 p-4 sm:p-6 shadow-sm hover:shadow-[0px_8px_24px_rgba(0,0,0,0.08)] transition-all flex flex-col h-full">
                <div className="flex items-start justify-between gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-container/10 rounded-lg flex items-center justify-center text-primary-container shrink-0">
                    <BookOpen size={20} />
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-surface text-[10px] font-black uppercase tracking-widest text-on-surface-variant border border-outline/10">
                    Grade {subject.gradeLevel}
                  </span>
                </div>
                <h4 className="text-lg sm:text-xl font-bold mt-5 mb-2">{subject.subjectName}</h4>
                <p className="text-on-surface-variant text-sm flex-grow">
                  Browse chapters, pick a topic, and continue through the guided lesson path.
                </p>
                <div className="mt-5 rounded-lg bg-surface border border-outline/10 p-4">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Completion</span>
                    <span className="text-sm font-black text-primary-container">{percentage}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white border border-outline/10 overflow-hidden">
                    <div
                      className="h-full bg-primary-container transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-2">
                    {progress.completedTopics || 0} of {progress.totalTopics || 0} topics completed
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/curriculum/subject/${subject._id}/chapters`)}
                  className="mt-6 w-full bg-error text-white py-3 px-5 rounded-lg font-semibold text-sm hover:brightness-110 active:opacity-80 transition-all flex items-center justify-center gap-2"
                >
                  Open Subject
                  <ArrowRight size={18} />
                </button>
              </div>
              );
            })}
            {subjects.length === 0 && (
              <div className="md:col-span-2 xl:col-span-3 py-20 text-center bg-surface rounded-xl border border-dashed border-outline/20">
                <BookOpen size={32} className="text-outline/40 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-on-surface mb-2">No Courses Assigned</h3>
                <p className="text-on-surface-variant text-sm max-w-xs mx-auto">
                  We couldn't find any subjects for Grade {selectedGrade} {user?.stream ? `(${user.stream} Stream)` : ''}.
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

const App = () => {
  const [selectedGrade, setSelectedGrade] = useState('12');

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <StudentLayout selectedGrade={selectedGrade} setSelectedGrade={setSelectedGrade}>
                  <Dashboard selectedGrade={selectedGrade} />
                </StudentLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          {/* Curriculum Routes */}
          <Route 
            path="/curriculum/subject/:subjectId/chapters"
            element={
              <ProtectedRoute allowedRoles={['student', 'admin']}>
                <StudentLayout selectedGrade={selectedGrade} setSelectedGrade={setSelectedGrade}>
                  <ChapterManagement isStudent={true} />
                </StudentLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/curriculum/chapter/:chapterId/topics"
            element={
              <ProtectedRoute allowedRoles={['student', 'admin']}>
                <StudentLayout selectedGrade={selectedGrade} setSelectedGrade={setSelectedGrade}>
                  <TopicManagement isStudent={true} />
                </StudentLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/curriculum/topic/:topicId"
            element={
              <ProtectedRoute allowedRoles={['student', 'admin']}>
                <StudentLayout selectedGrade={selectedGrade} setSelectedGrade={setSelectedGrade}>
                  <TopicDetailsLayout isStudent={true} />
                </StudentLayout>
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="objectives" replace />} />
            <Route path="objectives" element={<TopicObjectives isStudent={true} />} />
            <Route path="concept" element={<TopicConcept isStudent={true} />} />
            <Route path="video" element={<TopicVideo isStudent={true} />} />
            <Route path="exercise" element={<TopicExercise isStudent={true} />} />
            <Route path="quiz" element={<TopicQuiz isStudent={true} />} />
            <Route path="exam" element={<TopicExam isStudent={true} />} />
            <Route path="qa" element={<TopicQA />} />
            <Route path="reports" element={<TopicReports />} />
          </Route>

          {/* Teacher Management Routes */}
          <Route
            path="/teacher/subject/:subjectId/chapters"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <ChapterManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/chapter/:chapterId/topics"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <TopicManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/topic/:topicId"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <TopicDetailsLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="objectives" replace />} />
            <Route path="objectives" element={<TopicObjectives />} />
            <Route path="concept" element={<TopicConcept />} />
            <Route path="video" element={<TopicVideo />} />
            <Route path="exercise" element={<TopicExercise />} />
            <Route path="quiz" element={<TopicQuiz />} />
            <Route path="exam" element={<TopicExam />} />
            <Route path="qa" element={<TopicQA />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;