import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Bookmark, ClipboardList, Trash2, CheckCircle2, Save, Edit2 } from 'lucide-react';
import api from '../services/api';
import { addBookmark, getBookmarks, removeBookmark } from '../services/engagement';

const TopicExercise = () => {
  const { topic, isStudent } = useOutletContext();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [exerciseFeedback, setExerciseFeedback] = useState({});
  const [checkingExerciseId, setCheckingExerciseId] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);

  const [newExercise, setNewExercise] = useState({
    title: '',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    difficulty: 'Medium',
    tag: ''
  });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/exercises/topics/${topic._id}/exercises`);
      setExercises(res.data?.data || res.data || []);
    } catch (err) {
      console.error('Failed to fetch exercises', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    if (!isStudent) return;
    try {
      const response = await getBookmarks();
      setBookmarks(response?.data || []);
    } catch (err) {
      console.error('Failed to fetch bookmarks', err);
    }
  };

  useEffect(() => {
    if (topic?._id) {
      fetchExercises();
      fetchBookmarks();
    }
  }, [topic?._id, isStudent]);

  const getExerciseBookmark = (exerciseId) => bookmarks.find((bookmark) => (
    bookmark.resourceType === 'exercise-question' && String(bookmark.resourceId) === String(exerciseId)
  ));

  const handleToggleExerciseBookmark = async (exerciseId) => {
    try {
      const existing = getExerciseBookmark(exerciseId);
      if (existing) {
        await removeBookmark(existing._id);
        setBookmarks((prev) => prev.filter((bookmark) => bookmark._id !== existing._id));
        showToast('Exercise question removed from bookmarks.');
      } else {
        const note = window.prompt('Add a note for this bookmark (optional):', '') || '';
        const response = await addBookmark({ resourceType: 'exercise-question', resourceId: exerciseId, note });
        setBookmarks((prev) => [response.data, ...prev]);
        showToast('Exercise question bookmarked.');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update bookmark.', 'error');
    }
  };

  const [editingId, setEditingId] = useState(null);

  const handleEdit = (ex) => {
    setEditingId(ex._id);
    setNewExercise({
      title: ex.title,
      question: ex.question,
      options: [...ex.options],
      correctAnswer: ex.correctAnswer,
      difficulty: ex.difficulty,
      tag: ex.tag || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewExercise({
      title: '',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      difficulty: 'Medium',
      tag: ''
    });
  };

  const handleAddExercise = async () => {
    if (!newExercise.title.trim()) {
      return showToast('Exercise title is required.', 'error');
    }
    if (!newExercise.question.trim()) {
      return showToast('Question statement is required.', 'error');
    }
    if (newExercise.options.some(opt => !opt.trim())) {
      return showToast('All four options must be filled.', 'error');
    }

    setIsSaving(true);
    try {
      if (editingId) {
        await api.put(`/exercises/${editingId}`, { 
          ...newExercise, 
          title: newExercise.title.trim(),
          question: newExercise.question.trim(),
          options: newExercise.options.map(o => o.trim()),
          topic: topic._id 
        });
        showToast('Exercise updated successfully!');
      } else {
        await api.post('/exercises', { 
          ...newExercise, 
          title: newExercise.title.trim(),
          question: newExercise.question.trim(),
          options: newExercise.options.map(o => o.trim()),
          topic: topic._id 
        });
        showToast('New practice exercise published successfully!');
      }
      handleCancelEdit();
      fetchExercises();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to process exercise.';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this exercise? This will affect students currently practicing this topic.')) return;
    try {
      await api.delete(`/exercises/${id}`);
      showToast('Exercise successfully removed from inventory.');
      if (editingId === id) handleCancelEdit();
      fetchExercises();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete exercise.';
      showToast(msg, 'error');
    }
  };

  const handleConfirmExerciseAnswer = async (ex) => {
    const id = ex._id;
    const idx = selectedAnswers[id];
    if (!isStudent || idx === undefined) return;

    const prevFb = exerciseFeedback[id];
    if (prevFb?.isCorrect) return;
    if (prevFb && !prevFb.isCorrect && prevFb.attemptedSelection === idx) return;

    try {
      setCheckingExerciseId(id);
      const res = await api.post(`/exercises/${id}/submit`, {
        submittedAnswer: idx,
      });
      const data = res.data;
      setExerciseFeedback((prev) => ({
        ...prev,
        [id]: {
          isCorrect: Boolean(data?.isCorrect),
          correctAnswer: data?.correctAnswer,
          correctOption: data?.correctOption,
          hint: data?.hint,
          attemptedSelection: idx,
        },
      }));
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to check answer.', 'error');
    } finally {
      setCheckingExerciseId(null);
    }
  };

  const handleRetryIncorrectExercises = () => {
    const incorrectIds = Object.entries(exerciseFeedback)
      .filter(([, feedback]) => feedback && !feedback.isCorrect)
      .map(([id]) => id);

    setExerciseFeedback((prev) => {
      const next = { ...prev };
      incorrectIds.forEach((id) => delete next[id]);
      return next;
    });
    setSelectedAnswers((prev) => {
      const next = { ...prev };
      incorrectIds.forEach((id) => delete next[id]);
      return next;
    });
  };

  return (
    <div className="py-4 sm:py-6 space-y-6 sm:space-y-10 animate-in slide-in-from-bottom-4 duration-500 w-full min-w-0 overflow-x-hidden">
      {toast.show && (
        <div className={`fixed bottom-4 inset-x-4 sm:inset-x-auto sm:left-auto sm:right-4 z-[100] max-w-[min(100%,calc(100vw-2rem))] sm:max-w-sm px-4 py-3 rounded-xl shadow-lg border mb-[env(safe-area-inset-bottom,0)] ${toast.type === 'error' ? 'bg-error/10 border-error/20 text-error' : 'bg-primary-container/10 border-primary-container/20 text-primary-container'}`}>
          <p className="font-bold text-sm sm:text-base break-words">{toast.message}</p>
        </div>
      )}

      {/* Exercise Builder Card */}
      {!isStudent && (
        <div className="bg-white p-4 sm:p-8 md:p-10 rounded-xl border border-outline-variant shadow-[0px_8px_24px_rgba(0,0,0,0.08)] min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-10">
          <div className="min-w-0">
            <h3 className="text-xl sm:text-2xl font-bold text-on-surface break-words">{editingId ? 'Edit Exercise' : 'Exercise Builder'}</h3>
            <p className="text-on-surface-variant/60 text-sm font-medium mt-1">{editingId ? 'Modify existing MCQ exercise.' : 'Design challenging MCQs for your students.'}</p>
          </div>
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary-container/5 rounded-xl flex items-center justify-center text-primary-container border border-primary-container/10 shrink-0">
            <ClipboardList size={28} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Exercise Title</label>
              <input 
                value={newExercise.title} 
                onChange={e => setNewExercise({...newExercise, title: e.target.value})} 
                placeholder="e.g. Practice Set 1" 
                className="w-full bg-white border border-outline/20 px-6 py-4 rounded-xl font-bold text-on-surface focus:border-primary-container outline-none transition-all shadow-sm" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Question Statement</label>
              <textarea 
                value={newExercise.question} 
                onChange={e => setNewExercise({...newExercise, question: e.target.value})} 
                placeholder="Type your question here..." 
                className="w-full bg-white border border-outline/20 px-6 py-4 rounded-xl font-bold text-on-surface resize-none focus:border-primary-container outline-none transition-all shadow-sm" 
                rows="4"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Difficulty</label>
                  <select 
                    value={newExercise.difficulty} 
                    onChange={e => setNewExercise({...newExercise, difficulty: e.target.value})} 
                    className="w-full bg-white border border-outline/20 px-6 py-4 rounded-xl font-bold text-xs uppercase tracking-widest text-on-surface focus:border-primary-container outline-none shadow-sm appearance-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Classification Tag</label>
                  <input 
                    value={newExercise.tag} 
                    onChange={e => setNewExercise({...newExercise, tag: e.target.value})} 
                    placeholder="e.g. Algebra" 
                    className="w-full bg-white border border-outline/20 px-6 py-4 rounded-xl font-bold text-xs uppercase tracking-widest text-on-surface focus:border-primary-container outline-none shadow-sm" 
                  />
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Options & Correct Answer</label>
            <div className="grid grid-cols-1 gap-3">
              {['A', 'B', 'C', 'D'].map((opt, i) => (
                <div key={opt} className="flex items-center gap-2 sm:gap-4 min-w-0">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-lg flex items-center justify-center font-black text-xs border transition-all ${newExercise.correctAnswer === i ? 'bg-primary-container text-white border-primary-container shadow-md' : 'bg-surface text-outline border-outline/10'}`}>
                    {opt}
                  </div>
                  <input 
                    value={newExercise.options[i]} 
                    onChange={e => {
                      const opts = [...newExercise.options];
                      opts[i] = e.target.value;
                      setNewExercise({...newExercise, options: opts});
                    }} 
                    placeholder={`Option ${opt}`} 
                    className={`min-w-0 flex-1 bg-white border px-3 sm:px-5 py-3 rounded-xl font-semibold text-sm outline-none transition-all shadow-sm ${newExercise.correctAnswer === i ? 'border-primary-container ring-1 ring-primary-container/20' : 'border-outline/20 focus:border-primary-container/40'}`} 
                  />
                  <input 
                    type="radio" 
                    name="correctAnswer" 
                    checked={newExercise.correctAnswer === i} 
                    onChange={() => setNewExercise({...newExercise, correctAnswer: i})} 
                    className="w-5 h-5 shrink-0 accent-primary-container cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 flex flex-col-reverse sm:flex-row sm:justify-end border-t border-outline/5 pt-6 sm:pt-8 gap-3 sm:gap-4">
           {editingId && (
             <button 
               onClick={handleCancelEdit} 
               className="w-full sm:w-auto bg-white border border-outline/20 text-on-surface px-6 sm:px-10 py-3.5 sm:py-5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-surface transition-all shadow-sm min-h-11"
             >
               Cancel
             </button>
           )}
           <button 
             onClick={handleAddExercise} 
             disabled={isSaving || !newExercise.question || !newExercise.title} 
             className={`w-full sm:w-auto ${editingId ? 'bg-primary-container' : 'bg-on-surface'} text-white px-8 sm:px-12 py-3.5 sm:py-5 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:brightness-110 active:opacity-80 transition-all shadow-xl shadow-on-surface/10 disabled:opacity-50 flex items-center justify-center gap-3 min-h-11`}
           >
             <Save size={20} /> {isSaving ? 'Processing...' : (editingId ? 'Update Exercise' : 'Publish Exercise')}
           </button>
        </div>
      </div>
      )}

      {/* Inventory Panel */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-2">
          <h4 className="text-sm font-bold text-on-surface-variant tracking-tight">{isStudent ? 'Practice exercises' : 'Exercise inventory'} · {exercises.length} items</h4>
          {isStudent && exercises.length > 0 && (
            <p className="text-xs text-on-surface-variant font-semibold">
              Pick a choice, then press <span className="text-on-surface">Check answer</span> on the bottom-right of that question. Change your choice after a wrong attempt, then check again.
            </p>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20 bg-white rounded-xl border border-outline/5"><div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div></div>
        ) : exercises.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {exercises.map((ex, i) => (
              <div key={ex._id} className="bg-white rounded-xl border border-outline-variant p-4 sm:p-8 shadow-[0px_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0px_8px_24px_rgba(0,0,0,0.08)] transition-all group min-w-0">
                {(() => {
                  const feedback = exerciseFeedback[ex._id];
                  const hasFeedback = Boolean(feedback);
                  return (
                    <>
                <div className="flex items-start justify-between gap-3 sm:gap-6 mb-6 min-w-0">
                  <div className="flex gap-3 sm:gap-4 items-start min-w-0 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-container/5 rounded-xl flex items-center justify-center text-primary-container font-bold text-sm sm:text-base border border-primary-container/10 shrink-0 group-hover:bg-primary-container group-hover:text-white transition-all tabular-nums">
                      {i + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                         <h4 className="font-semibold text-on-surface text-lg sm:text-xl leading-snug break-words">{ex.title}</h4>
                         <span className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wide border ${
                           ex.difficulty === 'Hard' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' : 
                           ex.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 
                           'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                         }`}>
                           {ex.difficulty}
                         </span>
                      </div>
                      <p className="text-on-surface text-base sm:text-lg font-medium leading-relaxed mb-4 break-words">{ex.question}</p>
                      {ex.tag && (
                        <span className="px-2 py-0.5 rounded-lg bg-surface text-[9px] font-black uppercase tracking-widest border border-outline/10 text-on-surface-variant/60">
                           {ex.tag}
                         </span>
                      )}
                    </div>
                  </div>
                  {!isStudent && (
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                      <button 
                        onClick={() => handleEdit(ex)} 
                        className="p-3 rounded-xl text-outline hover:text-primary-container hover:bg-primary-container/5 transition-all"
                        title="Edit Exercise"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button 
                        onClick={() => handleDelete(ex._id)} 
                        className="p-3 rounded-xl text-outline hover:text-error hover:bg-error/5 transition-all"
                        title="Delete Exercise"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  )}
                  {isStudent && (
                    <button
                      type="button"
                      onClick={() => handleToggleExerciseBookmark(ex._id)}
                      className={`p-3 rounded-xl border shrink-0 transition-all ${getExerciseBookmark(ex._id) ? 'bg-primary-container text-white border-primary-container' : 'text-primary-container border-primary-container/20 hover:bg-primary-container/5'}`}
                      title={getExerciseBookmark(ex._id) ? 'Remove bookmark' : 'Bookmark exercise question'}
                    >
                      <Bookmark size={18} fill={getExerciseBookmark(ex._id) ? 'currentColor' : 'none'} />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-0 sm:pl-12 md:pl-14">
                  {ex.options.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={
                        !isStudent
                        || (hasFeedback && feedback.isCorrect)
                        || checkingExerciseId === ex._id
                      }
                      onClick={() =>
                        setSelectedAnswers((prev) => ({ ...prev, [ex._id]: idx }))
                      }
                      className={`p-4 sm:p-5 rounded-xl border flex items-center gap-4 transition-all text-left min-h-[3.5rem] ${
                        isStudent
                          ? hasFeedback
                            ? idx === feedback.correctAnswer
                              ? 'bg-emerald-500/5 border-emerald-500/20 ring-1 ring-emerald-500/10'
                              : selectedAnswers[ex._id] === idx
                                ? 'bg-error/5 border-error/20'
                                : 'bg-surface/50 border-outline/5 opacity-70'
                            : selectedAnswers[ex._id] === idx
                              ? 'bg-primary-container/5 border-primary-container/30 ring-1 ring-primary-container/10'
                              : 'bg-surface/50 border-outline/5 hover:border-primary-container/20'
                          : idx === ex.correctAnswer
                            ? 'bg-emerald-500/5 border-emerald-500/20 ring-1 ring-emerald-500/10'
                            : 'bg-surface/50 border-outline/5 opacity-60'
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-bold uppercase text-outline w-8 shrink-0 tabular-nums">{String.fromCharCode(65 + idx)}</span>
                      <span className={`text-base sm:text-lg font-semibold leading-snug ${(!isStudent && idx === ex.correctAnswer) || (hasFeedback && idx === feedback.correctAnswer) ? 'text-emerald-700' : 'text-on-surface'}`}>{opt}</span>
                      {((!isStudent && idx === ex.correctAnswer) || (hasFeedback && idx === feedback.correctAnswer)) && <CheckCircle2 size={16} className="ml-auto text-emerald-600" />}
                    </button>
                  ))}
                </div>
                {isStudent && !feedback?.isCorrect && (
                  <div className="pl-14 mt-4 flex justify-end items-center gap-3 flex-wrap">
                    {checkingExerciseId === ex._id && (
                      <span className="text-xs text-on-surface-variant font-semibold">
                        Checking…
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleConfirmExerciseAnswer(ex)}
                      disabled={
                        selectedAnswers[ex._id] === undefined
                        || checkingExerciseId === ex._id
                        || Boolean(
                          hasFeedback &&
                            !feedback.isCorrect &&
                            feedback.attemptedSelection === selectedAnswers[ex._id]
                        )
                      }
                      className="bg-primary-container text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 disabled:opacity-45 disabled:pointer-events-none shadow-lg shadow-primary-container/20 shrink-0"
                    >
                      Check answer
                    </button>
                  </div>
                )}
                {isStudent && hasFeedback && (
                  <div className="pl-14 mt-5">
                      <div className={`rounded-xl border px-5 py-4 ${feedback.isCorrect ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-700' : 'bg-error/5 border-error/20 text-error'}`}>
                        <p className="font-bold text-sm sm:text-base">
                          {feedback.isCorrect ? 'Correct answer. Well done.' : `Incorrect. Correct answer: ${feedback.correctOption}`}
                        </p>
                        {!feedback.isCorrect && feedback.hint && (
                          <p className="text-xs sm:text-sm mt-2 opacity-90 leading-relaxed">Hint: {feedback.hint}</p>
                        )}
                      </div>
                  </div>
                )}
                    </>
                  );
                })()}
              </div>
            ))}
            {isStudent &&
              exercises.length > 0 &&
              Object.values(exerciseFeedback).some((f) => f && !f.isCorrect) && (
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleRetryIncorrectExercises}
                    className="px-5 py-3 rounded-xl border border-outline/20 text-xs font-bold hover:bg-surface transition-colors"
                  >
                    Retry incorrect questions
                  </button>
                </div>
              )}
            {isStudent &&
              exercises.length > 0 &&
              exercises.every((ex) => exerciseFeedback[ex._id]?.isCorrect) && (
                <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 px-6 py-4 text-center">
                  <p className="text-sm font-bold text-emerald-800">
                    You&apos;ve solved every exercise in this topic. Well done!
                  </p>
                </div>
              )}
          </div>
        ) : (
          <div className="bg-surface/50 border border-dashed border-outline/20 rounded-xl py-32 text-center opacity-40">
             <ClipboardList size={64} className="mx-auto mb-6 text-outline" />
             <p className="text-xl font-bold uppercase tracking-widest">No Exercises Yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicExercise;
