import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { BookOpen, Trash2, CheckCircle2, FileText, X, Paperclip, UploadCloud, Edit2 } from 'lucide-react';
import api, { resolvePublicApiOrigin } from '../services/api';

/** Split on blank lines so long pasted text reads as formal paragraphs */
const toParagraphBlocks = (text) => {
  const raw = String(text || '').replace(/\r\n/g, '\n').trim();
  if (!raw) return [];
  return raw
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
};

const ConceptBody = ({ content, isStudent }) => {
  const blocks = toParagraphBlocks(content);

  if (!isStudent) {
    return (
      <p className="text-sm text-on-surface-variant mt-3 leading-7 whitespace-pre-line line-clamp-3">
        {content}
      </p>
    );
  }

  return (
    <div className="mt-4 sm:mt-6 w-full min-w-0 max-w-[min(65ch,100%)] border-l-[3px] border-primary-container/25 pl-3 sm:pl-7 ml-0">
      <div className="space-y-4 sm:space-y-5">
        {blocks.map((block, idx) => (
          <p
            key={idx}
            className="text-base sm:text-[1.0625rem] leading-relaxed sm:leading-[1.75] text-on-surface font-normal tracking-normal whitespace-pre-line break-words"
          >
            {block}
          </p>
        ))}
      </div>
      {blocks.length === 0 && content && (
        <p className="text-base leading-relaxed text-on-surface whitespace-pre-line break-words">{content}</p>
      )}
    </div>
  );
};

const TopicConcept = () => {
  const { topic, isStudent } = useOutletContext();
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newConcept, setNewConcept] = useState({ title: '', content: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const fileInputRef = useRef(null);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchConcepts = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/content/topics/${topic._id}/concepts`);
      setConcepts(res.data || []);
    } catch (err) {
      console.error('Failed to fetch concepts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (topic?._id) fetchConcepts();
  }, [topic?._id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setFilePreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const [editingId, setEditingId] = useState(null);

  const handleEdit = (concept) => {
    setEditingId(concept._id);
    setNewConcept({ title: concept.title, content: concept.content });
    if (concept.contentImageUrl) {
      setFilePreview(`${resolvePublicApiOrigin()}${concept.contentImageUrl}`);
    } else {
      setFilePreview(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewConcept({ title: '', content: '' });
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddConcept = async () => {
    if (!newConcept.title.trim()) {
      return showToast('Concept title is required.', 'error');
    }
    if (!newConcept.content.trim()) {
      return showToast('Concept content is required.', 'error');
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', newConcept.title.trim());
      formData.append('content', newConcept.content.trim());
      if (selectedFile) {
        formData.append('contentImage', selectedFile);
      }

      if (editingId) {
        await api.put(`/content/concepts/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Concept updated successfully!');
      } else {
        await api.post(`/content/topics/${topic._id}/concepts`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('New concept published to topic successfully!');
      }

      setNewConcept({ title: '', content: '' });
      setSelectedFile(null);
      setFilePreview(null);
      setEditingId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchConcepts();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to process concept. Please check your file size and type.';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this concept and its associated files?')) return;
    try {
      await api.delete(`/content/concepts/${id}`);
      showToast('Concept permanently removed.');
      if (editingId === id) handleCancelEdit();
      fetchConcepts();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete concept.';
      showToast(msg, 'error');
    }
  };

  return (
    <div className="py-4 sm:py-6 space-y-6 sm:space-y-10 animate-in slide-in-from-bottom-4 duration-500 w-full min-w-0 overflow-x-hidden">
      {toast.show && (
        <div
          className={`fixed bottom-4 right-4 z-[100] px-6 py-3 rounded-xl shadow-lg border ${
            toast.type === 'error'
              ? 'bg-error/10 border-error/20 text-error'
              : 'bg-primary-container/10 border-primary-container/20 text-primary-container'
          }`}
        >
          <p className="font-bold">{toast.message}</p>
        </div>
      )}

      <div className={`grid grid-cols-1 ${isStudent ? '' : 'lg:grid-cols-2'} gap-6 sm:gap-10 min-w-0`}>
        {!isStudent && (
          <div className="bg-white p-4 sm:p-10 rounded-xl border border-outline-variant shadow-[0px_8px_24px_rgba(0,0,0,0.08)] space-y-8 h-fit">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-on-surface">{editingId ? 'Edit Concept' : 'Concept Builder'}</h3>
                <p className="text-on-surface-variant/60 text-sm font-medium mt-1">
                  {editingId ? 'Modify existing learning material.' : 'Design and publish learning materials.'}
                </p>
              </div>
              <div className="w-14 h-14 bg-primary-container/5 rounded-xl flex items-center justify-center text-primary-container border border-primary-container/10">
                <BookOpen size={28} />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Concept Title</label>
                <input
                  value={newConcept.title}
                  onChange={(e) => setNewConcept({ ...newConcept, title: e.target.value })}
                  placeholder="e.g. Fundamental Principles of..."
                  className="w-full bg-white border border-outline/20 px-6 py-4 rounded-xl font-bold text-on-surface focus:border-primary-container outline-none transition-all shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Content & Explanation</label>
                <textarea
                  value={newConcept.content}
                  onChange={(e) => setNewConcept({ ...newConcept, content: e.target.value })}
                  placeholder="Explain the topic in depth..."
                  rows="6"
                  className="w-full bg-white border border-outline/20 px-6 py-4 rounded-xl font-medium text-on-surface resize-none focus:border-primary-container outline-none transition-all shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">
                  Supporting Assets (Images/PDF)
                </label>
                <div
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
                  }}
                  onClick={() => fileInputRef.current.click()}
                  className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${selectedFile ? 'border-primary-container bg-primary-container/5' : 'border-outline/20 hover:border-primary-container/40 hover:bg-surface'}`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,application/pdf"
                  />

                  {selectedFile ? (
                    <div className="flex flex-col items-center gap-3">
                      {filePreview ? (
                        <div className="w-32 h-32 rounded-lg overflow-hidden border border-outline/10 shadow-sm relative group">
                          <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFile(null);
                              setFilePreview(null);
                            }}
                            className="absolute inset-0 bg-on-surface/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                          >
                            <X size={24} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-outline/10 shadow-sm">
                          <div className="p-2 bg-primary-container/10 rounded-lg text-primary-container">
                            {selectedFile.type.includes('pdf') ? <FileText size={20} /> : <Paperclip size={20} />}
                          </div>
                          <div className="text-left">
                            <p className="text-xs font-bold text-on-surface truncate max-w-[150px]">{selectedFile.name}</p>
                            <p className="text-[10px] text-outline">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFile(null);
                            }}
                            className="p-1 hover:bg-error/5 text-outline hover:text-error transition-colors rounded"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <UploadCloud size={40} className="mx-auto text-outline/40 mb-3" />
                      <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                        Click to upload assets
                      </p>
                      <p className="text-[10px] text-outline mt-1 font-medium">Max size: 20MB (JPG, PNG, PDF)</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-grow bg-white border border-outline/20 text-on-surface px-6 py-5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-surface transition-all"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleAddConcept}
                  disabled={isSaving || !newConcept.title}
                  className={`flex-grow ${editingId ? 'bg-primary-container' : 'bg-on-surface'} text-white py-5 rounded-xl font-bold text-xs uppercase tracking-widest hover:brightness-110 active:opacity-80 transition-all shadow-xl shadow-on-surface/10 disabled:opacity-50`}
                >
                  {isSaving ? 'Processing...' : editingId ? 'Update Concept' : 'Publish Concept'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6 min-w-0">
          <h4 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant px-1">
            {isStudent ? 'Concept notes' : 'Knowledge base'}{' '}
            {!isStudent && `(${concepts.length})`}
          </h4>
          {loading ? (
            <div className="flex justify-center py-20 bg-white rounded-xl border border-outline/5">
              <div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin" />
            </div>
          ) : concepts.length > 0 ? (
            <div className={`space-y-8 ${isStudent ? '' : ''}`}>
              {concepts.map((c) => (
                <article
                  key={c._id}
                  className={`flex flex-col gap-6 group transition-all duration-300 min-w-0 ${
                    isStudent
                      ? 'rounded-xl border border-outline/10 bg-card px-4 py-6 sm:px-8 sm:py-10 shadow-sm'
                      : 'p-6 rounded-xl border border-outline-variant bg-white hover:border-primary-container hover:shadow-[0px_12px_32px_rgba(0,0,0,0.07)]'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className={`flex gap-6 w-full min-w-0 ${isStudent ? 'items-start' : 'items-center'}`}>
                      {!isStudent && (
                        <div className="w-12 h-12 rounded-xl bg-primary-container/5 flex items-center justify-center text-primary-container border border-primary-container/10 group-hover:bg-primary-container group-hover:text-white transition-all shrink-0">
                          <CheckCircle2 size={24} />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        {!isStudent && (
                          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant mb-2">
                            Concept note
                          </p>
                        )}
                        {isStudent && (
                          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant mb-3">
                            Reading
                          </p>
                        )}
                        <h4
                          className={`font-semibold text-on-surface tracking-tight ${
                            isStudent ? 'text-xl sm:text-2xl leading-snug' : 'text-lg leading-tight'
                          }`}
                        >
                          {c.title}
                        </h4>
                        <ConceptBody content={c.content} isStudent={isStudent} />
                      </div>
                    </div>
                    {!isStudent && (
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                        <button
                          type="button"
                          onClick={() => handleEdit(c)}
                          className="text-outline hover:text-primary-container p-2.5 hover:bg-primary-container/5 rounded-lg"
                          title="Edit Concept"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(c._id)}
                          className="text-outline hover:text-error p-2.5 hover:bg-error/5 rounded-lg"
                          title="Delete Concept"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    )}
                  </div>

                  {c.contentImageUrl && (
                    <div
                      className={`rounded-xl overflow-hidden border border-outline/10 bg-surface/50 max-w-full ${isStudent ? '' : 'sm:ml-[72px]'}`}
                    >
                      {c.contentImageUrl.toLowerCase().endsWith('.pdf') ? (
                        <div className="flex items-center gap-3 p-5">
                          <div className="w-10 h-10 bg-error/10 text-error rounded-lg flex items-center justify-center">
                            <FileText size={20} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-on-surface">Supporting document (PDF)</p>
                            <a
                              href={`${resolvePublicApiOrigin()}${c.contentImageUrl}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-primary-container font-semibold uppercase tracking-wider hover:underline mt-1 inline-block"
                            >
                              Download file
                            </a>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={`${resolvePublicApiOrigin()}${c.contentImageUrl}`}
                          alt=""
                          className="max-h-[min(50vh,28rem)] w-full max-w-full mx-auto object-contain bg-surface/30"
                        />
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-surface/50 border border-dashed border-outline/20 rounded-xl py-24 text-center">
              <BookOpen size={56} className="mx-auto mb-4 text-outline/40" />
              <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest">
                No concept notes published yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopicConcept;
