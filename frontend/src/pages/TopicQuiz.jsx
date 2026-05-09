import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { BrainCircuit, Trash2, Plus, ChevronLeft, Save, CheckCircle2, ListChecks, HelpCircle, Edit2 } from 'lucide-react';
import api from '../services/api';

const TopicQuiz = () => {
  const { topic, isStudent } = useOutletContext();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState(null); // When editing a specific quiz
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState({});
  const [quizFeedback, setQuizFeedback] = useState({});
  const [isSubmittingAttempt, setIsSubmittingAttempt] = useState(false);

  // Quiz Meta State
  const [quizMeta, setQuizMeta] = useState({ title: '', description: '', duration: 30 });

  // Student Attempt State
  const [attemptStarted, setAttemptStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [quizResults, setQuizResults] = useState(null);
  const [isStarting, setIsStarting] = useState(false);
  
  // New Problem State
  const [newProblem, setNewProblem] = useState({
    questionText: '',
    choices: [
      { text: '', value: 'A' },
      { text: '', value: 'B' },
      { text: '', value: 'C' },
      { text: '', value: 'D' }
    ],
    correctAnswer: 'A',
    answerExplanation: ''
  });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/quizzes/topics/${topic._id}/quizzes`);
      setQuizzes(res.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch quizzes', err);
    } finally {
      setLoading(false);
    }
  };

  const hydrateCompletedAttempt = (userScore) => {
    if (!userScore) return;
    setQuizResults(userScore);
    setAttemptStarted(false);
    setTimeLeft(0);

    const answerMap = {};
    if (Array.isArray(userScore.answers)) {
      userScore.answers.forEach((ans) => {
        if (ans?.problemId != null) answerMap[String(ans.problemId)] = ans.answer;
      });
    }
    setSelectedQuizAnswers(answerMap);

    const dr = userScore.detailedResults;
    const feedbackObj = {};
    if (dr != null && typeof dr === 'object') {
      if (Array.isArray(dr)) {
        dr.forEach((row) => {
          if (row?.problemId != null) feedbackObj[String(row.problemId)] = row;
        });
      } else {
        Object.entries(dr).forEach(([problemId, row]) => {
          feedbackObj[String(problemId)] = row;
        });
      }
    }
    setQuizFeedback(feedbackObj);
  };

  const resetStudentAttemptState = () => {
    setAttemptStarted(false);
    setQuizResults(null);
    setSelectedQuizAnswers({});
    setQuizFeedback({});
    setTimeLeft(0);
  };

  const exitQuizView = () => {
    resetStudentAttemptState();
    setActiveQuiz(null);
    fetchQuizzes();
  };

  const fetchQuizDetails = async (quizId) => {
    try {
      setLoading(true);
      resetStudentAttemptState();

      const res = await api.get(`/quizzes/${quizId}`);
      const quizData = res.data.data;
      setActiveQuiz(quizData);

      const us = quizData.userScore;
      if (isStudent && us?.status === 'completed') {
        hydrateCompletedAttempt(us);
      }
    } catch (err) {
      showToast('Failed to load quiz details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (topic?._id) fetchQuizzes();
  }, [topic?._id]);

  useEffect(() => {
    let timer;
    if (attemptStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitQuizAttempt(true); // Auto submit when time is up
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [attemptStarted, timeLeft]);

  // FR. 4: Reset if closed in between
  useEffect(() => {
    const handleBeforeUnload = async (e) => {
      if (attemptStarted && !quizResults) {
        // We can't really await here, but we can try a beacon or just let the backend handle it on next start
        // Actually, the requirement says "if the quiz has closed in between reset the score to zero"
        // Let's use navigator.sendBeacon if possible
        if (activeQuiz) {
          const url = `${api.defaults.baseURL}/quizzes/${activeQuiz._id}/reset`;
          const token = localStorage.getItem('token');
          // sendBeacon doesn't support headers easily, but we can pass token in URL or just hope the session persists
          // For now, let's just use a simple fetch with keepalive
          fetch(url, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            keepalive: true
          });
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [attemptStarted, quizResults, activeQuiz]);

  const handleCreateQuiz = async () => {
    if (!quizMeta.title.trim()) {
      return showToast('Quiz title is required.', 'error');
    }
    setIsSaving(true);
    try {
      const res = await api.post('/quizzes', { 
        title: quizMeta.title.trim(),
        description: quizMeta.description.trim(),
        duration: quizMeta.duration,
        topic: topic._id 
      });
      showToast('Assessment container initialized successfully!');
      setActiveQuiz({ ...res.data.data, problems: [] });
      setQuizMeta({ title: '', description: '', duration: 30 });
      fetchQuizzes();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create quiz container.';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const [editingProblemId, setEditingProblemId] = useState(null);

  const handleEditProblem = (prob) => {
    setEditingProblemId(prob._id);
    setNewProblem({
      questionText: prob.questionText,
      choices: prob.choices.map(c => ({ text: c.text, value: c.value })),
      correctAnswer: prob.correctAnswer,
      answerExplanation: prob.answerExplanation || ''
    });
    // Scroll to form if needed, though usually the list is on the right
  };

  const handleCancelProblemEdit = () => {
    setEditingProblemId(null);
    setNewProblem({
      questionText: '',
      choices: [
        { text: '', value: 'A' },
        { text: '', value: 'B' },
        { text: '', value: 'C' },
        { text: '', value: 'D' }
      ],
      correctAnswer: 'A',
      answerExplanation: ''
    });
  };

  const handleAddProblem = async () => {
    if (!newProblem.questionText.trim()) {
      return showToast('Question statement is required.', 'error');
    }
    if (newProblem.choices.some(c => !c.text.trim())) {
      return showToast('All answer choices must have content.', 'error');
    }

    setIsSaving(true);
    try {
      if (editingProblemId) {
        const res = await api.put(`/quizzes/${activeQuiz._id}/problems/${editingProblemId}`, {
          ...newProblem,
          questionText: newProblem.questionText.trim(),
          choices: newProblem.choices.map(c => ({ ...c, text: c.text.trim() })),
          answerExplanation: newProblem.answerExplanation.trim()
        });
        showToast('Question updated successfully!');
        setActiveQuiz({
          ...activeQuiz,
          problems: activeQuiz.problems.map(p => p._id === editingProblemId ? res.data.data : p)
        });
      } else {
        const res = await api.post(`/quizzes/${activeQuiz._id}/problems`, {
          ...newProblem,
          questionText: newProblem.questionText.trim(),
          choices: newProblem.choices.map(c => ({ ...c, text: c.text.trim() })),
          answerExplanation: newProblem.answerExplanation.trim()
        });
        showToast('New challenge added to the quiz!');
        setActiveQuiz({
          ...activeQuiz,
          problems: [...activeQuiz.problems, res.data.data]
        });
      }
      handleCancelProblemEdit();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to process question.';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateQuiz = async () => {
    if (!quizMeta.title.trim()) return showToast('Quiz title is required.', 'error');
    setIsSaving(true);
    try {
      await api.put(`/quizzes/${activeQuiz._id}`, {
        title: quizMeta.title.trim(),
        description: quizMeta.description.trim(),
        duration: quizMeta.duration
      });
      showToast('Quiz updated successfully!');
      setActiveQuiz({ ...activeQuiz, title: quizMeta.title, description: quizMeta.description, duration: quizMeta.duration });
      setEditingId(null);
    } catch (err) {
      showToast('Update failed', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const [editingId, setEditingId] = useState(null); // Reuse editingId for quiz meta

  const handleDeleteQuiz = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('WARNING: This will permanently delete the entire quiz and all associated questions. Proceed?')) return;
    try {
      await api.delete(`/quizzes/${id}`);
      showToast('Quiz and all its content purged.');
      fetchQuizzes();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete quiz.';
      showToast(msg, 'error');
    }
  };

  const handleDeleteProblem = async (problemId) => {
    if (!window.confirm('Are you sure you want to remove this question from the quiz?')) return;
    try {
      await api.delete(`/quizzes/${activeQuiz._id}/problems/${problemId}`);
      setActiveQuiz({
        ...activeQuiz,
        problems: activeQuiz.problems.filter(p => p._id !== problemId)
      });
      showToast('Question successfully removed.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to remove question.';
      showToast(msg, 'error');
    }
  };

  const handleStartQuiz = async () => {
    try {
      setIsStarting(true);
      const res = await api.post(`/quizzes/${activeQuiz._id}/start`);
      setAttemptStarted(true);
      setTimeLeft((activeQuiz.duration || 30) * 60);
      setSelectedQuizAnswers({});
      setQuizFeedback({});
      setQuizResults(null);
      showToast('Quiz started! Good luck.');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to start quiz.', 'error');
    } finally {
      setIsStarting(false);
    }
  };

  const handleSubmitQuizAttempt = async (isAutoSubmit = false) => {
    // Check if all questions are answered
    const unansweredCount = activeQuiz.problems.filter(p => !selectedQuizAnswers[p._id]).length;
    
    // Only block if it's a manual submit and there are unanswered questions
    if (!isAutoSubmit && unansweredCount > 0) {
      showToast(`Please answer all questions before submitting. (${unansweredCount} remaining)`, 'error');
      return;
    }

    try {
      setIsSubmittingAttempt(true);
      const formattedAnswers = Object.entries(selectedQuizAnswers).map(([problemId, submittedAnswer]) => ({
        problemId,
        submittedAnswer
      }));

      const res = await api.post(`/quizzes/${activeQuiz._id}/submit`, {
        answers: formattedAnswers
      });

      const { score, detailedResults, message } = res.data.data;
      setQuizResults(res.data.data);
      setAttemptStarted(false);

      if (detailedResults) {
        const feedbackObj = {};
        if (Array.isArray(detailedResults)) {
          detailedResults.forEach((r) => {
            if (r?.problemId != null) feedbackObj[String(r.problemId)] = r;
          });
        } else {
          Object.entries(detailedResults).forEach(([k, v]) => {
            feedbackObj[String(k)] = v;
          });
        }
        setQuizFeedback(feedbackObj);
      }

      // Trigger sidebar/dashboard progress refresh
      window.dispatchEvent(new CustomEvent('student-progress-refresh'));
      
      showToast(message || 'Assessment submitted successfully!', score >= 50 ? 'success' : 'error');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit quiz attempt.', 'error');
    } finally {
      setIsSubmittingAttempt(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRetryIncorrectQuiz = () => {
    const incorrectIds = Object.entries(quizFeedback)
      .filter(([, feedback]) => feedback && !feedback.isCorrect)
      .map(([id]) => id);

    setQuizFeedback((prev) => {
      const next = { ...prev };
      incorrectIds.forEach((id) => delete next[id]);
      return next;
    });
    setSelectedQuizAnswers((prev) => {
      const next = { ...prev };
      incorrectIds.forEach((id) => delete next[id]);
      return next;
    });
  };

  if (activeQuiz) {
    if (isStudent && !attemptStarted && !quizResults) {
      return (
        <div className="w-full min-w-0 px-4 py-12 sm:py-20 flex flex-col items-center justify-center space-y-6 sm:space-y-8 animate-in zoom-in-95 duration-500">
           <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary-container/10 rounded-full flex items-center justify-center text-primary-container border border-primary-container/20 shrink-0">
             <BrainCircuit className="w-10 h-10 sm:w-12 sm:h-12 shrink-0" aria-hidden />
           </div>
           <div className="text-center space-y-4 max-w-md w-full min-w-0">
             <h2 className="text-2xl sm:text-3xl font-bold text-on-surface break-words px-1">{activeQuiz.title}</h2>
             <p className="text-on-surface-variant font-medium text-sm sm:text-base break-words px-1">{activeQuiz.description || 'No instructions provided.'}</p>
             <div className="flex items-center justify-center gap-6 mt-6">
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-outline">Duration</p>
                  <p className="text-lg font-bold text-on-surface">{activeQuiz.duration} mins</p>
                </div>
                <div className="w-px h-8 bg-outline/10"></div>
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-outline">Questions</p>
                  <p className="text-lg font-bold text-on-surface">{activeQuiz.problems?.length || 0}</p>
                </div>
             </div>
           </div>
            <button 
                type="button"
                onClick={handleStartQuiz}
                disabled={isStarting}
                className="w-full sm:w-auto bg-primary-container text-on-primary px-8 sm:px-12 py-3.5 sm:py-4 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary-container/20 hover:scale-105 transition-all disabled:opacity-50 min-h-11"
              >
                {isStarting ? 'Preparing...' : 'Start Assessment'}
              </button>
           <button type="button" onClick={exitQuizView} className="text-outline hover:text-on-surface font-bold text-[10px] sm:text-xs uppercase tracking-widest transition-colors">
             Maybe Later
           </button>
        </div>
      );
    }

    return (
      <div className="py-4 sm:py-6 space-y-6 sm:space-y-8 animate-in fade-in duration-500 relative w-full min-w-0 overflow-x-hidden">
        <div className="sticky top-0 z-[60] bg-white/90 backdrop-blur-md py-3 sm:py-4 -mx-3 px-3 sm:-mx-4 sm:px-4 border-b border-outline/5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 transition-all min-w-0">
          <button 
            type="button"
            onClick={exitQuizView}
            disabled={attemptStarted && !quizResults}
            className={`flex items-center gap-2 text-outline hover:text-on-surface font-bold text-[10px] sm:text-xs uppercase tracking-widest transition-colors shrink-0 min-h-11 ${attemptStarted && !quizResults ? 'opacity-20 pointer-events-none' : ''}`}
          >
            <ChevronLeft size={16} /> <span className="hidden sm:inline">Back to {isStudent ? 'Assessments' : 'Quizzes'}</span>
            <span className="sm:hidden">Back</span>
          </button>
          {isStudent && quizResults && (
            <div className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full shadow-sm border shrink-0 ${
              quizResults.score >= 50 ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-error/5 border-error/10'
            }`}>
              <p className={`text-[10px] sm:text-sm font-black uppercase tracking-widest ${quizResults.score >= 50 ? 'text-emerald-600' : 'text-error'}`}>
                {quizResults.score >= 50 ? 'Passed' : 'Submitted'}
              </p>
              <p className="text-sm sm:text-lg font-black text-on-surface">{Math.round(quizResults.score)}%</p>
            </div>
          )}
          {isStudent && attemptStarted && !quizResults && (
            <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-2 sm:gap-4 bg-error/5 border border-error/10 px-3 sm:px-6 py-1.5 sm:py-2 rounded-full shadow-sm">
                <p className="text-[10px] sm:text-sm font-black uppercase tracking-widest text-error/60">Time</p>
                <p className={`text-sm sm:text-lg font-mono font-bold ${timeLeft < 60 ? 'text-error animate-pulse' : 'text-on-surface'}`}>{formatTime(timeLeft)}</p>
              </div>
              <button
                type="button"
                onClick={() => handleSubmitQuizAttempt(false)}
                disabled={isSubmittingAttempt}
                className="flex items-center gap-2 bg-primary-container text-on-primary px-4 sm:px-8 py-2 sm:py-3 rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-widest hover:brightness-110 disabled:opacity-50 transition-all shadow-lg shadow-primary-container/20"
              >
                {isSubmittingAttempt ? '...' : 'Submit'}
              </button>
            </div>
          )}
        </div>

        {isStudent && quizResults && (
          <div className={`p-6 sm:p-8 rounded-2xl border ${quizResults.score >= 50 ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-error/5 border-error/20'} animate-in slide-in-from-top-4 duration-500`}>
             <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
                <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 flex items-center justify-center text-2xl sm:text-3xl font-black ${quizResults.score >= 50 ? 'border-emerald-500/20 text-emerald-600 bg-white' : 'border-error/20 text-error bg-white'}`}>
                  {Math.round(quizResults.score)}%
                </div>
                <div className="flex-grow space-y-2 text-center md:text-left">
                  <h3 className={`text-xl sm:text-2xl font-bold ${quizResults.score >= 50 ? 'text-emerald-700' : 'text-error'}`}>
                    {quizResults.score >= 50 ? 'Assessment Passed!' : 'Retry Required'}
                  </h3>
                  <p className="text-sm sm:text-base text-on-surface-variant font-medium">
                    {quizResults.message || (quizResults.score >= 50
                      ? 'You have already completed this assessment. Review your answers below.'
                      : 'You have already submitted this attempt. Review your answers below, or retry for a new attempt.')}
                  </p>
                </div>
                {quizResults.score < 50 && (
                  <button 
                    onClick={handleStartQuiz}
                    className="w-full sm:w-auto bg-error text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-error/20"
                  >
                    Retry Quiz
                  </button>
                )}
                {quizResults.score >= 50 && (
                  <div className="w-full sm:w-auto justify-center bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 size={16} /> Topic Completed
                  </div>
                )}
             </div>
          </div>
        )}

        <div className={`grid grid-cols-1 ${isStudent ? '' : 'lg:grid-cols-2'} gap-6 sm:gap-10 min-w-0 w-full`}>
          {/* Problem Creator or Meta Editor */}
          {!isStudent && (
            <div className="bg-white p-4 sm:p-8 md:p-10 rounded-xl border border-outline-variant shadow-[0px_8px_24px_rgba(0,0,0,0.08)] space-y-6 sm:space-y-8 h-fit min-w-0">
            {editingId === activeQuiz._id ? (
               <div className="space-y-6 animate-in slide-in-from-top-2">
                 <h3 className="text-2xl font-bold text-on-surface mb-6">Edit Quiz Details</h3>
                 <div className="space-y-2">
                   <label className="text-xs font-black uppercase tracking-widest text-outline ml-1">Quiz Title</label>
                   <input 
                     value={quizMeta.title} 
                     onChange={e => setQuizMeta({...quizMeta, title: e.target.value})}
                     className="w-full bg-white border border-outline/20 px-6 py-4 rounded-xl font-bold text-on-surface focus:border-primary-container outline-none"
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-xs font-black uppercase tracking-widest text-outline ml-1">Description</label>
                   <textarea 
                     value={quizMeta.description} 
                     onChange={e => setQuizMeta({...quizMeta, description: e.target.value})}
                     className="w-full bg-white border border-outline/20 px-6 py-4 rounded-xl font-medium text-on-surface focus:border-primary-container outline-none"
                     rows="3"
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-xs font-black uppercase tracking-widest text-outline ml-1">Duration (minutes)</label>
                   <input 
                     type="number"
                     value={quizMeta.duration} 
                     onChange={e => setQuizMeta({...quizMeta, duration: parseInt(e.target.value) || 0})}
                     className="w-full bg-white border border-outline/20 px-6 py-4 rounded-xl font-bold text-on-surface focus:border-primary-container outline-none"
                   />
                 </div>
                 <div className="flex gap-3">
                   <button onClick={() => setEditingId(null)} className="flex-grow bg-surface border border-outline/10 py-3 rounded-xl font-bold text-xs uppercase tracking-widest">Cancel</button>
                   <button onClick={handleUpdateQuiz} className="flex-grow bg-primary-container text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest">Save Changes</button>
                 </div>
               </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                   <div>
                     <div className="flex items-center gap-3">
                       <h3 className="text-2xl font-bold text-on-surface">{editingProblemId ? 'Edit Question' : 'Add Question'}</h3>
                       {!editingProblemId && (
                         <button 
                           onClick={() => { setEditingId(activeQuiz._id); setQuizMeta({ title: activeQuiz.title, description: activeQuiz.description, duration: activeQuiz.duration }); }}
                           className="p-1.5 rounded-lg text-outline hover:text-primary-container hover:bg-primary-container/5 transition-all"
                         >
                           <Edit2 size={16} />
                         </button>
                       )}
                    </div>
                     <p className="text-on-surface-variant/60 text-sm font-medium mt-1">Building: <span className="text-primary-container">{activeQuiz.title}</span></p>
                   </div>
                   <div className="w-14 h-14 bg-primary-container/5 rounded-xl flex items-center justify-center text-primary-container border border-primary-container/10">
                     <HelpCircle size={28} />
                   </div>
                </div>

               <div className="space-y-6">
                 <div className="space-y-2">
                   <label className="text-xs font-black uppercase tracking-widest text-outline ml-1">Question Text</label>
                   <textarea 
                     value={newProblem.questionText} 
                     onChange={e => setNewProblem({...newProblem, questionText: e.target.value})} 
                     placeholder="e.g. Which of the following is..." 
                     rows="3"
                     className="w-full bg-white border border-outline/20 px-6 py-4 rounded-xl font-bold text-on-surface focus:border-primary-container outline-none transition-all shadow-sm" 
                   />
                 </div>
 
                 <div className="space-y-4">
                   <label className="text-xs font-black uppercase tracking-widest text-outline ml-1">Choices & Correct Answer</label>
                   <div className="grid grid-cols-1 gap-3">
                     {newProblem.choices.map((choice, i) => (
                       <div key={choice.value} className="flex items-center gap-2 sm:gap-4 min-w-0">
                         <div className={`w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-lg flex items-center justify-center font-black text-xs border transition-all ${newProblem.correctAnswer === choice.value ? 'bg-primary-container text-white border-primary-container' : 'bg-surface text-outline border-outline/10'}`}>
                           {choice.value}
                         </div>
                         <input 
                           value={choice.text} 
                           onChange={e => {
                             const newChoices = [...newProblem.choices];
                             newChoices[i].text = e.target.value;
                             setNewProblem({...newProblem, choices: newChoices});
                           }} 
                           placeholder={`Option ${choice.value}`} 
                           className={`min-w-0 flex-1 bg-white border px-3 sm:px-5 py-3 rounded-xl font-semibold text-sm outline-none transition-all shadow-sm ${newProblem.correctAnswer === choice.value ? 'border-primary-container ring-1 ring-primary-container/20' : 'border-outline/20 focus:border-primary-container/40'}`} 
                         />
                         <input 
                           type="radio" 
                           name="correctAnswer" 
                           checked={newProblem.correctAnswer === choice.value} 
                           onChange={() => setNewProblem({...newProblem, correctAnswer: choice.value})} 
                           className="w-5 h-5 shrink-0 accent-primary-container cursor-pointer"
                         />
                       </div>
                     ))}
                   </div>
                 </div>
 
                 <div className="space-y-2">
                   <label className="text-xs font-black uppercase tracking-widest text-outline ml-1">Answer Explanation (Optional)</label>
                   <textarea 
                     value={newProblem.answerExplanation} 
                     onChange={e => setNewProblem({...newProblem, answerExplanation: e.target.value})} 
                     placeholder="Explain why this answer is correct..." 
                     rows="2"
                     className="w-full bg-white border border-outline/20 px-6 py-4 rounded-xl font-medium text-sm text-on-surface-variant focus:border-primary-container outline-none transition-all shadow-sm" 
                   />
                 </div>
 
                 <div className="flex gap-4">
                   {editingProblemId && (
                     <button 
                       onClick={handleCancelProblemEdit} 
                       className="flex-grow bg-white border border-outline/20 text-on-surface py-5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-surface transition-all"
                     >
                       Cancel
                     </button>
                   )}
                   <button 
                     onClick={handleAddProblem} 
                     disabled={isSaving || !newProblem.questionText} 
                     className={`flex-grow ${editingProblemId ? 'bg-primary-container' : 'bg-on-surface'} text-white py-5 rounded-xl font-bold text-xs uppercase tracking-widest hover:brightness-110 active:opacity-80 transition-all shadow-xl shadow-on-surface/10 disabled:opacity-50 flex items-center justify-center gap-3`}
                   >
                     {editingProblemId ? <Save size={20} /> : <Plus size={20} />} {isSaving ? 'Processing...' : (editingProblemId ? 'Update Question' : 'Add to Quiz')}
                   </button>
                 </div>
               </div>
              </>
            )}
          </div>
          )}

          {/* Current Problems List */}
          <div className="space-y-6">
             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-2">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-outline">{isStudent ? 'Assessment Problems' : 'Quiz Questions'} ({activeQuiz.problems?.length || 0})</h4>
             </div>
             
             {activeQuiz.problems?.length > 0 ? (
               <div className="space-y-4">
                 {activeQuiz.problems.map((prob, idx) => {
                  const pid = String(prob._id);
                  const feedback = quizFeedback[pid];
                  const hasFeedback = Boolean(feedback);
                  return (
                    <div key={prob._id} className="bg-white rounded-xl border border-outline-variant p-4 sm:p-6 shadow-sm group">
                      <div className="flex justify-between items-start gap-4 mb-4">
                         <div className="flex gap-3 sm:gap-4">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-surface rounded-lg flex items-center justify-center text-[10px] sm:text-xs font-black text-outline border border-outline/5 shrink-0">
                              {idx + 1}
                            </div>
                            <p className="font-bold text-sm sm:text-base text-on-surface leading-tight break-words min-w-0">{prob.questionText}</p>
                         </div>
                         {!isStudent && (
                           <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                             <button 
                               onClick={() => handleEditProblem(prob)} 
                               className="text-outline hover:text-primary-container p-1.5 hover:bg-primary-container/5 rounded-lg"
                               title="Edit Question"
                             >
                               <Edit2 size={16} />
                             </button>
                             <button 
                               onClick={() => handleDeleteProblem(prob._id)} 
                               className="text-outline hover:text-error p-1.5 hover:bg-error/5 rounded-lg"
                               title="Delete Question"
                             >
                               <Trash2 size={16} />
                             </button>
                           </div>
                         )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:pl-12">
                         {prob.choices.map(c => (
                           <button
                             key={c.value}
                             type="button"
                             disabled={!isStudent || !attemptStarted || hasFeedback || quizResults}
                             onClick={() => setSelectedQuizAnswers((prev) => ({ ...prev, [pid]: c.value }))}
                             className={`px-3 py-2 rounded-lg border text-[11px] sm:text-xs font-bold text-left transition-all break-words ${
                               isStudent
                                 ? hasFeedback
                                   ? c.value === feedback.correctAnswer
                                     ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-700'
                                     : selectedQuizAnswers[pid] === c.value
                                       ? 'bg-error/5 border-error/20 text-error'
                                       : 'bg-surface/50 border-outline/5 text-outline'
                                   : selectedQuizAnswers[pid] === c.value
                                     ? 'bg-primary-container/5 border-primary-container/20 text-primary-container'
                                     : 'bg-surface/50 border-outline/5 text-outline hover:border-primary-container/20'
                                 : c.value === prob.correctAnswer
                                   ? 'bg-primary-container/5 border-primary-container/20 text-primary-container'
                                   : 'bg-surface/50 border-outline/5 text-outline'
                             }`}
                           >
                             {c.value}: {c.text}
                           </button>
                         ))}
                      </div>
                      {isStudent && hasFeedback && (
                       <div className={`sm:ml-12 mt-4 rounded-xl border px-4 py-3 ${feedback.isCorrect ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-700' : 'bg-error/5 border-error/20 text-error'}`}>
                         <p className="text-xs sm:text-sm font-bold">
                           {feedback.isCorrect ? 'Correct answer.' : `Incorrect. Correct answer: ${feedback.correctAnswer}`}
                         </p>
                         {!feedback.isCorrect && feedback.answerExplanation && (
                           <p className="text-[10px] sm:text-xs mt-1 opacity-80">{feedback.answerExplanation}</p>
                         )}
                       </div>
                      )}
                    </div>
                  );
                 })}
                 
                 {isStudent && attemptStarted && !quizResults && activeQuiz.problems?.length > 0 && (
                   <div className="mt-12 pt-10 border-t border-outline/5 flex flex-col items-center gap-6">
                     <div className="text-center space-y-2">
                       <h5 className="text-lg font-bold text-on-surface">Ready to finish?</h5>
                       <p className="text-sm text-on-surface-variant max-w-xs mx-auto">Make sure you've answered all questions. You cannot change your answers after submitting.</p>
                     </div>
                     <button
                       onClick={() => handleSubmitQuizAttempt(false)}
                       disabled={isSubmittingAttempt}
                       className="w-full sm:w-auto bg-primary-container text-white px-12 py-4 rounded-xl font-bold text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary-container/20 hover:scale-105 transition-all disabled:opacity-50"
                     >
                       {isSubmittingAttempt ? 'Submitting...' : 'Complete & Submit Assessment'}
                     </button>
                   </div>
                 )}
               </div>
             ) : (
               <div className="bg-surface/50 border border-dashed border-outline/20 rounded-xl py-32 text-center opacity-40">
                  <ListChecks size={48} className="mx-auto mb-4 text-outline" />
                  <p className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">No questions added yet.</p>
               </div>
             )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 sm:py-6 space-y-6 sm:space-y-10 animate-in slide-in-from-bottom-4 duration-500 w-full min-w-0 overflow-x-hidden">
      {toast.show && (
        <div className={`fixed bottom-4 inset-x-4 sm:inset-x-auto sm:left-auto sm:right-4 z-[100] max-w-[min(100%,calc(100vw-2rem))] sm:max-w-sm px-4 py-3 rounded-xl shadow-lg border mb-[env(safe-area-inset-bottom,0)] ${toast.type === 'error' ? 'bg-error/10 border-error/20 text-error' : 'bg-primary-container/10 border-primary-container/20 text-primary-container'}`}>
          <p className="font-bold text-sm break-words">{toast.message}</p>
        </div>
      )}

      <div className={`grid grid-cols-1 ${isStudent ? '' : 'lg:grid-cols-2'} gap-6 sm:gap-10 min-w-0`}>
        {/* Creator Panel */}
        {!isStudent && (
          <div className="bg-white p-4 sm:p-8 md:p-10 rounded-xl border border-outline-variant shadow-[0px_8px_24px_rgba(0,0,0,0.08)] space-y-6 sm:space-y-8 h-fit min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
             <div className="min-w-0">
               <h3 className="text-xl sm:text-2xl font-bold text-on-surface break-words">New Quiz</h3>
               <p className="text-on-surface-variant/60 text-sm font-medium mt-1">Define a new assessment container.</p>
             </div>
             <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary-container/5 rounded-xl flex items-center justify-center text-primary-container border border-primary-container/10 shrink-0">
               <BrainCircuit size={28} />
             </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-outline ml-1">Quiz Title</label>
              <input 
                value={quizMeta.title} 
                onChange={e => setQuizMeta({...quizMeta, title: e.target.value})} 
                placeholder="e.g. End of Week Knowledge Check" 
                className="w-full bg-white border border-outline/20 px-6 py-4 rounded-xl font-bold text-on-surface focus:border-primary-container outline-none transition-all shadow-sm" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-outline ml-1">Instructions / Description</label>
              <textarea 
                value={quizMeta.description} 
                onChange={e => setQuizMeta({...quizMeta, description: e.target.value})} 
                placeholder="Guidelines for students..." 
                rows="4" 
                className="w-full bg-white border border-outline/20 px-6 py-4 rounded-xl font-medium text-on-surface resize-none focus:border-primary-container outline-none transition-all shadow-sm" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-outline ml-1">Duration (minutes)</label>
              <input 
                type="number"
                value={quizMeta.duration} 
                onChange={e => setQuizMeta({...quizMeta, duration: parseInt(e.target.value) || 0})} 
                placeholder="30" 
                className="w-full bg-white border border-outline/20 px-6 py-4 rounded-xl font-bold text-on-surface focus:border-primary-container outline-none transition-all shadow-sm" 
              />
            </div>

            <button 
              onClick={handleCreateQuiz} 
              disabled={isSaving || !quizMeta.title} 
              className="w-full bg-primary-container text-on-primary py-5 rounded-lg font-semibold text-xs uppercase tracking-widest hover:brightness-110 active:opacity-80 transition-all shadow-xl shadow-primary-container/10 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              <Save size={20} /> {isSaving ? 'Initializing...' : 'Create Quiz Container'}
            </button>
          </div>
        </div>
        )}

        {/* Existing Quizzes */}
        <div className="space-y-6">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-outline px-2">{isStudent ? 'Knowledge Assessments' : 'Published Quizzes'} ({quizzes.length})</h4>
          {loading ? (
            <div className="flex justify-center py-20 bg-white rounded-xl border border-outline/5"><div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div></div>
          ) : quizzes.length > 0 ? (
            <div className="space-y-4">
              {quizzes.map(q => (
                <div 
                  key={q._id} 
                  onClick={() => fetchQuizDetails(q._id)}
                  className="p-4 sm:p-6 bg-white border border-outline-variant rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer hover:border-primary-container hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-container/5 rounded-xl flex items-center justify-center text-primary-container border border-primary-container/10 group-hover:bg-primary-container group-hover:text-white transition-all shrink-0">
                      <ListChecks size={20} className="sm:hidden" />
                      <ListChecks size={24} className="hidden sm:block" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-on-surface text-base sm:text-lg truncate">{q.title}</h4>
                      {isStudent && q.userScore ? (
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${q.userScore.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                            {q.userScore.status === 'completed' ? (q.userScore.score >= 50 ? 'Passed' : 'Failed') : 'In Progress'}
                          </span>
                          <span className="text-xs sm:text-sm text-on-surface-variant/60 font-medium">
                            {q.userScore.status === 'completed' ? `Score: ${Math.round(q.userScore.score)}%` : 'Resume Attempt'}
                          </span>
                        </div>
                      ) : (
                        <p className="text-xs sm:text-sm text-on-surface-variant/60 font-medium">{isStudent ? 'Launch Assessment' : 'Click to manage questions'}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-0 pt-3 sm:pt-0">
                    {isStudent && q.userScore?.status === 'completed' && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/5 rounded-lg border border-emerald-500/10 text-emerald-600 text-[10px] sm:text-xs font-bold">
                        <CheckCircle2 size={14} /> Completed
                      </div>
                    )}
                    {!isStudent && (
                      <button 
                        onClick={(e) => handleDeleteQuiz(q._id, e)} 
                        className="text-outline hover:text-error p-2 hover:bg-error/5 rounded-lg transition-colors"
                      >
                        <Trash2 size={18}/>
                      </button>
                    )}
                    <div className="sm:hidden text-primary-container font-black text-[10px] uppercase tracking-widest">
                      {isStudent ? (q.userScore?.status === 'completed' ? 'View' : 'Start') : 'Manage'} →
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-surface/50 border border-dashed border-outline/20 rounded-xl py-32 text-center opacity-40">
              <BrainCircuit size={64} className="mx-auto mb-4 text-outline" />
              <p className="text-lg font-bold uppercase tracking-widest text-on-surface-variant">No quizzes defined.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopicQuiz;
