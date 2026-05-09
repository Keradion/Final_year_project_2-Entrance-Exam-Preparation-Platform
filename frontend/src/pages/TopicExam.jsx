import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Award, Trash2, CheckCircle2, Save, Edit2, Link, BookOpen, Calendar, Bookmark } from 'lucide-react';
import api from '../services/api';
import { addBookmark, getBookmarks, removeBookmark } from '../services/engagement';

const TopicExam = () => {
  const { topic, subject, isStudent } = useOutletContext();
  const [examQuestions, setExamQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [editingId, setEditingId] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);

  const [newQuestion, setNewQuestion] = useState({
    year: '2017',
    tag: '',
    questionText: '',
    choices: ['', '', '', ''],
    correctAnswer: 'A',
    answerExplanation: ''
  });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchExamQuestions = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/exams/questions/search?topicId=${topic._id}`);
      setExamQuestions(res.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch exam data', err);
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
      fetchExamQuestions();
      fetchBookmarks();
    }
  }, [topic?._id, isStudent]);

  const getExamQuestionBookmark = (questionId) => bookmarks.find((bookmark) => (
    bookmark.resourceType === 'exam-question' && String(bookmark.resourceId) === String(questionId)
  ));

  const handleToggleExamBookmark = async (questionId) => {
    try {
      const existing = getExamQuestionBookmark(questionId);
      if (existing) {
        await removeBookmark(existing._id);
        setBookmarks((prev) => prev.filter((bookmark) => bookmark._id !== existing._id));
        showToast('Previous year question removed from bookmarks.');
      } else {
        const note = window.prompt('Add a note for this bookmark (optional):', '') || '';
        const response = await addBookmark({ resourceType: 'exam-question', resourceId: questionId, note });
        setBookmarks((prev) => [response.data, ...prev]);
        showToast('Previous year question bookmarked.');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update bookmark.', 'error');
    }
  };

  const handleEdit = (q) => {
    setEditingId(q._id);
    setNewQuestion({
      year: q.examPaperDoc?.year?.toString() || '2017',
      tag: q.tag || '',
      questionText: q.questionText,
      choices: q.choices || ['', '', '', ''],
      correctAnswer: q.correctAnswer || 'A',
      answerExplanation: q.answerExplanation || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewQuestion({
      year: '2017',
      tag: '',
      questionText: '',
      choices: ['', '', '', ''],
      correctAnswer: 'A',
      answerExplanation: ''
    });
  };

  const handleSaveQuestion = async () => {
    if (!newQuestion.questionText.trim()) {
      return showToast('Question statement is required.', 'error');
    }
    if (newQuestion.choices.some(opt => !opt.trim())) {
      return showToast('All four options must be filled.', 'error');
    }

    setIsSaving(true);
    try {
      let paperId = null;

      // 1. Find or Create Exam Paper for the selected year
      const papersRes = await api.get(`/exams/papers/subjects/${subject._id}`);
      const papers = papersRes.data?.data || papersRes.data || [];
      const existingPaper = papers.find(p => p.year === parseInt(newQuestion.year));

      if (existingPaper) {
        paperId = existingPaper._id;
      } else {
        const newPaperRes = await api.post('/exams/papers', {
          subject: subject._id,
          year: parseInt(newQuestion.year),
          title: `National Exam ${newQuestion.year}`
        });
        paperId = newPaperRes.data.data._id;
      }

      // 2. Add or Update Question
      if (editingId) {
        await api.put(`/exams/questions/${editingId}`, {
          ...newQuestion,
          examPaper: paperId,
          topic: topic._id,
          questionText: newQuestion.questionText.trim(),
          choices: newQuestion.choices.map(c => c.trim()),
          tag: newQuestion.tag.trim()
        });
        showToast('Exam reference updated successfully!');
      } else {
        await api.post(`/exams/papers/${paperId}/questions`, {
          ...newQuestion,
          topic: topic._id,
          questionText: newQuestion.questionText.trim(),
          choices: newQuestion.choices.map(c => c.trim()),
          tag: newQuestion.tag.trim()
        });
        showToast('National Exam reference linked successfully!');
      }

      handleCancelEdit();
      fetchExamQuestions();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to process exam question.';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this national exam reference? This will affect student revision history.')) return;
    try {
      await api.delete(`/exams/questions/${id}`);
      showToast('Exam reference successfully unlinked.');
      if (editingId === id) handleCancelEdit();
      fetchExamQuestions();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to remove exam link.';
      showToast(msg, 'error');
    }
  };

  return (
    <div className="py-4 sm:py-6 space-y-6 sm:space-y-10 animate-in slide-in-from-bottom-4 duration-500 w-full min-w-0 overflow-x-hidden">
      {toast.show && (
        <div className={`fixed bottom-4 inset-x-4 sm:inset-x-auto sm:left-auto sm:right-4 z-[100] max-w-[min(100%,calc(100vw-2rem))] sm:max-w-sm px-4 py-3 rounded-xl shadow-lg border mb-[env(safe-area-inset-bottom,0)] ${toast.type === 'error' ? 'bg-error/10 border-error/20 text-error' : 'bg-primary-container/10 border-primary-container/20 text-primary-container'}`}>
          <p className="font-bold text-sm sm:text-base break-words">{toast.message}</p>
        </div>
      )}

      {/* Exam Linkage Builder */}
      {!isStudent && (
        <div className="bg-white p-4 sm:p-8 md:p-10 rounded-xl border border-outline-variant shadow-[0px_8px_24px_rgba(0,0,0,0.08)] min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-10">
          <div className="min-w-0">
            <h3 className="text-xl sm:text-2xl font-bold text-on-surface break-words">{editingId ? 'Edit Exam Linkage' : 'National Exam Linkage'}</h3>
            <p className="text-on-surface-variant/60 text-sm font-medium mt-1">Design and associate previous exam questions with this topic.</p>
          </div>
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary-container/5 rounded-xl flex items-center justify-center text-primary-container border border-primary-container/10 shrink-0">
            <Award size={28} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Exam Year</label>
                  <select 
                    value={newQuestion.year} 
                    onChange={e => setNewQuestion({...newQuestion, year: e.target.value})} 
                    className="w-full bg-white border border-outline/20 px-6 py-4 rounded-xl font-bold text-xs uppercase tracking-widest text-on-surface focus:border-primary-container outline-none shadow-sm appearance-none"
                  >
                    <option value="2014">2014</option>
                    <option value="2015">2015</option>
                    <option value="2016">2016</option>
                    <option value="2017">2017</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Topic Tag</label>
                  <input 
                    value={newQuestion.tag} 
                    onChange={e => setNewQuestion({...newQuestion, tag: e.target.value})} 
                    placeholder="e.g. Vectors" 
                    className="w-full bg-white border border-outline/20 px-6 py-4 rounded-xl font-bold text-xs uppercase tracking-widest text-on-surface focus:border-primary-container outline-none shadow-sm" 
                  />
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Question Statement</label>
              <textarea 
                value={newQuestion.questionText} 
                onChange={e => setNewQuestion({...newQuestion, questionText: e.target.value})} 
                placeholder="Type the exam question here..." 
                className="w-full bg-white border border-outline/20 px-6 py-4 rounded-xl font-bold text-on-surface resize-none focus:border-primary-container outline-none transition-all shadow-sm" 
                rows="4"
              />
            </div>
          </div>

          <div className="space-y-6">
            <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Options & Correct Answer</label>
            <div className="grid grid-cols-1 gap-3">
              {['A', 'B', 'C', 'D'].map((opt, i) => (
                <div key={opt} className="flex items-center gap-2 sm:gap-4 min-w-0">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-lg flex items-center justify-center font-black text-xs border transition-all ${newQuestion.correctAnswer === opt ? 'bg-primary-container text-white border-primary-container shadow-md' : 'bg-surface text-outline border-outline/10'}`}>
                    {opt}
                  </div>
                  <input 
                    value={newQuestion.choices[i]} 
                    onChange={e => {
                      const opts = [...newQuestion.choices];
                      opts[i] = e.target.value;
                      setNewQuestion({...newQuestion, choices: opts});
                    }} 
                    placeholder={`Option ${opt}`} 
                    className={`min-w-0 flex-1 bg-white border px-3 sm:px-5 py-3 rounded-xl font-semibold text-sm outline-none transition-all shadow-sm ${newQuestion.correctAnswer === opt ? 'border-primary-container ring-1 ring-primary-container/20' : 'border-outline/20 focus:border-primary-container/40'}`} 
                  />
                  <input 
                    type="radio" 
                    name="correctAnswer" 
                    checked={newQuestion.correctAnswer === opt} 
                    onChange={() => setNewQuestion({...newQuestion, correctAnswer: opt})} 
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
             onClick={handleSaveQuestion} 
             disabled={isSaving || !newQuestion.questionText} 
             className={`w-full sm:w-auto ${editingId ? 'bg-primary-container' : 'bg-on-surface'} text-white px-8 sm:px-12 py-3.5 sm:py-5 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:brightness-110 active:opacity-80 transition-all shadow-xl shadow-on-surface/10 disabled:opacity-50 flex items-center justify-center gap-3 min-h-11`}
           >
             <Save size={20} /> {isSaving ? 'Processing...' : (editingId ? 'Update Reference' : 'Publish Reference')}
           </button>
        </div>
      </div>
      )}

      {/* Associated Exam Questions */}
      <div className="space-y-6">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-outline px-2">{isStudent ? 'Revision Archives' : 'National Exam References'} ({examQuestions.length})</h4>
        {loading ? (
          <div className="flex justify-center py-20 bg-white rounded-xl border border-outline/5"><div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div></div>
        ) : examQuestions.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {examQuestions.map((q, i) => (
              <div key={q._id} className="bg-white rounded-xl border border-outline-variant p-4 sm:p-8 shadow-[0px_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0px_8px_24px_rgba(0,0,0,0.08)] transition-all group min-w-0">
                <div className="flex items-start justify-between gap-3 sm:gap-6 mb-6 min-w-0">
                  <div className="flex gap-3 sm:gap-4 items-start min-w-0 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-container/5 rounded-xl flex items-center justify-center text-primary-container border border-primary-container/10 shrink-0 group-hover:bg-primary-container group-hover:text-white transition-all">
                      <BookOpen size={24} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                         <h4 className="font-bold text-on-surface text-base sm:text-lg leading-tight break-words">
                           {q.examPaperDoc?.title || `National Exam ${q.examPaperDoc?.year || 'Unknown'}`}
                         </h4>
                         <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[9px] font-black uppercase tracking-widest">
                           <Calendar size={10} /> {q.examPaperDoc?.year || 'Unknown'}
                         </span>
                         {q.tag && (
                           <span className="px-2 py-0.5 rounded-lg bg-surface text-[9px] font-black uppercase tracking-widest border border-outline/10 text-on-surface-variant/60">
                             {q.tag}
                           </span>
                         )}
                      </div>
                      <p className="text-on-surface-variant/70 text-sm font-medium leading-relaxed mb-4 break-words">{q.questionText}</p>
                    </div>
                  </div>
                  {!isStudent && (
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                      <button 
                        onClick={() => handleEdit(q)} 
                        className="p-3 rounded-xl text-outline hover:text-primary-container hover:bg-primary-container/5 transition-all"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button 
                        onClick={() => handleDelete(q._id)} 
                        className="p-3 rounded-xl text-outline hover:text-error hover:bg-error/5 transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  )}
                  {isStudent && (
                    <button
                      type="button"
                      onClick={() => handleToggleExamBookmark(q._id)}
                      className={`p-3 rounded-xl border shrink-0 transition-all ${getExamQuestionBookmark(q._id) ? 'bg-primary-container text-white border-primary-container' : 'text-primary-container border-primary-container/20 hover:bg-primary-container/5'}`}
                      title={getExamQuestionBookmark(q._id) ? 'Remove bookmark' : 'Bookmark previous year question'}
                    >
                      <Bookmark size={18} fill={getExamQuestionBookmark(q._id) ? 'currentColor' : 'none'} />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-0 sm:pl-12 md:pl-16">
                  {(q.choices || []).map((opt, idx) => (
                    <div key={idx} className={`p-3 sm:p-4 rounded-xl border flex items-center gap-2 sm:gap-4 min-w-0 transition-all ${(!isStudent || String.fromCharCode(65 + idx) === q.correctAnswer) ? (String.fromCharCode(65 + idx) === q.correctAnswer ? 'bg-emerald-500/5 border-emerald-500/20 ring-1 ring-emerald-500/10' : 'bg-surface/50 border-outline/5 opacity-60') : 'bg-surface/50 border-outline/5'}`}>
                      <span className="text-[10px] font-black uppercase text-outline w-4 shrink-0">{String.fromCharCode(65 + idx)}</span>
                      <span className={`text-sm font-bold min-w-0 break-words ${(!isStudent && String.fromCharCode(65 + idx) === q.correctAnswer) ? 'text-emerald-700' : 'text-on-surface'}`}>{opt}</span>
                      {(!isStudent && String.fromCharCode(65 + idx) === q.correctAnswer) && <CheckCircle2 size={16} className="ml-auto text-emerald-600" />}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface/50 border border-dashed border-outline/20 rounded-xl py-32 text-center opacity-40">
            <Award size={64} className="mx-auto mb-4 text-outline" />
            <p className="text-lg font-bold uppercase tracking-widest text-on-surface-variant">No exam references linked.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicExam;
