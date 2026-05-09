import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  BookOpen,
  ArrowRight,
  TriangleAlert,
  MessageCircle,
  Send,
  Search,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import {
  getIssuesForReview,
  updateIssueStatus,
  listQuestions,
  answerQuestion,
} from '../services/engagement';

const TeacherDashboardHome = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const activeSection = location.pathname.startsWith('/teacher/qa') ? 'qa' : 'courses';

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [issues, setIssues] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answerDrafts, setAnswerDrafts] = useState({});
  const [feedback, setFeedback] = useState('');
  const [qaStatusFilter, setQaStatusFilter] = useState('');
  const [qaSearch, setQaSearch] = useState('');

  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/subjects');
      const userId = user?.id || user?._id;
      const mySubjects = res.data.filter(
        (s) => s.teacher && (s.teacher._id === userId || s.teacher === userId)
      );
      setSubjects(mySubjects);
    } catch (_err) {
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
        const [issueRes, questionRes] = await Promise.all([
          getIssuesForReview(),
          listQuestions({ limit: 100 }),
        ]);
        setIssues(issueRes?.data || []);
        setQuestions(questionRes?.data || []);
      } catch (err) {
        console.error('Failed to load teacher dashboard feeds', err);
      }
    };
    fetchTeacherFeeds();
  }, []);

  const filteredQuestions = questions.filter((question) => {
    const status = question.status === 'answered' ? 'answered' : 'open';
    const matchesStatus = !qaStatusFilter || status === qaStatusFilter;
    const query = qaSearch.trim().toLowerCase();
    const matchesSearch =
      !query ||
      question.questionText?.toLowerCase().includes(query) ||
      question.studentId?.firstName?.toLowerCase().includes(query) ||
      question.studentId?.lastName?.toLowerCase().includes(query) ||
      question.topicId?.topicName?.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const handleIssueStatus = async (issueId, issueStatus) => {
    try {
      const res = await updateIssueStatus(issueId, {
        issueStatus,
        response: 'Thanks, we reviewed this item.',
      });
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
      setQuestions((prev) =>
        prev.map((question) =>
          question._id === questionId ? { ...question, status: 'answered' } : question
        )
      );
      setFeedback('Answer submitted.');
    } catch (err) {
      setFeedback(err?.response?.data?.message || 'Failed to submit answer.');
    }
  };

  return (
    <div className="w-full min-w-0 overflow-x-hidden animate-in fade-in duration-500">
        {activeSection === 'courses' && (
          <>
            <div className="mb-6 sm:mb-10">
              <h3 className="text-xl sm:text-2xl font-bold mb-2 break-words">Assigned Courses</h3>
              <p className="text-on-surface-variant">
                Select a course to manage its chapters, topics, and learning materials.
              </p>
              {error && <p className="text-error text-sm mt-2">{error}</p>}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 bg-surface-variant/20 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
                {subjects.map((subject) => (
                  <div
                    key={subject._id}
                    className="bg-white rounded-2xl border border-outline/10 p-5 sm:p-8 shadow-sm hover:shadow-md transition-all group flex flex-col min-w-0"
                  >
                    <div className="w-12 h-12 bg-primary-container/5 rounded-xl flex items-center justify-center text-primary-container mb-6 border border-primary-container/10 group-hover:bg-primary-container group-hover:text-white transition-all">
                      <BookOpen size={24} />
                    </div>
                    <h3 className="text-lg sm:text-2xl font-bold mb-2 break-words">{subject.subjectName}</h3>
                    <p className="text-on-surface-variant text-sm mb-6 sm:mb-8 flex-grow break-words">
                      Manage the curriculum for Grade {subject.gradeLevel}{' '}
                      {subject.stream ? `${subject.stream} Stream` : ''}.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate(`/teacher/subject/${subject._id}/chapters`)}
                      className="w-full bg-primary-container text-on-primary py-3.5 sm:py-4 rounded-lg font-semibold text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 min-h-11"
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
                    <p className="text-on-surface-variant max-w-sm mx-auto">
                      You haven&apos;t been assigned as a teacher to any subjects yet. Please contact the
                      administrator.
                    </p>
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
                      <span className="text-[11px] px-2 py-1 rounded bg-primary-container/10 text-primary-container capitalize shrink-0">
                        {issue.issueStatus}
                      </span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant mt-1">
                      {issue.studentId?.firstName || 'Student'} {issue.studentId?.lastName || ''} •{' '}
                      {issue.topicId?.chapter?.subject?.subjectName || 'Subject'} •{' '}
                      {issue.topicId?.topicName || 'Topic'}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-1">{issue.issueDescription}</p>
                    {issue.response && (
                      <p className="text-xs text-primary-container mt-1">Outcome: {issue.response}</p>
                    )}
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleIssueStatus(issue._id, 'in-progress')}
                        className="text-xs font-semibold text-primary-container"
                      >
                        Set in-progress
                      </button>
                      <button
                        type="button"
                        onClick={() => handleIssueStatus(issue._id, 'resolved')}
                        className="text-xs font-semibold text-primary-container"
                      >
                        Resolve
                      </button>
                    </div>
                  </div>
                ))}
                {issues.length === 0 && (
                  <p className="text-sm text-on-surface-variant">No open issues right now.</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-outline/10 p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle size={18} className="text-primary-container" />
                <h4 className="font-bold">Student Questions (FR-16)</h4>
              </div>
              <div className="space-y-3 max-h-80 overflow-auto pr-1">
                {questions.slice(0, 20).map((q) => (
                  <div key={q._id} className="p-3 rounded-xl border border-outline/10 bg-surface">
                    <p className="font-semibold text-sm">{q.questionText}</p>
                    <p className="text-xs text-on-surface-variant mt-1">
                      {q.studentId?.firstName} {q.studentId?.lastName} •{' '}
                      {q.topicId?.topicName || 'Topic'}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <input
                        value={answerDrafts[q._id] || ''}
                        onChange={(e) =>
                          setAnswerDrafts((prev) => ({ ...prev, [q._id]: e.target.value }))
                        }
                        placeholder="Write answer..."
                        className="flex-1 border border-outline/20 rounded-lg px-3 py-2 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleAnswerQuestion(q._id)}
                        className="px-3 py-2 rounded-lg bg-primary-container text-white text-xs font-semibold inline-flex items-center gap-1"
                      >
                        <Send size={12} /> Reply
                      </button>
                    </div>
                  </div>
                ))}
                {questions.length === 0 && (
                  <p className="text-sm text-on-surface-variant">No questions yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'qa' && (
          <div className="bg-white rounded-2xl border border-outline/10 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
              <div>
                <h3 className="text-2xl font-bold">Q&A Management</h3>
                <p className="text-sm text-on-surface-variant mt-1">
                  Review student questions for your assigned subjects and post teacher replies.
                </p>
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
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-outline"
                  size={16}
                />
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
                    className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-colors ${
                      qaStatusFilter === filter.value
                        ? 'bg-primary-container text-white border-primary-container'
                        : 'bg-white text-on-surface-variant border-outline/20 hover:bg-surface'
                    }`}
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
                        <span
                          className={`text-[10px] px-2 py-1 rounded font-black uppercase tracking-widest ${
                            q.status === 'answered'
                              ? 'bg-primary-container/10 text-primary-container'
                              : 'bg-amber-500/10 text-amber-600'
                          }`}
                        >
                          {q.status === 'answered' ? 'Answered' : 'Open'}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-2">
                        {q.studentId?.firstName} {q.studentId?.lastName} •{' '}
                        {q.topicId?.topicName || 'Topic'}
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
                      onChange={(e) =>
                        setAnswerDrafts((prev) => ({ ...prev, [q._id]: e.target.value }))
                      }
                      placeholder="Write teacher answer..."
                      rows={2}
                      className="flex-1 border border-outline/20 rounded-xl px-3 py-2 text-sm resize-none bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleAnswerQuestion(q._id)}
                      disabled={!answerDrafts[q._id]?.trim()}
                      className="px-4 py-2 rounded-xl bg-primary-container text-white text-xs font-black uppercase tracking-widest inline-flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Send size={14} /> Reply
                    </button>
                  </div>
                </div>
              ))}
              {filteredQuestions.length === 0 && (
                <p className="text-sm text-on-surface-variant py-10 text-center">
                  No questions match the current filters.
                </p>
              )}
            </div>
          </div>
        )}

        {feedback && <p className="text-sm text-primary-container font-semibold mt-4">{feedback}</p>}
    </div>
  );
};

export default TeacherDashboardHome;
