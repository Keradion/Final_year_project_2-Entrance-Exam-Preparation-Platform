import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Target, Trash2, Save, Edit2, Check, X } from 'lucide-react';
import api from '../services/api';

const TopicObjectives = () => {
  const { topic, fetchData, isStudent } = useOutletContext();
  const [topicObjectives, setTopicObjectives] = useState(topic?.topicObjectives || []);
  const [newObjective, setNewObjective] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    setTopicObjectives(topic?.topicObjectives || []);
  }, [topic?.topicObjectives]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleUpdateObjectives = async () => {
    if (topicObjectives.length === 0) {
      return showToast('Please add at least one learning goal before saving.', 'error');
    }
    setIsSaving(true);
    try {
      await api.put(`/content/topics/${topic._id}`, { topicObjectives });
      showToast('Learning goals synchronized successfully!', 'success');
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update topic objectives.';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddObjective = () => {
    if (!newObjective.trim()) {
      return showToast('Objective text cannot be empty.', 'error');
    }
    if (topicObjectives.includes(newObjective.trim())) {
      return showToast('This objective already exists.', 'error');
    }
    setTopicObjectives([...topicObjectives, newObjective.trim()]);
    setNewObjective('');
  };

  const handleStartEdit = (index, text) => {
    setEditingIndex(index);
    setEditText(text);
  };

  const handleSaveEdit = () => {
    if (!editText.trim()) return showToast('Objective text cannot be empty.', 'error');
    const updated = [...topicObjectives];
    updated[editingIndex] = editText.trim();
    setTopicObjectives(updated);
    setEditingIndex(null);
    setEditText('');
  };

  const handleCancelInlineEdit = () => {
    setEditingIndex(null);
    setEditText('');
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 py-4 sm:py-6 max-w-4xl mx-auto w-full min-w-0 px-0 overflow-x-hidden">
      <div
        className={`${isStudent ? 'bg-card rounded-xl border border-outline/10 shadow-sm px-4 py-6 sm:px-10 sm:py-10' : 'bg-white p-4 sm:p-8 md:p-10 rounded-xl border border-outline-variant shadow-[0px_8px_24px_rgba(0,0,0,0.08)] min-w-0'}`}
      >
        {!isStudent && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <div className="min-w-0">
              <h3 className="text-xl sm:text-2xl font-bold text-on-surface break-words">Topic Objectives</h3>
              <p className="text-on-surface-variant/60 text-sm font-medium mt-1">
                Define what students should achieve after completing this topic.
              </p>
            </div>
            <div className="w-14 h-14 bg-primary-container/5 rounded-xl flex items-center justify-center text-primary-container border border-primary-container/10">
              <Target size={28} />
            </div>
          </div>
        )}

        {isStudent && (
          <header className="mb-8 pb-6 border-b border-outline/10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">Learning objectives</p>
            <h2 className="text-xl sm:text-2xl font-semibold text-on-surface tracking-tight mt-2 leading-snug">
              Expected outcomes for this topic
            </h2>
            <p className="text-sm text-on-surface-variant mt-3 leading-relaxed max-w-[65ch]">
              Upon successful completion of this unit, you should be able to demonstrate the following.
            </p>
          </header>
        )}

        {!isStudent && (
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-grow">
              <Target className="absolute left-5 top-1/2 -translate-y-1/2 text-outline" size={20} />
              <input
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                placeholder="e.g. Understand the fundamental principles of..."
                className="w-full bg-white border border-outline/20 pl-14 pr-6 py-4 rounded-xl font-semibold text-on-surface focus:border-primary-container outline-none transition-all shadow-sm"
              />
            </div>
            <button
              type="button"
              onClick={handleAddObjective}
              className="bg-primary-container text-white px-10 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:brightness-110 active:opacity-80 transition-all shadow-lg shadow-primary-container/20"
            >
              Add Goal
            </button>
          </div>
        )}

        <div className={isStudent ? '' : 'space-y-4'}>
          {topicObjectives.length > 0 ? (
            isStudent ? (
              <ol className="list-none p-0 m-0">
                {topicObjectives.map((obj, i) => (
                  <li
                    key={i}
                    className="flex gap-4 sm:gap-5 pb-7 last:pb-0 border-b border-outline/10 last:border-0"
                  >
                    <span className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary-container/10 text-primary-container text-xs sm:text-sm font-semibold flex items-center justify-center border border-primary-container/15 mt-0.5 tabular-nums">
                      {i + 1}
                    </span>
                    <p className="flex-1 min-w-0 text-[1.05rem] sm:text-[1.0625rem] leading-[1.75] text-on-surface font-normal tracking-normal pt-1.5">
                      {obj}
                    </p>
                  </li>
                ))}
              </ol>
            ) : (
              topicObjectives.map((obj, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-6 bg-surface rounded-xl border border-outline/5 group hover:border-primary-container/30 hover:bg-card hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-6 flex-grow min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container font-semibold text-xs border border-primary-container/10 shrink-0">
                      {i + 1}
                    </div>
                    {editingIndex === i ? (
                      <div className="flex items-center gap-3 flex-grow min-w-0">
                        <input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="flex-grow min-w-0 bg-white border border-primary-container/40 px-4 py-2 rounded-lg font-semibold text-on-surface outline-none"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={handleSaveEdit}
                          className="p-2 bg-primary-container text-white rounded-lg hover:brightness-110 shrink-0"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelInlineEdit}
                          className="p-2 bg-surface border border-outline/10 text-outline rounded-lg hover:bg-outline/5 shrink-0"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <span className="font-semibold text-on-surface text-base sm:text-lg leading-relaxed">{obj}</span>
                    )}
                  </div>
                  {!isStudent && editingIndex !== i && (
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(i, obj)}
                        className="text-outline hover:text-primary-container p-2.5 hover:bg-primary-container/5 rounded-lg"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setTopicObjectives(topicObjectives.filter((_, idx) => idx !== i))}
                        className="text-outline hover:text-error p-2.5 hover:bg-error/5 rounded-lg"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  )}
                </div>
              ))
            )
          ) : isStudent ? (
            <p className="text-sm text-on-surface-variant leading-relaxed pl-1">
              Learning objectives have not been published for this topic yet.
            </p>
          ) : (
            <div className="text-center py-20 bg-surface/50 rounded-xl border border-dashed border-outline/20 opacity-40">
              <Target size={64} className="mx-auto mb-4" />
              <p className="font-semibold text-base uppercase tracking-widest text-on-surface-variant">
                No objectives defined yet.
              </p>
            </div>
          )}
        </div>

        {!isStudent && topicObjectives.length > 0 && (
          <button
            type="button"
            onClick={handleUpdateObjectives}
            disabled={isSaving}
            className="mt-12 bg-primary-container text-on-primary px-12 py-5 rounded-lg font-semibold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 w-full sm:w-auto hover:brightness-110 transition-all shadow-xl shadow-primary-container/10 disabled:opacity-50"
          >
            <Save size={20} /> {isSaving ? 'Saving...' : 'Save All Objectives'}
          </button>
        )}
      </div>
    </div>
  );
};

export default TopicObjectives;
