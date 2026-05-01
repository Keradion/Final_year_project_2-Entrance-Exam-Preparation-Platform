import React, { useCallback, useState, useEffect } from 'react';
import { Outlet, NavLink, useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Target, BookOpen, Video, PenTool, CheckSquare, Award, TriangleAlert, HelpCircle } from 'lucide-react';
import api from '../services/api';
import { getTopicCompletionEligibility, markTopicComplete } from '../services/engagement';

const TopicDetailsLayout = ({ isStudent = false }) => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [topic, setTopic] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [subject, setSubject] = useState(null);
  const [completionSummary, setCompletionSummary] = useState(null);
  const [progressMessage, setProgressMessage] = useState('');
  const [isCompletingTopic, setIsCompletingTopic] = useState(false);
  const [completionEligibility, setCompletionEligibility] = useState(null);
  const [isLoadingEligibility, setIsLoadingEligibility] = useState(false);

  const fetchTopic = useCallback(async () => {
    try {
      const res = await api.get(`/content/topics/${topicId}`);
      const topicData = res.data.data || res.data;
      setTopic(topicData);

      if (topicData?.chapter) {
        const chapterRes = await api.get(`/content/chapters/${topicData.chapter}`);
        const chapterData = chapterRes.data.data || chapterRes.data;
        setChapter(chapterData);

        if (chapterData?.subject) {
          const subjectRes = await api.get(`/subjects/${chapterData.subject}`);
          setSubject(subjectRes.data.data || subjectRes.data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch topic details');
    }
  }, [topicId]);

  useEffect(() => {
    if (topicId) fetchTopic();
    setCompletionSummary(null);
    setProgressMessage('');
  }, [fetchTopic, topicId]);

  useEffect(() => {
    const fetchEligibility = async () => {
      if (!isStudent || !topicId) return;

      try {
        setIsLoadingEligibility(true);
        const response = await getTopicCompletionEligibility(topicId);
        setCompletionEligibility(response?.data || null);
      } catch (_err) {
        setCompletionEligibility(null);
      } finally {
        setIsLoadingEligibility(false);
      }
    };

    fetchEligibility();
  }, [isStudent, topicId]);

  const basePath = isStudent ? `/curriculum/topic/${topicId}` : `/teacher/topic/${topicId}`;

  const tabs = [
    { name: 'Objectives', path: 'objectives', icon: <Target size={18} /> },
    { name: 'Concept', path: 'concept', icon: <BookOpen size={18} /> },
    { name: 'Video', path: 'video', icon: <Video size={18} /> },
    { name: 'Exercise', path: 'exercise', icon: <PenTool size={18} /> },
    { name: 'Quiz', path: 'quiz', icon: <CheckSquare size={18} /> },
    { name: 'Exam', path: 'exam', icon: <Award size={18} /> },
  ];
  const supportTabs = [
    { name: 'Q&A', path: 'qa', icon: <HelpCircle size={18} />, helper: 'Ask or review questions' },
    ...(isStudent ? [{ name: 'Reports', path: 'reports', icon: <TriangleAlert size={18} />, helper: 'Report topic issues' }] : []),
  ];
  const currentPath = location.pathname.split('/').filter(Boolean).at(-1);
  const currentIndex = tabs.findIndex((tab) => tab.path === currentPath);
  const isLearningTab = currentIndex >= 0;
  const previousTab = isLearningTab ? tabs[currentIndex - 1] || null : null;
  const nextTab = isLearningTab ? tabs[currentIndex + 1] || null : null;

  const handleMarkTopicComplete = async () => {
    try {
      setIsCompletingTopic(true);
      setProgressMessage('');
      const response = await markTopicComplete(topicId);
      const progress = response?.data;
      const milestones = response?.newlyReachedMilestones || [];
      setCompletionSummary(progress);
      setCompletionEligibility(response?.quizCompletion || completionEligibility);
      window.dispatchEvent(new Event('student-notifications-refresh'));
      window.dispatchEvent(new Event('student-progress-refresh'));
      setProgressMessage(
        milestones.length > 0
          ? `Topic completed. Milestone reached: ${milestones.join('%, ')}%. Check your notifications.`
          : `Topic completed. Subject progress is now ${progress?.completionPercentage || 0}%.`
      );
    } catch (err) {
      setProgressMessage(err.response?.data?.message || 'Failed to update topic progress.');
      if (topicId) {
        try {
          const response = await getTopicCompletionEligibility(topicId);
          setCompletionEligibility(response?.data || null);
        } catch (_err) {
          // Keep the visible backend error as the useful message.
        }
      }
    } finally {
      setIsCompletingTopic(false);
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-[10px] font-black text-outline uppercase tracking-widest hover:text-primary-container transition-all mb-4"
        >
          <ChevronLeft size={14}/> Back to Topics
        </button>
        
        <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.08)] mb-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-outline">
            {subject?.subjectName || 'Subject'} {chapter?.chapterName ? `• ${chapter.chapterName}` : ''}
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mt-2">
            <div>
              <h1 className="text-3xl font-bold text-on-surface">
                {topic?.topicName || 'Loading...'}
              </h1>
              <p className="text-sm text-on-surface-variant mt-2 max-w-2xl">
                Move through the lesson in order: objectives, concept, video, practice, quiz, then exam review.
              </p>
            </div>
            {isStudent && (
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleMarkTopicComplete}
                  disabled={isCompletingTopic || isLoadingEligibility || completionEligibility?.eligible === false}
                  className="bg-surface text-primary-container border border-primary-container/20 px-5 py-3 rounded-lg font-semibold text-sm hover:bg-primary-container/5 disabled:opacity-60 transition-all inline-flex items-center justify-center gap-2"
                >
                  <CheckSquare size={18} />
                  {isCompletingTopic ? 'Updating...' : isLoadingEligibility ? 'Checking quiz...' : 'Mark Topic Complete'}
                </button>
                {nextTab && (
                  <button
                    type="button"
                    onClick={() => navigate(`${basePath}/${nextTab.path}`)}
                    className="bg-primary-container text-on-primary px-5 py-3 rounded-lg font-semibold text-sm hover:brightness-110 transition-all inline-flex items-center justify-center gap-2"
                  >
                    Continue to {nextTab.name}
                    <ChevronRight size={18} />
                  </button>
                )}
              </div>
            )}
          </div>
          {isStudent && completionEligibility && (
            <div className={`mt-5 rounded-lg border p-4 ${
              completionEligibility.eligible
                ? 'bg-primary-container/5 border-primary-container/10'
                : 'bg-surface border-outline/10'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className={`text-sm font-semibold ${completionEligibility.eligible ? 'text-primary-container' : 'text-on-surface-variant'}`}>
                  {completionEligibility.message}
                </p>
                <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                  {completionEligibility.answeredQuestions || 0}/{completionEligibility.totalQuestions || 0} quiz answered
                </span>
              </div>
            </div>
          )}
          {isStudent && (progressMessage || completionSummary) && (
            <div className="mt-5 rounded-lg bg-primary-container/5 border border-primary-container/10 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="text-sm font-semibold text-primary-container">{progressMessage}</p>
                {completionSummary && (
                  <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                    {completionSummary.completedTopics || 0}/{completionSummary.totalTopics || 0} topics • {completionSummary.completionPercentage || 0}%
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
          {tabs.map((tab, index) => (
            <NavLink
              key={tab.path}
              to={`${basePath}/${tab.path}`}
              className={({ isActive }) =>
                `flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-primary-container text-on-primary shadow-md shadow-primary-container/20' 
                    : isLearningTab && index < currentIndex
                      ? 'bg-primary-container/10 text-primary-container hover:bg-primary-container/15'
                      : 'bg-surface text-on-surface-variant hover:bg-surface-container-high'
                }`
              }
            >
              <span className="w-5 h-5 rounded-full bg-white/20 border border-current/10 flex items-center justify-center text-[10px]">
                {index + 1}
              </span>
              {tab.icon}
              {tab.name}
            </NavLink>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-outline/10 bg-white p-4 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary-container">Support</p>
              <p className="text-sm text-on-surface-variant mt-1">Use these when you need help or want to report a problem. They are separate from lesson progress.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {supportTabs.map((tab) => (
                <NavLink
                  key={tab.path}
                  to={`${basePath}/${tab.path}`}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-primary-container text-on-primary border-primary-container'
                        : 'bg-surface text-on-surface-variant border-outline/10 hover:bg-primary-container/5'
                    }`
                  }
                  title={tab.helper}
                >
                  {tab.icon}
                  {tab.name}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow min-h-[500px]">
        <Outlet context={{ topic, chapter, subject, isStudent, fetchData: fetchTopic }} />
      </div>
      <div className="mt-5 bg-white rounded-xl border border-outline-variant p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <button
          type="button"
          onClick={() => previousTab && navigate(`${basePath}/${previousTab.path}`)}
          disabled={!isLearningTab || !previousTab}
          className="px-5 py-3 rounded-lg border border-outline/20 text-sm font-semibold text-on-surface-variant disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface transition-all inline-flex items-center justify-center gap-2"
        >
          <ChevronLeft size={16} />
          {previousTab ? previousTab.name : 'Start'}
        </button>
        <p className="text-xs font-semibold text-on-surface-variant text-center">
          {isLearningTab ? `Step ${currentIndex + 1} of ${tabs.length}: ${tabs[currentIndex]?.name}` : 'Support area: use the learning tabs above to continue the lesson path.'}
        </p>
        <button
          type="button"
          onClick={() => nextTab && navigate(`${basePath}/${nextTab.path}`)}
          disabled={!isLearningTab || !nextTab}
          className="px-5 py-3 rounded-lg bg-primary-container text-on-primary text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all inline-flex items-center justify-center gap-2"
        >
          {nextTab ? nextTab.name : 'Completed'}
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default TopicDetailsLayout;