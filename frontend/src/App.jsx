import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { CircleUserRound, GraduationCap, LogOut, ShieldCheck, BookOpen, ArrowRight, Menu, X, Bell, Bookmark, Search, TriangleAlert, Bot, Send, Flame, CheckSquare } from 'lucide-react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import api from './services/api';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import TeacherLayout from './pages/TeacherLayout';
import TeacherDashboardHome from './pages/TeacherDashboardHome';
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
import ThemeToggle from './components/ThemeToggle';
import { askAiTutor } from './services/ai';
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
  getSubjectChapterProgress,
  getSubjectProgress
} from './services/engagement';

/** Match seed/UI variants like "12" vs "Grade 12". */
const gradeMatchesFilter = (subjectGrade, selectedGrade) => {
  const g = String(subjectGrade ?? '').replace(/\D/g, '');
  const s = String(selectedGrade ?? '').replace(/\D/g, '');
  if (g && s) return g === s;
  return String(subjectGrade) === String(selectedGrade);
};

// Student Layout Component with Persistent Sidebar
const StudentLayout = ({ children, selectedGrade, setSelectedGrade }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showGradeMenu, setShowGradeMenu] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [navSubjects, setNavSubjects] = useState([]);
  const [navChapters, setNavChapters] = useState([]);
  const [navTopics, setNavTopics] = useState([]);
  const [navSubjectProgress, setNavSubjectProgress] = useState(null);
  const [progressRefreshToken, setProgressRefreshToken] = useState(0);
  /** Grade-wide rollup: percentage + topic counts */
  const [gradeProgressDetail, setGradeProgressDetail] = useState(null);
  /** Consecutive days with Grade N activity (answers / topic access) */
  const [learningStreak, setLearningStreak] = useState(null);
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
  const activeSubjectName = navSubjects.find((s) => String(s._id) === String(activeSubjectId))?.subjectName ?? null;

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
        const rawProgress = progressResponse?.data;
        const progressList = Array.isArray(rawProgress) ? rawProgress : [];
        const progressMap = progressList.reduce((acc, item) => {
          const subjectId = item.subjectId?._id || item.subjectId;
          if (subjectId) acc[String(subjectId)] = item;
          return acc;
        }, {});
        setNavSubjects(subjectsList.filter((subject) =>
          gradeMatchesFilter(subject.gradeLevel, selectedGrade) &&
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
    if (user?.role !== 'student') {
      setGradeProgressDetail(null);
      setLearningStreak(null);
      return undefined;
    }
    let cancelled = false;
    const emptyStreak = {
      currentStreak: 0,
      longestStreak: 0,
      activeDays: 0,
      lastActiveDate: null,
    };
    (async () => {
      try {
        const [gradeRes, streakRes] = await Promise.all([
          getGradeProgress(selectedGrade),
          getLearningStreak(selectedGrade).catch(() => ({ data: null })),
        ]);
        if (cancelled) return;
        const data = gradeRes?.data;
        if (data && typeof data.completionPercentage === 'number') {
          setGradeProgressDetail({
            completionPercentage: data.completionPercentage,
            completedTopics: typeof data.completedTopics === 'number' ? data.completedTopics : 0,
            totalTopics: typeof data.totalTopics === 'number' ? data.totalTopics : 0,
          });
        } else {
          setGradeProgressDetail(null);
        }
        const s = streakRes?.data;
        if (s && typeof s.currentStreak === 'number') {
          setLearningStreak(s);
        } else {
          setLearningStreak(emptyStreak);
        }
      } catch (_err) {
        if (!cancelled) {
          setGradeProgressDetail(null);
          setLearningStreak(emptyStreak);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedGrade, user?.role, progressRefreshToken]);

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
          getUnreadNotifications().catch(() => ({ data: [] })),
          user?.role === 'student' ? getMyIssues().catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
          user?.role === 'student' ? getBookmarks().catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
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
    if (user) {
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

  /** Sidebar + drawer: streak for selected grade */
  const renderLearningStreakNav = () => {
    if (user?.role !== 'student' || learningStreak == null) return null;
    const cur = learningStreak.currentStreak ?? 0;
    const best = learningStreak.longestStreak ?? 0;
    const activeDays = learningStreak.activeDays ?? 0;
    const dayWord = cur === 1 ? 'day' : 'days';
    return (
      <div className="mt-4 rounded-lg border border-primary-container/15 bg-primary-container/5 px-3 py-3">
        <div className="flex items-start gap-2">
          <Flame className="text-primary-container shrink-0 mt-0.5" size={18} aria-hidden />
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary-container">Learning streak</p>
            <p className="text-[11px] text-on-surface-variant leading-snug mt-1">
              Consecutive calendar days with activity in Grade {selectedGrade} (answered questions or updated lesson progress).
            </p>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-lg font-black text-on-surface tabular-nums leading-none">{cur}</span>
              <span className="text-[11px] font-semibold text-on-surface-variant">
                {dayWord} current streak
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant mt-1.5">
              Best streak <span className="font-semibold text-on-surface">{best}</span>
              {typeof activeDays === 'number' ? (
                <>
                  {' '}
                  · <span className="font-semibold text-on-surface">{activeDays}</span> active days logged
                </>
              ) : null}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderCurriculumNav = (closeAfterNavigate = false) => (
    <div className="space-y-5 px-3 pt-3 border-t border-outline/5">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-black text-outline uppercase tracking-widest">1. Subjects</p>
          <span className="text-[10px] text-on-surface-variant">{navSubjects.length}</span>
        </div>
        <div className="space-y-1.5 max-h-48 overflow-auto pr-1">
          {navSubjects.map((subject) => {
            const subjTopics = subject.progress;
            const subjTotal = subjTopics?.totalTopics ?? 0;
            const subjDone = subjTopics?.completedTopics ?? 0;
            return (
            <button
              key={subject._id}
              type="button"
              onClick={() => {
                navigate(`/curriculum/subject/${subject._id}/chapters`);
                if (closeAfterNavigate) setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                activeSubjectId === subject._id
                  ? 'bg-primary-container text-on-primary shadow-sm'
                  : 'bg-white text-on-surface hover:bg-primary-container/5'
              }`}
            >
              <span className="flex flex-col gap-0.5 min-w-0">
                <span className="flex items-center justify-between gap-2">
                  <span className="line-clamp-1">{subject.subjectName}</span>
                  <span className={activeSubjectId === subject._id ? 'text-on-primary/80 shrink-0' : 'text-primary-container shrink-0'}>
                    {subject.progress?.completionPercentage || 0}%
                  </span>
                </span>
                <span className={`text-[10px] font-semibold uppercase tracking-wide ${activeSubjectId === subject._id ? 'text-on-primary/70' : 'text-on-surface-variant'}`}>
                  {subjTotal > 0 ? `${subjDone} / ${subjTotal} topics` : 'Topics not published'}
                </span>
              </span>
            </button>
          );
          })}
          {navSubjects.length === 0 && (
            <p className="text-[11px] text-on-surface-variant">No subjects for this grade.</p>
          )}
        </div>
      </div>

      {activeSubjectId && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-black text-outline uppercase tracking-widest">2. Chapters</p>
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
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  activeChapterId === chapter._id
                    ? 'bg-primary-container/10 text-primary-container'
                    : 'bg-white text-on-surface hover:bg-primary-container/5'
                }`}
              >
                <span className="line-clamp-1">{chapter.chapterName}</span>
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
            <p className="text-xs font-black text-outline uppercase tracking-widest">3. Topics</p>
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
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-between gap-2 ${
                  activeTopicId === topicItem._id
                    ? 'bg-primary-container/10 text-primary-container'
                    : 'bg-white text-on-surface hover:bg-primary-container/5'
                }`}
              >
                <span className="line-clamp-2">{topicItem.topicName}</span>
                <ArrowRight size={12} className="shrink-0 text-outline" aria-hidden />
              </button>
            ))}
            {navTopics.length === 0 && (
              <p className="text-[11px] text-on-surface-variant">Select a chapter to load topics.</p>
            )}
          </div>
        </div>
      )}

      {activeChapterId && (
        <div className="space-y-2 mt-4 pt-4 border-t border-outline/5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-black text-outline uppercase tracking-widest">4. Assessments</p>
          </div>
          <button 
            onClick={() => {
              // Navigate to the first topic's quiz tab as a shortcut
              if (navTopics.length > 0) {
                navigate(`/curriculum/topic/${navTopics[0]._id}/quiz`);
                if (closeAfterNavigate) setIsMobileMenuOpen(false);
              } else {
                navigate('/dashboard');
              }
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white border border-outline/10 text-on-surface-variant hover:bg-primary-container/5 transition-all text-sm font-bold"
          >
            <CheckSquare size={16} className="text-primary-container" />
            Quick Access Quizzes
          </button>
        </div>
      )}
    </div>
  );

  const renderMobileCurriculumNav = () => (
    <div className="space-y-4">
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <p className="text-xs font-black text-outline uppercase tracking-widest">Subjects</p>
          <span className="text-[10px] text-on-surface-variant">{navSubjects.length}</span>
        </div>
        <div className="grid grid-cols-1 gap-2 max-h-44 overflow-auto pr-1">
          {navSubjects.map((subject) => {
            const subjTopics = subject.progress;
            const subjTotal = subjTopics?.totalTopics ?? 0;
            const subjDone = subjTopics?.completedTopics ?? 0;
            return (
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
              <span className="flex flex-col gap-0.5 min-w-0">
                <span className="flex items-center justify-between gap-3">
                  <span className="line-clamp-1">{subject.subjectName}</span>
                  <span className={activeSubjectId === subject._id ? 'text-on-primary/80 shrink-0' : 'text-primary-container shrink-0'}>
                    {subject.progress?.completionPercentage || 0}%
                  </span>
                </span>
                <span className={`text-[11px] font-semibold ${activeSubjectId === subject._id ? 'text-on-primary/70' : 'text-on-surface-variant'}`}>
                  {subjTotal > 0 ? `${subjDone} of ${subjTotal} topics complete` : 'Topics not published'}
                </span>
              </span>
            </button>
          );
          })}
          {navSubjects.length === 0 && (
            <p className="text-xs text-on-surface-variant px-1">No subjects for this grade.</p>
          )}
        </div>
      </section>

      {activeSubjectId && (
        <section className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-black text-outline uppercase tracking-widest">Chapters</p>
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
                <span className="line-clamp-1">{chapter.chapterName}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {activeChapterId && (
        <section className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-black text-outline uppercase tracking-widest">Topics</p>
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
                <ArrowRight size={13} className="shrink-0 text-outline" aria-hidden />
              </button>
            ))}
          </div>
        </section>
      )}

      {activeChapterId && (
        <section className="space-y-2 mt-4 pt-4 border-t border-outline/5">
           <p className="text-xs font-black text-outline uppercase tracking-widest px-1">Assessments</p>
           <button 
             onClick={() => {
               if (navTopics.length > 0) {
                 navigate(`/curriculum/topic/${navTopics[0]._id}/quiz`);
                 setIsMobileMenuOpen(false);
               }
             }}
             className="w-full flex items-center gap-4 px-4 py-4 rounded-xl bg-white border border-outline/10 text-on-surface font-bold text-sm"
           >
             <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container">
               <CheckSquare size={20} />
             </div>
             Go to Quizzes
           </button>
        </section>
      )}
    </div>
  );

  return (
    <div className="h-screen bg-background text-on-surface font-sans flex overflow-hidden">
      {/* Sidebar (Desktop) */}
      <aside className={`${isSidebarCollapsed ? 'w-[86px]' : 'w-[300px]'} bg-background border-r border-outline/10 hidden lg:flex flex-col z-50 shadow-[4px_0_12px_rgba(0,0,0,0.02)] shrink-0 h-full sticky top-0 transition-all duration-300`}>
        <div className={`h-20 flex items-center border-b border-outline/5 px-4 ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-9 h-9 bg-primary-container rounded-lg flex items-center justify-center shadow-sm">
            <GraduationCap className="text-on-primary" size={20} />
          </div>
          {!isSidebarCollapsed && (
          <div>
            <h2 className="text-base font-bold tracking-tight">Entrance Exam Prep</h2>
          </div>
          )}
        </div>
        <div className="p-3 border-b border-outline/5">
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed((value) => !value)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-white border border-outline/10 text-primary-container font-bold text-xs hover:bg-primary-container/5 transition-colors"
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? <Menu size={18} /> : <X size={18} />}
            {!isSidebarCollapsed && <span>Collapse</span>}
          </button>
        </div>
        <nav className={`flex-grow p-4 space-y-5 overflow-y-auto ${isSidebarCollapsed ? 'hidden' : ''}`}>
          <div className="space-y-2 px-3 pt-2 pb-1">
            <label htmlFor="sidebar-topic-search" className="text-xs font-black text-outline uppercase tracking-widest">Search</label>
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
                  <span className="text-sm font-semibold text-on-surface line-clamp-2">{t.topicName}</span>
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
              <div className="px-3 py-1 text-xs font-black text-outline uppercase tracking-widest">Manage</div>
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
              <div className="flex items-center gap-2 text-xs font-black text-outline uppercase tracking-widest">
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
                    <p className="text-sm font-semibold line-clamp-1">{issue.topicId?.topicName || issue.title}</p>
                    <p className="text-[11px] text-primary-container capitalize mt-1">{issue.issueStatus}</p>
                  </button>
                ))}
                {myReports.length === 0 && <p className="text-[11px] text-on-surface-variant">None</p>}
              </div>
            </div>
          )}
        </nav>
        <div className={`p-4 border-t border-outline/5 ${isSidebarCollapsed ? 'hidden' : ''}`}>
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
                <label htmlFor="mobile-topic-search" className="text-xs font-black text-outline uppercase tracking-widest">Find topic</label>
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

      <div className="flex-grow flex flex-col min-h-0 min-w-0">
        <header className="min-h-[3.5rem] sm:min-h-[4rem] sm:h-20 bg-header-surface/95 backdrop-blur border-b border-outline/10 px-2 sm:px-4 lg:px-gutter flex items-center justify-between gap-1.5 sm:gap-2 sticky top-0 z-40 shrink-0 min-w-0 py-1.5 sm:py-0 overflow-x-hidden">
           <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1 overflow-hidden">
             <button type="button" onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden text-on-surface-variant p-2 shrink-0 rounded-lg hover:bg-surface -ml-1" aria-label="Open menu">
               <Menu size={24} />
             </button>
             {userRole === 'student' && (
               <div className="relative min-w-0 flex-1 sm:flex-initial max-w-[min(10rem,calc(100vw-13rem))] sm:max-w-[14rem]">
                 <button
                   type="button"
                   onClick={() => setShowGradeMenu((value) => !value)}
                   className="w-full min-w-0 bg-surface border border-outline/10 rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 shadow-sm hover:border-primary-container/30 hover:bg-card transition-all flex items-center justify-between gap-2"
                   title="Choose grade"
                 >
                   <span className="text-left min-w-0 truncate">
                     <span className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-on-surface-variant leading-tight">Current Grade</span>
                     <span className="block text-xs sm:text-sm font-black text-on-surface leading-tight truncate mt-0 sm:mt-px">
                       <span className="sm:hidden">G{selectedGrade}</span>
                       <span className="hidden sm:inline">Grade {selectedGrade}</span>
                     </span>
                   </span>
                   <span className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 rounded-lg bg-primary-container/10 text-primary-container flex items-center justify-center text-[10px] font-black">▾</span>
                 </button>
                 {showGradeMenu && (
                   <div className="absolute left-0 top-full mt-2 z-[60] w-56 max-w-[min(18rem,calc(100vw-2rem))] bg-white border border-outline-variant rounded-2xl shadow-[0px_12px_32px_rgba(0,0,0,0.12)] p-2">
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
          <div className="flex items-center gap-0.5 sm:gap-1.5 md:gap-3 shrink-0">
             <div className="relative">
               <button
                 type="button"
                 onClick={() => setShowNotifications((v) => !v)}
                 className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container border border-primary-container/20 relative"
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
                 <div className="absolute right-0 mt-2 w-[min(20rem,calc(100vw-1.5rem))] max-h-[min(22.5rem,70vh)] overflow-auto rounded-xl border border-outline/10 bg-card shadow-xl z-[60]">
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
             <div className="relative hidden sm:block">
               <button
                 type="button"
                 onClick={() => setShowBookmarks((v) => !v)}
                 className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container border border-primary-container/20 relative"
                 title={userRole === 'student' ? 'My bookmarks' : 'Bookmarks'}
               >
                 <Bookmark size={18} />
                 {bookmarks.length > 0 && (
                   <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-primary-container text-white text-[10px] font-bold flex items-center justify-center">
                     {bookmarks.length > 9 ? '9+' : bookmarks.length}
                   </span>
                 )}
               </button>
               {showBookmarks && (
                 <div className="absolute right-0 mt-2 w-[min(20rem,calc(100vw-1.5rem))] max-h-[min(22.5rem,70vh)] overflow-auto rounded-xl border border-outline/10 bg-card shadow-xl z-[60]">
                   <div className="px-4 py-3 border-b border-outline/10 flex items-center justify-between">
                     <p className="text-sm font-semibold">My Bookmarks</p>
                     <span className="text-xs text-on-surface-variant">{bookmarks.length} saved</span>
                   </div>
                   <div className="p-2 space-y-2">
                    {userRole !== 'student' && (
                      <p className="text-sm text-on-surface-variant p-3">Bookmarks are available for student accounts.</p>
                    )}
                    {userRole === 'student' && bookmarks.map((bookmark) => (
                      <div key={bookmark._id} className="p-3 rounded-lg border border-outline/10 bg-surface">
                        <button
                          type="button"
                          onClick={() => handleOpenBookmark(bookmark)}
                          disabled={!bookmark.targetPath}
                          className="w-full text-left disabled:cursor-not-allowed"
                        >
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary-container">
                            {String(bookmark.resourceType ?? 'resource').replaceAll('-', ' ')}
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
                     {userRole === 'student' && bookmarks.length === 0 && (
                       <p className="text-sm text-on-surface-variant p-3">No bookmarks yet.</p>
                     )}
                   </div>
                 </div>
               )}
             </div>
             <ThemeToggle />
             <div className="text-right hidden md:block">
               <p className="text-sm font-semibold">{user?.firstName} {user?.lastName}</p>
               <p className="text-[10px] text-primary-container uppercase font-bold tracking-widest">{user?.stream || 'Student'}</p>
             </div>
             <Link to="/profile" className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container border border-primary-container/20 overflow-hidden hover:opacity-80 transition-opacity shrink-0" aria-label="Profile">
               {user?.profileImage ? <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" /> : <CircleUserRound size={24} />}
             </Link>
           </div>
        </header>
        <main className="flex-grow min-h-0 p-gutter overflow-y-auto bg-background">
          <div className="max-w-[1440px] mx-auto">
            {children}
          </div>
        </main>
        {userRole === 'student' && <StudentChatBot />}
      </div>
    </div>
  );
};

const renderDashboardAiAnswer = (text) => {
  const blocks = String(text || '')
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (blocks.length === 0) return null;

  const renderInlineMarkdown = (value) => String(value).split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-black text-on-surface">{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });

  return (
    <div className="space-y-4 text-sm sm:text-[15px] leading-7 text-on-surface-variant">
      {blocks.map((block, blockIndex) => {
        const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
        const isBulletList = lines.every((line) => /^[-*•]\s+/.test(line));
        const isNumberedList = lines.every((line) => /^\d+[.)]\s+/.test(line));
        const heading = block.match(/^#{1,3}\s+(.+)$/);
        const looksLikeFormula = lines.length <= 4 && lines.some((line) => /[=+\-*/^<>]|sqrt|frac|\d/.test(line));

        if (heading) {
          return (
            <h4 key={blockIndex} className="text-base font-black text-on-surface">
              {renderInlineMarkdown(heading[1])}
            </h4>
          );
        }

        if (isBulletList) {
          return (
            <ul key={blockIndex} className="list-disc pl-5 space-y-2">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>{renderInlineMarkdown(line.replace(/^[-*•]\s+/, ''))}</li>
              ))}
            </ul>
          );
        }

        if (isNumberedList) {
          return (
            <ol key={blockIndex} className="list-decimal pl-5 space-y-2">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>{renderInlineMarkdown(line.replace(/^\d+[.)]\s+/, ''))}</li>
              ))}
            </ol>
          );
        }

        if (looksLikeFormula) {
          return (
            <pre key={blockIndex} className="whitespace-pre-wrap overflow-x-auto rounded-lg border border-outline/10 bg-white px-4 py-3 font-mono text-[13px] leading-6 text-on-surface">
              {lines.join('\n')}
            </pre>
          );
        }

        return (
          <p key={blockIndex} className="whitespace-pre-line">
            {renderInlineMarkdown(lines.join('\n'))}
          </p>
        );
      })}
    </div>
  );
};

const Dashboard = ({ selectedGrade }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [progressBySubject, setProgressBySubject] = useState({});
  const [gradeProgress, setGradeProgress] = useState(null);
  const [learningStreak, setLearningStreak] = useState(null);
  const [dashboardAiQuestion, setDashboardAiQuestion] = useState('');
  const [dashboardAiAnswer, setDashboardAiAnswer] = useState('');
  const [dashboardAiLoading, setDashboardAiLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardProgressToken, setDashboardProgressToken] = useState(0);

  useEffect(() => {
    const handleProgressRefresh = () => setDashboardProgressToken((value) => value + 1);
    window.addEventListener('student-progress-refresh', handleProgressRefresh);
    return () => window.removeEventListener('student-progress-refresh', handleProgressRefresh);
  }, []);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return undefined;
    }

    const normalizeProgressPayload = (list) =>
      Array.isArray(list)
        ? list.reduce((acc, item) => {
            const subjectId = item.subjectId?._id || item.subjectId;
            if (subjectId) acc[String(subjectId)] = item;
            return acc;
          }, {})
        : {};

    const fetchSubjects = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/subjects');
        const subjectsList = Array.isArray(response.data) ? response.data : (response.data.data || []);
        const filtered = subjectsList.filter(
          (s) =>
            gradeMatchesFilter(s.gradeLevel, selectedGrade) &&
            (!s.stream || s.stream === user?.stream),
        );
        setSubjects(filtered);

        try {
          const progressResponse = await getSubjectProgress();
          const raw = progressResponse?.data;
          const progressList = Array.isArray(raw) ? raw : [];
          setProgressBySubject(normalizeProgressPayload(progressList));
        } catch (_err) {
          setProgressBySubject({});
        }

        try {
          const gradeProgressResponse = await getGradeProgress(selectedGrade);
          setGradeProgress(gradeProgressResponse?.data || null);
        } catch (_err) {
          setGradeProgress(null);
        }

        try {
          const streakResponse = await getLearningStreak(selectedGrade);
          setLearningStreak(streakResponse?.data || null);
        } catch (_err) {
          setLearningStreak(null);
        }
      } catch (err) {
        console.error('Failed to fetch subjects:', err);
        setSubjects([]);
        setProgressBySubject({});
        setGradeProgress(null);
        setLearningStreak(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjects();
    return undefined;
  }, [user, selectedGrade, dashboardProgressToken]);

  const overallProgress = gradeProgress?.completionPercentage || 0;
  const gradeTopicsDone = typeof gradeProgress?.completedTopics === 'number' ? gradeProgress.completedTopics : 0;
  const gradeTopicsTotal = typeof gradeProgress?.totalTopics === 'number' ? gradeProgress.totalTopics : 0;
  const subjectCount = subjects.length;
  const currentStreak = learningStreak?.currentStreak || 0;

  const handleDashboardAiSubmit = async (event) => {
    event.preventDefault();
    const text = dashboardAiQuestion.trim();
    if (!text) return;

    setDashboardAiLoading(true);
    setDashboardAiAnswer('');
    try {
      const response = await askAiTutor({
        message: text,
        page: 'dashboard',
      });
      setDashboardAiAnswer(response?.data?.answer || 'I could not find an answer right now.');
      setDashboardAiQuestion('');
    } catch (err) {
      setDashboardAiAnswer(err.response?.data?.message || 'The AI tutor could not answer right now.');
    } finally {
      setDashboardAiLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-5 sm:space-y-8">
      <section className="bg-white rounded-xl border border-outline-variant p-4 sm:p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col lg:flex-row lg:items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-primary-container/10 text-primary-container flex items-center justify-center shrink-0">
            <Bot size={26} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-container">AI Study Assistant</p>
            <h3 className="text-xl sm:text-2xl font-bold text-on-surface mt-1">What do you want to study? Ask me.</h3>
            <p className="text-sm text-on-surface-variant mt-1">
              Ask about a subject, topic, exercise, quiz, or exam idea and get a quick study explanation.
            </p>
          </div>
        </div>

        <form onSubmit={handleDashboardAiSubmit} className="mt-5 flex flex-col sm:flex-row gap-3">
          <input
            value={dashboardAiQuestion}
            onChange={(event) => setDashboardAiQuestion(event.target.value)}
            placeholder="Example: Help me study atomic structure"
            className="flex-1 border border-outline/20 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-primary-container"
          />
          <button
            type="submit"
            disabled={dashboardAiLoading || !dashboardAiQuestion.trim()}
            className="bg-primary-container text-on-primary px-6 py-3 rounded-xl font-bold text-sm hover:brightness-110 disabled:opacity-50 transition-all inline-flex items-center justify-center gap-2"
          >
            <Send size={18} />
            {dashboardAiLoading ? 'Thinking...' : 'Ask AI'}
          </button>
        </form>

        {(dashboardAiLoading || dashboardAiAnswer) && (
          <div className="mt-4 rounded-2xl bg-surface border border-outline/10 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary-container/10 text-primary-container flex items-center justify-center">
                  <Bot size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary-container">AI Tutor Response</p>
                  <p className="text-xs text-on-surface-variant">Structured study notes for your question</p>
                </div>
              </div>
              {!dashboardAiLoading && (
                <button
                  type="button"
                  onClick={() => setDashboardAiAnswer('')}
                  className="w-8 h-8 rounded-lg border border-outline/10 bg-white text-on-surface-variant hover:text-error hover:bg-error/5 transition-colors flex items-center justify-center shrink-0"
                  aria-label="Close AI answer"
                  title="Close answer"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            {dashboardAiLoading ? (
              <p className="text-sm text-on-surface-variant leading-6">
                Thinking about the best way to explain this...
              </p>
            ) : (
              renderDashboardAiAnswer(dashboardAiAnswer)
            )}
          </div>
        )}
      </section>

      <section className="relative overflow-hidden rounded-[28px] border border-outline/10 bg-[#fff8ef] p-4 sm:p-6 lg:p-8 shadow-[0px_10px_30px_rgba(0,0,0,0.06)]">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#ff8a00] via-[#ffa84f] to-[#ffd7a3]" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <div className="space-y-4 sm:space-y-5">
            <div className="space-y-1">
              <p className="text-[11px] sm:text-[12px] font-black uppercase tracking-[0.25em] text-[#ff8a00]">Student Learning Hub</p>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-black tracking-tight text-on-surface leading-none">
                Welcome back, {user?.firstName || 'Student'}
              </h2>
              <p className="max-w-2xl text-sm sm:text-[15px] leading-6 text-on-surface-variant">
                Pick a subject, choose a chapter, then follow each topic step by step from objectives to practice and exam review.
              </p>
            </div>

          </div>

          <div className="flex justify-end lg:min-w-[260px]">
            <div className="w-full max-w-[260px] rounded-[26px] bg-gradient-to-br from-[#ff9a18] to-[#ff6a00] p-4 sm:p-5 text-white shadow-[0px_14px_28px_rgba(255,122,0,0.28)]">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2 text-white/90">
                  <Flame size={18} />
                  <span className="text-[11px] font-black uppercase tracking-[0.22em]">Overall Streak</span>
                </div>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-black leading-none">{currentStreak}</span>
                <span className="pb-1 text-sm font-black uppercase tracking-[0.2em]">days</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-[#f6d8b0] bg-[#fff4e5] p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ff8a00]">Grade {selectedGrade} Completion</p>
            <p className="text-sm font-black text-[#ff8a00]">{gradeTopicsDone}/{gradeTopicsTotal} topics</p>
          </div>
          <div className="mt-3 h-2 rounded-full bg-white border border-[#f1d9bd] overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-[#ff9a18] to-[#ff6a00] transition-all" style={{ width: `${overallProgress}%` }} />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3 text-center">
            {[25, 50, 75, 100].map((marker) => (
              <div key={marker} className="space-y-1">
                <div className="mx-auto flex h-6 w-6 items-center justify-center rounded-full border border-[#f1d9bd] bg-white text-[10px] font-black text-on-surface-variant shadow-sm">
                  {marker}
                </div>
                <p className="text-[11px] font-black text-on-surface-variant">{marker}%</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-outline-variant p-4 sm:p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.08)]">
        <h3 className="text-xl sm:text-2xl font-semibold text-on-surface mb-6">
          Grade {selectedGrade} subjects
        </h3>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[1,2,3].map(i => <div key={i} className="h-44 bg-surface rounded-xl animate-pulse"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {subjects.map(subject => {
              const progress = progressBySubject[String(subject._id)] || {};
              const percentage = progress.completionPercentage || 0;
              const tDone = progress.completedTopics ?? 0;
              const tTotal = progress.totalTopics ?? 0;
              return (
              <div key={subject._id} className="bg-white rounded-xl border border-outline/10 p-4 sm:p-6 shadow-sm hover:shadow-[0px_8px_24px_rgba(0,0,0,0.08)] transition-all flex flex-col h-full">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-container/10 rounded-lg flex items-center justify-center text-primary-container shrink-0">
                    <BookOpen size={20} />
                  </div>
                </div>
                <h4 className="text-lg sm:text-xl font-bold mt-4">{subject.subjectName}</h4>
                <div className="mt-4 rounded-lg bg-surface border border-outline/10 p-4 flex-1">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Topic completion</span>
                    <span className="text-sm font-black text-primary-container">{percentage}%</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant leading-snug mb-3">
                    {tTotal > 0 ? (
                      <>
                        Lesson topics marked complete in this subject:{' '}
                        <span className="font-semibold text-on-surface">
                          {tDone} of {tTotal}
                        </span>
                        .
                      </>
                    ) : (
                      <>No lesson topics are published under this subject yet.</>
                    )}
                  </p>
                  <div className="h-2 rounded-full bg-white border border-outline/10 overflow-hidden">
                    <div
                      className="h-full bg-primary-container transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
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
                <TeacherLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<TeacherDashboardHome />} />
            <Route path="qa" element={<TeacherDashboardHome />} />
            <Route path="subject/:subjectId/chapters" element={<ChapterManagement />} />
            <Route path="chapter/:chapterId/topics" element={<TopicManagement />} />
            <Route path="topic/:topicId" element={<TopicDetailsLayout />}>
              <Route index element={<Navigate to="objectives" replace />} />
              <Route path="objectives" element={<TopicObjectives />} />
              <Route path="concept" element={<TopicConcept />} />
              <Route path="video" element={<TopicVideo />} />
              <Route path="exercise" element={<TopicExercise />} />
              <Route path="quiz" element={<TopicQuiz />} />
              <Route path="exam" element={<TopicExam />} />
              <Route path="qa" element={<TopicQA />} />
            </Route>
          </Route>
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

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;