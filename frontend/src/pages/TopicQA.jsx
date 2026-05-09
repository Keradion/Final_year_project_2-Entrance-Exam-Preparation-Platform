import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Edit2, HelpCircle, MessageSquareReply, Save, Send, Trash2, UserRound, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import {
  answerQuestion,
  askQuestion,
  deleteAnswer,
  deleteQuestion,
  getQuestionAnswers,
  listQuestions,
  updateAnswer,
  updateQuestion,
} from '../services/engagement';

const TopicQA = () => {
  const { topic } = useOutletContext();
  const { user } = useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  const [answersByQuestion, setAnswersByQuestion] = useState({});
  const [questionText, setQuestionText] = useState('');
  const [answerDrafts, setAnswerDrafts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
  const [submittingAnswerId, setSubmittingAnswerId] = useState('');
  const [editingQuestionId, setEditingQuestionId] = useState('');
  const [editingQuestionText, setEditingQuestionText] = useState('');
  const [editingAnswerId, setEditingAnswerId] = useState('');
  const [editingAnswerText, setEditingAnswerText] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const role = user?.role?.toLowerCase();
  const isStudent = role === 'student';
  const isTeacher = role === 'teacher';
  const currentUserId = user?.id || user?._id;

  const answeredCount = useMemo(
    () => questions.filter((question) => question.status === 'answered' || (answersByQuestion[question._id] || []).length > 0).length,
    [questions, answersByQuestion]
  );

  const fetchQuestions = async () => {
    if (!topic?._id) return;
    try {
      setIsLoading(true);
      setError('');
      const response = await listQuestions({ topicId: topic._id, limit: 100 });
      const questionList = response?.data || [];
      setQuestions(questionList);

      const answerEntries = await Promise.all(
        questionList.map(async (question) => {
          try {
            const answerResponse = await getQuestionAnswers(question._id);
            return [question._id, answerResponse?.data || []];
          } catch (_err) {
            return [question._id, []];
          }
        })
      );
      setAnswersByQuestion(Object.fromEntries(answerEntries));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load questions.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [topic?._id]);

  const handleAskQuestion = async (event) => {
    event.preventDefault();
    if (!questionText.trim()) return;

    try {
      setIsSubmittingQuestion(true);
      setError('');
      await askQuestion({
        topicId: topic._id,
        questionText: questionText.trim(),
      });
      setQuestionText('');
      setMessage('Your question was posted for the teacher.');
      await fetchQuestions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post question.');
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  const handleAnswerQuestion = async (questionId) => {
    const answerText = answerDrafts[questionId]?.trim();
    if (!answerText) return;

    try {
      setSubmittingAnswerId(questionId);
      setError('');
      await answerQuestion(questionId, { answerText });
      setAnswerDrafts((prev) => ({ ...prev, [questionId]: '' }));
      setMessage('Answer posted successfully.');
      await fetchQuestions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post answer.');
    } finally {
      setSubmittingAnswerId('');
    }
  };

  const handleUpdateQuestion = async (questionId) => {
    if (!editingQuestionText.trim()) return;
    try {
      setError('');
      await updateQuestion(questionId, { questionText: editingQuestionText.trim() });
      setEditingQuestionId('');
      setEditingQuestionText('');
      setMessage('Question updated successfully.');
      await fetchQuestions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update question.');
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Delete this question and all teacher replies?')) return;
    try {
      setError('');
      await deleteQuestion(questionId);
      setMessage('Question deleted successfully.');
      await fetchQuestions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete question.');
    }
  };

  const handleUpdateAnswer = async (questionId, answerId) => {
    if (!editingAnswerText.trim()) return;
    try {
      setError('');
      await updateAnswer(questionId, answerId, { answerText: editingAnswerText.trim() });
      setEditingAnswerId('');
      setEditingAnswerText('');
      setMessage('Answer updated successfully.');
      await fetchQuestions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update answer.');
    }
  };

  const handleDeleteAnswer = async (questionId, answerId) => {
    if (!window.confirm('Delete this teacher reply?')) return;
    try {
      setError('');
      await deleteAnswer(questionId, answerId);
      setMessage('Answer deleted successfully.');
      await fetchQuestions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete answer.');
    }
  };

  return (
    <div className="py-4 sm:py-6 space-y-6 animate-in slide-in-from-bottom-4 duration-500 w-full min-w-0 overflow-x-hidden">
      <div className="bg-white rounded-2xl border border-outline-variant p-4 sm:p-6 md:p-8 shadow-sm min-w-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="w-12 h-12 rounded-2xl bg-primary-container/10 text-primary-container flex items-center justify-center shrink-0">
              <HelpCircle size={24} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-outline">Topic Q&A</p>
              <h3 className="text-xl sm:text-2xl font-black text-on-surface mt-1 break-words">Questions and Teacher Answers</h3>
              <p className="text-sm text-on-surface-variant mt-2">
                Students ask topic questions here. Teachers provide answers and replies under each question.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-3 text-center shrink-0 w-full sm:w-auto min-w-0">
            <div className="rounded-xl bg-surface border border-outline/10 px-3 sm:px-5 py-3 min-w-0">
              <p className="text-xl font-black text-on-surface">{questions.length}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Questions</p>
            </div>
            <div className="rounded-xl bg-primary-container/10 border border-primary-container/10 px-3 sm:px-5 py-3 min-w-0">
              <p className="text-xl font-black text-primary-container">{answeredCount}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary-container">Answered</p>
            </div>
          </div>
        </div>

        {message && <div className="mt-5 rounded-xl bg-primary-container/10 text-primary-container px-4 py-3 text-sm font-semibold">{message}</div>}
        {error && <div className="mt-5 rounded-xl bg-error/10 text-error px-4 py-3 text-sm font-semibold">{error}</div>}

        {isStudent && (
          <form onSubmit={handleAskQuestion} className="mt-6 rounded-2xl border border-outline/10 bg-surface/50 p-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline">Ask a question</label>
            <textarea
              value={questionText}
              onChange={(event) => setQuestionText(event.target.value)}
              placeholder="Write your question about this topic..."
              rows={4}
              className="mt-3 w-full rounded-xl border border-outline/20 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-primary-container resize-none"
            />
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={isSubmittingQuestion || !questionText.trim()}
                className="bg-primary-container text-white px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-50 flex items-center gap-2"
              >
                <Send size={16} />
                {isSubmittingQuestion ? 'Posting...' : 'Post Question'}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => <div key={item} className="h-28 rounded-2xl bg-surface animate-pulse" />)}
          </div>
        ) : questions.length > 0 ? (
          questions.map((question) => {
            const answers = answersByQuestion[question._id] || [];
            const canManageQuestion = isStudent && question.studentId?._id === currentUserId;
            const isAnswered = question.status === 'answered' || answers.length > 0;
            return (
              <div key={question._id} className="bg-white rounded-2xl border border-outline-variant p-4 sm:p-6 shadow-sm min-w-0">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-outline/10 flex items-center justify-center text-primary-container shrink-0">
                    <UserRound size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <p className="text-sm font-bold text-on-surface">
                        {question.studentId?.firstName || 'Student'} {question.studentId?.lastName || ''}
                      </p>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg w-fit ${isAnswered ? 'bg-primary-container/10 text-primary-container' : 'bg-amber-500/10 text-amber-600'}`}>
                        {isAnswered ? `Answered${answers.length > 1 ? ` • ${answers.length} replies` : ''}` : 'Awaiting answer'}
                      </span>
                    </div>
                    {editingQuestionId === question._id ? (
                      <div className="mt-3 space-y-3">
                        <textarea
                          value={editingQuestionText}
                          onChange={(event) => setEditingQuestionText(event.target.value)}
                          rows={3}
                          className="w-full rounded-xl border border-outline/20 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-primary-container resize-none"
                        />
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => handleUpdateQuestion(question._id)} className="px-4 py-2 rounded-lg bg-primary-container text-white text-xs font-bold inline-flex items-center gap-2">
                            <Save size={14} /> Save
                          </button>
                          <button type="button" onClick={() => { setEditingQuestionId(''); setEditingQuestionText(''); }} className="px-4 py-2 rounded-lg border border-outline/20 text-xs font-bold inline-flex items-center gap-2">
                            <X size={14} /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-3 text-base leading-8 font-semibold text-on-surface break-words">{question.questionText}</p>
                    )}
                    {canManageQuestion && editingQuestionId !== question._id && (
                      <div className="mt-3 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => { setEditingQuestionId(question._id); setEditingQuestionText(question.questionText); }}
                          className="text-xs font-bold text-primary-container inline-flex items-center gap-1"
                        >
                          <Edit2 size={14} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteQuestion(question._id)}
                          className="text-xs font-bold text-error inline-flex items-center gap-1"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 ml-0 md:ml-14 space-y-3">
                  {answers.map((answer) => {
                    const canManageAnswer = isTeacher && answer.teacherId?._id === currentUserId;
                    return (
                    <div key={answer._id} className="rounded-2xl bg-primary-container/[0.04] border border-primary-container/10 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquareReply size={16} className="text-primary-container" />
                        <p className="text-xs font-black uppercase tracking-widest text-primary-container">
                          Teacher reply
                        </p>
                        <span className="text-xs text-on-surface-variant">
                          {answer.teacherId?.firstName || 'Teacher'} {answer.teacherId?.lastName || ''}
                        </span>
                      </div>
                      {editingAnswerId === answer._id ? (
                        <div className="space-y-3">
                          <textarea
                            value={editingAnswerText}
                            onChange={(event) => setEditingAnswerText(event.target.value)}
                            rows={3}
                            className="w-full rounded-xl border border-outline/20 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-primary-container resize-none"
                          />
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => handleUpdateAnswer(question._id, answer._id)} className="px-4 py-2 rounded-lg bg-primary-container text-white text-xs font-bold inline-flex items-center gap-2">
                              <Save size={14} /> Save
                            </button>
                            <button type="button" onClick={() => { setEditingAnswerId(''); setEditingAnswerText(''); }} className="px-4 py-2 rounded-lg border border-outline/20 text-xs font-bold inline-flex items-center gap-2">
                              <X size={14} /> Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm leading-7 text-on-surface-variant whitespace-pre-line">{answer.answerText}</p>
                      )}
                      {canManageAnswer && editingAnswerId !== answer._id && (
                        <div className="mt-3 flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => { setEditingAnswerId(answer._id); setEditingAnswerText(answer.answerText); }}
                            className="text-xs font-bold text-primary-container inline-flex items-center gap-1"
                          >
                            <Edit2 size={14} /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAnswer(question._id, answer._id)}
                            className="text-xs font-bold text-error inline-flex items-center gap-1"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  );})}

                  {isTeacher && (
                    <div className="rounded-2xl border border-outline/10 bg-surface/50 p-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline">Teacher answer</label>
                      <textarea
                        value={answerDrafts[question._id] || ''}
                        onChange={(event) => setAnswerDrafts((prev) => ({ ...prev, [question._id]: event.target.value }))}
                        placeholder="Write an answer or follow-up reply..."
                        rows={3}
                        className="mt-3 w-full rounded-xl border border-outline/20 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-primary-container resize-none"
                      />
                      <div className="mt-3 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleAnswerQuestion(question._id)}
                          disabled={submittingAnswerId === question._id || !answerDrafts[question._id]?.trim()}
                          className="bg-primary-container text-white px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-50"
                        >
                          {submittingAnswerId === question._id ? 'Posting...' : 'Post Answer'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 rounded-2xl border border-dashed border-outline/20 bg-surface/50 text-center">
            <HelpCircle size={42} className="mx-auto text-outline mb-3" />
            <p className="font-bold text-on-surface">No questions yet.</p>
            <p className="text-sm text-on-surface-variant mt-1">Student questions for this topic will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicQA;
