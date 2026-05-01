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
  const [quizMeta, setQuizMeta] = useState({ title: '', description: '' });
  
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

  const fetchQuizDetails = async (quizId) => {
    try {
      setLoading(true);
      const res = await api.get(`/quizzes/${quizId}`);
      setActiveQuiz(res.data.data);
    } catch (err) {
      showToast('Failed to load quiz details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (topic?._id) fetchQuizzes();
  }, [topic?._id]);

  const handleCreateQuiz = async () => {
    if (!quizMeta.title.trim()) {
      return showToast('Quiz title is required.', 'error');
    }
    setIsSaving(true);
    try {
      const res = await api.post('/quizzes', { 
        title: quizMeta.title.trim(),
        description: quizMeta.description.trim(),
        topic: topic._id 
      });
      showToast('Assessment container initialized successfully!');
      setActiveQuiz({ ...res.data.data, problems: [] });
      setQuizMeta({ title: '', description: '' });
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
        description: quizMeta.description.trim()
      });
      showToast('Quiz updated successfully!');
      setActiveQuiz({ ...activeQuiz, title: quizMeta.title, description: quizMeta.description });
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

  const handleSubmitQuizAttempt = async () => {
    const pendingProblems = (activeQuiz?.problems || []).filter((prob) => !quizFeedback[prob._id] || !quizFeedback[prob._id].isCorrect);
    const unanswered = pendingProblems.filter((prob) => !selectedQuizAnswers[prob._id]);
    if (unanswered.length > 0) {
      return showToast('Please answer all pending quiz questions before submitting.', 'error');
    }

    try {
      setIsSubmittingAttempt(true);
      const results = await Promise.all(
        pendingProblems.map(async (prob) => {
          const res = await api.post(`/quizzes/problems/${prob._id}/validate`, {
            submittedAnswer: selectedQuizAnswers[prob._id],
          });
          return [prob._id, {
            isCorrect: res.data?.isCorrect,
            correctAnswer: res.data?.correctAnswer,
            answerExplanation: res.data?.answerExplanation,
          }];
        })
      );
      setQuizFeedback((prev) => ({
        ...prev,
        ...Object.fromEntries(results),
      }));
      showToast('Quiz attempt submitted.');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit quiz attempt.', 'error');
    } finally {
      setIsSubmittingAttempt(false);
    }
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
    return (
      <div className="py-6 space-y-8 animate-in fade-in duration-500">
        <button 
          onClick={() => { setActiveQuiz(null); fetchQuizzes(); }}
          className="flex items-center gap-2 text-outline hover:text-on-surface font-bold text-xs uppercase tracking-widest transition-colors mb-4"
        >
          <ChevronLeft size={16} /> Back to {isStudent ? 'Assessments' : 'Quizzes'}
        </button>

        <div className={`grid grid-cols-1 ${isStudent ? '' : 'lg:grid-cols-2'} gap-10`}>
          {/* Problem Creator or Meta Editor */}
          {!isStudent && (
            <div className="bg-white p-10 rounded-xl border border-outline-variant shadow-[0px_8px_24px_rgba(0,0,0,0.08)] space-y-8 h-fit">
            {editingId === activeQuiz._id ? (
               <div className="space-y-6 animate-in slide-in-from-top-2">
                 <h3 className="text-2xl font-bold text-on-surface mb-6">Edit Quiz Details</h3>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Quiz Title</label>
                   <input 
                     value={quizMeta.title} 
                     onChange={e => setQuizMeta({...quizMeta, title: e.target.value})}
                     className="w-full bg-white border border-outline/20 px-6 py-4 rounded-xl font-bold text-on-surface focus:border-primary-container outline-none"
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Description</label>
                   <textarea 
                     value={quizMeta.description} 
                     onChange={e => setQuizMeta({...quizMeta, description: e.target.value})}
                     className="w-full bg-white border border-outline/20 px-6 py-4 rounded-xl font-medium text-on-surface focus:border-primary-container outline-none"
                     rows="3"
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
                           onClick={() => { setEditingId(activeQuiz._id); setQuizMeta({ title: activeQuiz.title, description: activeQuiz.description }); }}
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
                   <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Question Text</label>
                   <textarea 
                     value={newProblem.questionText} 
                     onChange={e => setNewProblem({...newProblem, questionText: e.target.value})} 
                     placeholder="e.g. Which of the following is..." 
                     rows="3"
                     className="w-full bg-white border border-outline/20 px-6 py-4 rounded-xl font-bold text-on-surface focus:border-primary-container outline-none transition-all shadow-sm" 
                   />
                 </div>
 
                 <div className="space-y-4">
                   <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Choices & Correct Answer</label>
                   <div className="grid grid-cols-1 gap-3">
                     {newProblem.choices.map((choice, i) => (
                       <div key={choice.value} className="flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-xs border transition-all ${newProblem.correctAnswer === choice.value ? 'bg-primary-container text-white border-primary-container' : 'bg-surface text-outline border-outline/10'}`}>
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
                           className={`flex-grow bg-white border px-5 py-3 rounded-xl font-semibold text-sm outline-none transition-all shadow-sm ${newProblem.correctAnswer === choice.value ? 'border-primary-container ring-1 ring-primary-container/20' : 'border-outline/20 focus:border-primary-container/40'}`} 
                         />
                         <input 
                           type="radio" 
                           name="correctAnswer" 
                           checked={newProblem.correctAnswer === choice.value} 
                           onChange={() => setNewProblem({...newProblem, correctAnswer: choice.value})} 
                           className="w-5 h-5 accent-primary-container cursor-pointer"
                         />
                       </div>
                     ))}
                   </div>
                 </div>
 
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Answer Explanation (Optional)</label>
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
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-outline">{isStudent ? 'Assessment Problems' : 'Quiz Questions'} ({activeQuiz.problems?.length || 0})</h4>
                {isStudent && activeQuiz.problems?.length > 0 && (
                  <div className="flex items-center gap-2">
                    {Object.values(quizFeedback).some((f) => f && !f.isCorrect) && (
                      <button onClick={handleRetryIncorrectQuiz} className="px-4 py-2 rounded-lg border border-outline/20 text-xs font-bold">
                        Retry Incorrect
                      </button>
                    )}
                    <button
                      onClick={handleSubmitQuizAttempt}
                      disabled={isSubmittingAttempt || activeQuiz.problems.every((prob) => quizFeedback[prob._id]?.isCorrect)}
                      className="bg-primary-container text-white px-4 py-2 rounded-lg text-xs font-bold disabled:opacity-50"
                    >
                      {isSubmittingAttempt ? 'Submitting...' : 'Submit Quiz'}
                    </button>
                  </div>
                )}
             </div>
             
             {activeQuiz.problems?.length > 0 ? (
               <div className="space-y-4">
                 {activeQuiz.problems.map((prob, idx) => {
                  const feedback = quizFeedback[prob._id];
                  const hasFeedback = Boolean(feedback);
                  return (
                   <div key={prob._id} className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm group">
                     <div className="flex justify-between items-start gap-4 mb-4">
                        <div className="flex gap-4">
                           <div className="w-8 h-8 bg-surface rounded-lg flex items-center justify-center text-[10px] font-black text-outline border border-outline/5">
                             {idx + 1}
                           </div>
                           <p className="font-bold text-on-surface leading-tight">{prob.questionText}</p>
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
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-12">
                        {prob.choices.map(c => (
                          <button
                            key={c.value}
                            type="button"
                            disabled={!isStudent || (hasFeedback && feedback.isCorrect)}
                            onClick={() => setSelectedQuizAnswers((prev) => ({ ...prev, [prob._id]: c.value }))}
                            className={`px-3 py-2 rounded-lg border text-[10px] font-bold text-left ${
                              isStudent
                                ? hasFeedback
                                  ? c.value === feedback.correctAnswer
                                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-700'
                                    : selectedQuizAnswers[prob._id] === c.value
                                      ? 'bg-error/5 border-error/20 text-error'
                                      : 'bg-surface/50 border-outline/5 text-outline'
                                  : selectedQuizAnswers[prob._id] === c.value
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
                      <div className={`ml-12 mt-4 rounded-xl border px-4 py-3 ${feedback.isCorrect ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-700' : 'bg-error/5 border-error/20 text-error'}`}>
                        <p className="text-xs font-bold">
                          {feedback.isCorrect ? 'Correct answer.' : `Incorrect. Correct answer: ${feedback.correctAnswer}`}
                        </p>
                        {!feedback.isCorrect && feedback.answerExplanation && (
                          <p className="text-xs mt-1 opacity-80">{feedback.answerExplanation}</p>
                        )}
                      </div>
                     )}
                   </div>
                  );
                 })}
               </div>
             ) : (
               <div className="bg-surface/50 border border-dashed border-outline/20 rounded-xl py-32 text-center opacity-40">
                  <ListChecks size={48} className="mx-auto mb-4 text-outline" />
                  <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">No questions added yet.</p>
               </div>
             )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-10 animate-in slide-in-from-bottom-4 duration-500">
      {toast.show && (
        <div className={`fixed bottom-4 right-4 z-[100] px-6 py-3 rounded-xl shadow-lg border ${toast.type === 'error' ? 'bg-error/10 border-error/20 text-error' : 'bg-primary-container/10 border-primary-container/20 text-primary-container'}`}>
          <p className="font-bold">{toast.message}</p>
        </div>
      )}

      <div className={`grid grid-cols-1 ${isStudent ? '' : 'lg:grid-cols-2'} gap-10`}>
        {/* Creator Panel */}
        {!isStudent && (
          <div className="bg-white p-10 rounded-xl border border-outline-variant shadow-[0px_8px_24px_rgba(0,0,0,0.08)] space-y-8 h-fit">
          <div className="flex items-center justify-between">
             <div>
               <h3 className="text-2xl font-bold text-on-surface">New Quiz</h3>
               <p className="text-on-surface-variant/60 text-sm font-medium mt-1">Define a new assessment container.</p>
             </div>
             <div className="w-14 h-14 bg-primary-container/5 rounded-xl flex items-center justify-center text-primary-container border border-primary-container/10">
               <BrainCircuit size={28} />
             </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Quiz Title</label>
              <input 
                value={quizMeta.title} 
                onChange={e => setQuizMeta({...quizMeta, title: e.target.value})} 
                placeholder="e.g. End of Week Knowledge Check" 
                className="w-full bg-white border border-outline/20 px-6 py-4 rounded-xl font-bold text-on-surface focus:border-primary-container outline-none transition-all shadow-sm" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Instructions / Description</label>
              <textarea 
                value={quizMeta.description} 
                onChange={e => setQuizMeta({...quizMeta, description: e.target.value})} 
                placeholder="Guidelines for students..." 
                rows="4" 
                className="w-full bg-white border border-outline/20 px-6 py-4 rounded-xl font-medium text-on-surface resize-none focus:border-primary-container outline-none transition-all shadow-sm" 
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
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-outline px-2">{isStudent ? 'Knowledge Assessments' : 'Published Quizzes'} ({quizzes.length})</h4>
          {loading ? (
            <div className="flex justify-center py-20 bg-white rounded-xl border border-outline/5"><div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div></div>
          ) : quizzes.length > 0 ? (
            <div className="space-y-4">
              {quizzes.map(q => (
                <div 
                  key={q._id} 
                  onClick={() => fetchQuizDetails(q._id)}
                  className="p-6 bg-white border border-outline-variant rounded-xl flex justify-between items-center group cursor-pointer hover:border-primary-container hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-primary-container/5 rounded-xl flex items-center justify-center text-primary-container border border-primary-container/10 group-hover:bg-primary-container group-hover:text-white transition-all">
                      <ListChecks size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface text-lg">{q.title}</h4>
                      <p className="text-sm text-on-surface-variant/60 font-medium">{isStudent ? 'Launch Assessment' : 'Click to manage questions'}</p>
                    </div>
                  </div>
                  {!isStudent && (
                    <button 
                      onClick={(e) => handleDeleteQuiz(q._id, e)} 
                      className="text-outline hover:text-error opacity-0 group-hover:opacity-100 transition-all p-2.5 hover:bg-error/5 rounded-lg"
                    >
                      <Trash2 size={20}/>
                    </button>
                  )}
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
