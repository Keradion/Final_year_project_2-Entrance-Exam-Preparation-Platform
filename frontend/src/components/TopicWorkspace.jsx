import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, BookOpen, Tv, FileText, HelpCircle, 
  Award, Target, Plus, Trash2, Save, MoreVertical,
  CheckCircle2, PlayCircle, ClipboardList, BookCheck, FileQuestion
} from 'lucide-react';
import api from '../services/api';

const TopicWorkspace = ({ topic, chapter, subject, onBack, fetchTopicContent, topicContent, topicObjectives, setTopicObjectives, handleUpdateObjectives, handleAddObjective, newObjective, setNewObjective, handleAddContent, isSavingContent, newContent, setNewContent, handleDeleteContent, examPapers }) => {
  const [activeTab, setActiveTab] = useState('objectives');

  const tabs = [
    { id: 'objectives', label: 'Objectives', icon: <Target size={18} /> },
    { id: 'concept', label: 'Concept Page', icon: <BookOpen size={18} /> },
    { id: 'video', label: 'Video Lessons', icon: <PlayCircle size={18} /> },
    { id: 'exercise', label: 'Exercise', icon: <ClipboardList size={18} /> },
    { id: 'quiz', label: 'Quiz', icon: <BookCheck size={18} /> },
    { id: 'exam', label: 'Previous Exam', icon: <FileQuestion size={18} /> },
  ];

  return (
    <div className="flex flex-col h-full min-w-0 bg-white rounded-2xl sm:rounded-3xl border border-outline/10 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-500">
      {/* Workspace Header */}
      <div className="bg-primary-container text-on-primary p-4 sm:p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between min-w-0">
        <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
          <button 
            type="button"
            onClick={onBack}
            className="p-2 shrink-0 min-h-11 min-w-11 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
            aria-label="Back"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-white/60 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">
              <span className="truncate max-w-[100%]">{subject.subjectName}</span>
              <span className="shrink-0" aria-hidden>/</span>
              <span className="truncate max-w-[100%]">{chapter.chapterName || chapter.title}</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black tracking-tight break-words">{topic.topicName}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3 py-2 sm:px-4 bg-white/10 rounded-xl border border-white/10 w-full sm:w-auto text-center">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-white/80">Editing Mode</span>
          </div>
        </div>
      </div>

      {/* Premium Tab Bar */}
      <div className="bg-white border-b border-outline/10 px-3 sm:px-8 flex items-center gap-3 sm:gap-6 md:gap-8 overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] no-scrollbar snap-x snap-mandatory">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 py-4 sm:py-6 shrink-0 snap-start whitespace-nowrap border-b-2 transition-all relative text-xs sm:text-sm font-bold ${
              activeTab === tab.id 
              ? 'border-primary-container text-primary-container' 
              : 'border-transparent text-outline hover:text-on-surface'
            }`}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-[-2px] left-0 right-0 h-1 bg-primary-container rounded-t-full shadow-[0_-4px_12px_rgba(0,86,210,0.4)]" />
            )}
          </button>
        ))}
      </div>

      {/* Workspace Content */}
      <div className="flex-grow overflow-y-auto overflow-x-hidden p-4 sm:p-8 md:p-10 bg-[#fafbfc] min-w-0">
        <div className="max-w-4xl mx-auto">
          {/* Objectives Tab */}
          {activeTab === 'objectives' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-outline/5 shadow-sm min-w-0">
                <h3 className="text-xl font-black mb-2">Topic Objectives</h3>
                <p className="text-outline text-sm mb-8">Define what students should achieve after completing this topic.</p>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 min-w-0">
                  <div className="relative flex-1 min-w-0">
                    <Target className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-outline pointer-events-none" size={20} />
                    <input 
                      value={newObjective} 
                      onChange={e => setNewObjective(e.target.value)} 
                      placeholder="e.g. Understand the fundamental principles of..." 
                      className="w-full bg-surface border border-outline/10 pl-12 sm:pl-14 pr-4 sm:pr-6 py-3.5 sm:py-4 rounded-2xl font-semibold focus:border-primary-container focus:ring-0 transition-all outline-none min-h-11 text-sm sm:text-base" 
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={handleAddObjective}
                    className="bg-primary-container text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-bold text-sm uppercase hover:shadow-lg hover:shadow-primary-container/20 transition-all whitespace-nowrap shrink-0 min-h-11 w-full sm:w-auto"
                  >
                    Add Goal
                  </button>
                </div>

                <div className="space-y-4">
                  {topicObjectives.length > 0 ? (
                    topicObjectives.map((obj, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between p-4 sm:p-5 bg-surface rounded-2xl border border-outline/5 group hover:border-primary-container/30 transition-all min-w-0">
                        <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
                          <div className="w-8 h-8 shrink-0 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container font-black text-xs">
                            {i + 1}
                          </div>
                          <span className="font-bold text-on-surface break-words min-w-0">{obj}</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setTopicObjectives(topicObjectives.filter((_, idx) => idx !== i))}
                          className="text-outline hover:text-error sm:opacity-0 sm:group-hover:opacity-100 transition-all p-2 hover:bg-error/5 rounded-lg self-end sm:self-auto shrink-0"
                        >
                          <Trash2 size={18}/>
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 opacity-40">
                      <Target size={48} className="mx-auto mb-4" />
                      <p className="font-bold">No objectives defined yet.</p>
                    </div>
                  )}
                </div>

                {topicObjectives.length > 0 && (
                  <button 
                    onClick={handleUpdateObjectives}
                    className="mt-10 bg-primary-container text-on-primary px-10 py-4 rounded-lg font-semibold text-sm uppercase flex items-center justify-center gap-2 w-full sm:w-auto hover:brightness-110 transition-all"
                  >
                    <Save size={18} /> Save All Objectives
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Concept Page Tab */}
          {activeTab === 'concept' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-outline/5 shadow-sm min-w-0 space-y-6">
                <div className="flex items-center justify-between mb-2">
                   <h3 className="text-xl font-black">Add New Concept</h3>
                   <div className="p-2 bg-primary-container/10 rounded-lg text-primary-container">
                     <BookOpen size={20} />
                   </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Concept Title</label>
                    <input 
                      value={newContent.title} 
                      onChange={e => setNewContent({...newContent, title: e.target.value, type: 'concept'})} 
                      placeholder="e.g. Introduction to..." 
                      className="w-full bg-surface border border-outline/10 px-6 py-4 rounded-2xl font-bold focus:border-primary-container outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Explanation & Content</label>
                    <textarea 
                      value={newContent.contentBody} 
                      onChange={e => setNewContent({...newContent, contentBody: e.target.value})} 
                      placeholder="Explain the concept in detail..." 
                      rows="8" 
                      className="w-full bg-surface border border-outline/10 px-6 py-4 rounded-2xl font-medium resize-none focus:border-primary-container outline-none transition-all" 
                    />
                  </div>
                  <button 
                    onClick={handleAddContent} 
                    disabled={isSavingContent || !newContent.title} 
                    className="w-full bg-primary-container text-white py-5 rounded-2xl font-bold text-sm uppercase hover:shadow-lg hover:shadow-primary-container/20 transition-all disabled:opacity-50"
                  >
                    {isSavingContent ? 'Saving...' : 'Publish Concept'}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-outline px-2">Published Concepts</h4>
                {topicContent.concepts.length > 0 ? (
                  topicContent.concepts.map(c => (
                    <div key={c._id} className="p-6 bg-white border border-outline/10 rounded-2xl flex justify-between items-center group hover:border-primary-container hover:shadow-md transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary-container/5 rounded-xl flex items-center justify-center text-primary-container">
                          <CheckCircle2 size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-on-surface">{c.title}</h4>
                          <p className="text-xs text-outline line-clamp-1">{c.content}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteContent(c._id, 'concept')} 
                        className="text-outline hover:text-error opacity-0 group-hover:opacity-100 transition-all p-2 hover:bg-error/5 rounded-lg"
                      >
                        <Trash2 size={18}/>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="bg-surface/50 border border-dashed border-outline/20 rounded-2xl p-12 text-center opacity-40">
                    <BookOpen size={40} className="mx-auto mb-3" />
                    <p className="text-sm font-bold">No concepts published yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Video Lessons Tab */}
          {activeTab === 'video' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-outline/5 shadow-sm min-w-0 space-y-6">
                <div className="flex items-center justify-between mb-2">
                   <h3 className="text-xl font-black">Add Video Lesson</h3>
                   <div className="p-2 bg-primary-container/10 rounded-lg text-primary-container">
                     <PlayCircle size={20} />
                   </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Lesson Title</label>
                    <input 
                      value={newContent.title} 
                      onChange={e => setNewContent({...newContent, title: e.target.value, type: 'video'})} 
                      placeholder="e.g. Masterclass on..." 
                      className="w-full bg-surface border border-outline/10 px-6 py-4 rounded-2xl font-bold focus:border-primary-container outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">YouTube / Video URL</label>
                    <input 
                      value={newContent.url} 
                      onChange={e => setNewContent({...newContent, url: e.target.value})} 
                      placeholder="https://youtube.com/watch?v=..." 
                      className="w-full bg-surface border border-outline/10 px-6 py-4 rounded-2xl font-bold focus:border-primary-container outline-none transition-all" 
                    />
                  </div>
                  <button 
                    onClick={handleAddContent} 
                    disabled={isSavingContent || !newContent.url} 
                    className="w-full bg-primary-container text-white py-5 rounded-2xl font-bold text-sm uppercase hover:shadow-lg hover:shadow-primary-container/20 transition-all disabled:opacity-50"
                  >
                    {isSavingContent ? 'Adding...' : 'Add Video to Topic'}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-outline px-2">Video Library</h4>
                {topicContent.videos.length > 0 ? (
                  topicContent.videos.map(v => (
                    <div key={v._id} className="p-6 bg-white border border-outline/10 rounded-2xl flex justify-between items-center group hover:border-primary-container hover:shadow-md transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-container/5 rounded-xl flex items-center justify-center text-primary-container">
                          <PlayCircle size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-on-surface">{v.title}</h4>
                          <p className="text-[10px] text-primary-container font-black truncate max-w-[150px]">{v.videoUrl}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteContent(v._id, 'video')} 
                        className="text-outline hover:text-error opacity-0 group-hover:opacity-100 transition-all p-2 hover:bg-error/5 rounded-lg"
                      >
                        <Trash2 size={18}/>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="bg-surface/50 border border-dashed border-outline/20 rounded-2xl p-12 text-center opacity-40">
                    <PlayCircle size={40} className="mx-auto mb-3" />
                    <p className="text-sm font-bold">No videos added yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Exercise Tab */}
          {activeTab === 'exercise' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-outline/5 shadow-sm min-w-0 space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black">Create Practice Exercise</h3>
                    <p className="text-sm text-outline mt-1">Add interactive questions for students to test their knowledge.</p>
                  </div>
                  <div className="p-3 bg-primary-container/10 rounded-2xl text-primary-container">
                    <ClipboardList size={24} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Exercise Title</label>
                    <input 
                      value={newContent.title} 
                      onChange={e => setNewContent({...newContent, title: e.target.value, type: 'exercise'})} 
                      placeholder="e.g. Basic Practice Q1"
                      className="w-full bg-surface border border-outline/10 px-6 py-4 rounded-2xl font-bold focus:border-primary-container outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Difficulty Level</label>
                    <div className="flex gap-2 p-1 bg-surface rounded-2xl border border-outline/10">
                      {['Easy', 'Medium', 'Hard'].map(d => (
                        <button 
                          key={d} 
                          onClick={() => setNewContent({...newContent, difficulty: d})} 
                          className={`flex-1 py-3 rounded-xl font-bold text-[10px] uppercase transition-all ${
                            newContent.difficulty === d 
                            ? 'bg-primary-container text-on-primary shadow-md'
                            : 'text-outline hover:text-on-surface'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Question Prompt</label>
                  <textarea 
                    value={newContent.question} 
                    onChange={e => setNewContent({...newContent, question: e.target.value})} 
                    rows="4" 
                    placeholder="Write the question here..."
                    className="w-full bg-surface border border-outline/10 px-6 py-4 rounded-2xl font-bold resize-none focus:border-primary-container outline-none transition-all" 
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Options (Select the correct one)</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {newContent.options.map((opt, i) => (
                      <div key={i} className={`relative flex items-center transition-all ${newContent.correctAnswer === i ? 'scale-[1.02]' : ''}`}>
                        <input 
                          value={opt} 
                          onChange={e => { const o = [...newContent.options]; o[i] = e.target.value; setNewContent({...newContent, options: o}); }} 
                          placeholder={`Option ${i+1}`} 
                          className={`w-full bg-surface border px-6 py-4 pr-14 rounded-2xl font-bold outline-none transition-all ${
                            newContent.correctAnswer === i 
                            ? 'border-primary-container ring-2 ring-primary-container/10' 
                            : 'border-outline/10 focus:border-primary-container/50'
                          }`} 
                        />
                        <button 
                          onClick={() => setNewContent({...newContent, correctAnswer: i})} 
                          className={`absolute right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            newContent.correctAnswer === i 
                            ? 'bg-primary-container border-primary-container text-white' 
                            : 'border-outline/20 hover:border-primary-container/50'
                          }`}
                        >
                          {newContent.correctAnswer === i && <CheckCircle2 size={14} />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleAddContent} 
                  className="w-full bg-primary-container text-on-primary py-5 rounded-lg font-semibold text-sm uppercase shadow-xl shadow-primary-container/10 hover:brightness-110 transition-all"
                >
                  Create Exercise Question
                </button>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-outline px-2">Exercise Inventory</h4>
                {topicContent.exercises.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {topicContent.exercises.map(e => (
                      <div key={e._id} className="p-6 bg-white border border-outline/10 rounded-2xl flex justify-between items-center group hover:border-primary-container transition-all">
                        <div className="flex items-center gap-4">
                          <div className={`px-2 py-1 rounded text-[8px] font-black uppercase ${
                            e.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                            e.difficulty === 'Medium' ? 'bg-orange-100 text-orange-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {e.difficulty}
                          </div>
                          <div>
                            <h4 className="font-bold text-on-surface">{e.title}</h4>
                            <p className="text-xs text-outline line-clamp-1">{e.question}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDeleteContent(e._id, 'exercise')} 
                          className="text-outline hover:text-error opacity-0 group-hover:opacity-100 transition-all p-2 hover:bg-error/5 rounded-lg"
                        >
                          <Trash2 size={18}/>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-surface/50 border border-dashed border-outline/20 rounded-2xl p-12 text-center opacity-40">
                    <ClipboardList size={40} className="mx-auto mb-3" />
                    <p className="text-sm font-bold">No exercises created yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quiz Tab */}
          {activeTab === 'quiz' && (
             <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-3xl border border-outline/5 shadow-sm animate-in zoom-in duration-500">
               <div className="w-20 h-20 bg-primary-container/10 rounded-3xl flex items-center justify-center text-primary-container mb-6">
                 <BookCheck size={40} />
               </div>
               <h3 className="text-2xl font-black mb-2">Quiz Builder</h3>
               <p className="text-outline text-sm max-w-sm mx-auto mb-8">The high-fidelity quiz builder is being integrated. You'll be able to create complex assessments here soon.</p>
               <div className="flex gap-2">
                 <div className="w-2 h-2 rounded-full bg-primary-container animate-bounce" />
                 <div className="w-2 h-2 rounded-full bg-primary-container animate-bounce [animation-delay:-.3s]" />
                 <div className="w-2 h-2 rounded-full bg-primary-container animate-bounce [animation-delay:-.5s]" />
               </div>
             </div>
          )}

          {/* Exam Tab */}
          {activeTab === 'exam' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-outline/5 shadow-sm min-w-0">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-black">Previous Exam Linkage</h3>
                    <p className="text-sm text-outline mt-1">Connect this topic to specific questions from past examination papers.</p>
                  </div>
                  <div className="p-3 bg-on-surface/5 rounded-2xl text-on-surface">
                    <Award size={24} />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Select Past Paper</label>
                    <select 
                      value={newContent.examPaperId} 
                      onChange={e => setNewContent({...newContent, examPaperId: e.target.value, type: 'examQuestion'})}
                      className="w-full bg-surface border border-outline/10 px-6 py-4 rounded-2xl font-bold focus:border-primary-container outline-none transition-all appearance-none"
                    >
                      <option value="">Choose an exam paper...</option>
                      {examPapers.map(paper => (
                        <option key={paper._id} value={paper._id}>{paper.title} ({paper.year})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Question Title/Reference</label>
                    <input 
                      value={newContent.title} 
                      onChange={e => setNewContent({...newContent, title: e.target.value, type: 'examQuestion'})} 
                      placeholder="e.g. 2023 National Exam Q15"
                      className="w-full bg-surface border border-outline/10 px-6 py-4 rounded-2xl font-bold focus:border-primary-container outline-none transition-all" 
                    />
                  </div>

                  <button 
                    onClick={handleAddContent}
                    disabled={!newContent.examPaperId || !newContent.title}
                    className="w-full bg-primary-container text-on-primary py-5 rounded-lg font-semibold text-sm uppercase hover:brightness-110 transition-all disabled:opacity-30"
                  >
                    Link Exam Question
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-outline px-2">Linked Exam Questions</h4>
                {topicContent.examQuestions.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {topicContent.examQuestions.map(q => (
                      <div key={q._id} className="p-6 bg-white border border-outline/10 rounded-2xl flex justify-between items-center group hover:border-on-surface transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-on-surface/5 rounded-xl flex items-center justify-center text-on-surface">
                            <FileQuestion size={20} />
                          </div>
                          <div>
                            <h4 className="font-bold text-on-surface">{q.questionText}</h4>
                            <p className="text-[10px] text-primary-container font-black uppercase tracking-wider">{q.paperTitle || 'External Paper'}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDeleteContent(q._id, 'examQuestion')} 
                          className="text-outline hover:text-error opacity-0 group-hover:opacity-100 transition-all p-2 hover:bg-error/5 rounded-lg"
                        >
                          <Trash2 size={18}/>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-surface/50 border border-dashed border-outline/20 rounded-2xl p-12 text-center opacity-40">
                    <Award size={40} className="mx-auto mb-3" />
                    <p className="text-sm font-bold">No exam questions linked yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopicWorkspace;
