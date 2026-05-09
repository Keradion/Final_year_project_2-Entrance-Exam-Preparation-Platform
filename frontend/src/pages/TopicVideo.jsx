import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Bot, PlayCircle, Trash2, Save, Video, VideoOff, Edit2 } from 'lucide-react';
import api from '../services/api';

const TopicVideo = () => {
  const { topic, isStudent } = useOutletContext();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newVideo, setNewVideo] = useState({ title: '', videoUrl: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/content/topics/${topic._id}/videos`);
      setVideos(res.data || []);
    } catch (err) {
      console.error('Failed to fetch videos', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (topic?._id) fetchVideos();
  }, [topic?._id]);

  const [editingId, setEditingId] = useState(null);

  const handleEdit = (video) => {
    setEditingId(video._id);
    setNewVideo({ title: video.title, videoUrl: video.videoUrl });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewVideo({ title: '', videoUrl: '' });
  };

  const handleAddVideo = async () => {
    if (!newVideo.title.trim()) {
      return showToast('Please provide a title for the video.', 'error');
    }
    if (!newVideo.videoUrl.trim()) {
      return showToast('Please provide a valid video URL.', 'error');
    }

    setIsSaving(true);
    try {
      if (editingId) {
        await api.put(`/content/videos/${editingId}`, {
          title: newVideo.title.trim(),
          videoUrl: newVideo.videoUrl.trim()
        });
        showToast('Video lesson updated successfully!');
      } else {
        await api.post(`/content/topics/${topic._id}/videos`, {
          title: newVideo.title.trim(),
          videoUrl: newVideo.videoUrl.trim()
        });
        showToast('Video lesson published successfully!');
      }
      setNewVideo({ title: '', videoUrl: '' });
      setEditingId(null);
      fetchVideos();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to process video lesson.';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this video lesson? Students will no longer be able to access it.')) return;
    try {
      await api.delete(`/content/videos/${id}`);
      showToast('Video lesson removed.');
      if (editingId === id) handleCancelEdit();
      fetchVideos();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to remove video.';
      showToast(msg, 'error');
    }
  };

  const getEmbeddableUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
    if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'www.youtube.com/embed/');
    if (url.includes('vimeo.com/')) return url.replace('vimeo.com/', 'player.vimeo.com/video/');
    if (url.includes('/embed/')) return url;
    return '';
  };

  const getVideoSummary = (video) => {
    const topicName = topic?.topicName || 'this topic';
    const title = video?.title || 'This video lesson';
    return `${title} supports your study of ${topicName}. Focus on the main definitions, worked examples, and any problem-solving steps shown in the lesson. After watching, try to explain the key idea in your own words and connect it to the topic exercises or quiz questions.`;
  };

  return (
    <div className="py-4 sm:py-6 space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-500 w-full min-w-0 overflow-x-hidden">
      {toast.show && (
        <div className={`fixed bottom-4 right-4 z-[100] px-6 py-3 rounded-xl shadow-lg border ${toast.type === 'error' ? 'bg-error/10 border-error/20 text-error' : 'bg-primary-container/10 border-primary-container/20 text-primary-container'}`}>
          <p className="font-bold">{toast.message}</p>
        </div>
      )}
      
      <div className="bg-white p-4 sm:p-10 rounded-xl border border-outline-variant shadow-[0px_8px_24px_rgba(0,0,0,0.08)] w-full min-w-0 overflow-hidden">
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-10 min-w-0">
          <div className="min-w-0">
            <h3 className="text-xl sm:text-2xl font-bold text-on-surface break-words">{isStudent ? 'Lecture Hall' : (editingId ? 'Edit Video Lesson' : 'Video Lessons')}</h3>
            <p className="text-on-surface-variant/60 text-sm font-medium mt-1">{isStudent ? 'Access instructional videos and masterclasses.' : (editingId ? 'Modify existing instructional video.' : 'Embed instructional videos and masterclasses.')}</p>
          </div>
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-600 border border-rose-500/20 shrink-0">
            <Video size={24} />
          </div>
        </div>

        <div className={`grid grid-cols-1 ${isStudent ? '' : 'lg:grid-cols-2'} gap-6 sm:gap-10 min-w-0`}>
          {!isStudent && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Video Title</label>
                <input 
                  value={newVideo.title} 
                  onChange={e => setNewVideo({...newVideo, title: e.target.value})} 
                  placeholder="e.g. Masterclass: Part 1" 
                  className="w-full bg-white border border-outline/20 px-6 py-4 rounded-xl font-bold text-on-surface focus:border-primary-container outline-none transition-all shadow-sm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Video Source URL (YouTube/Vimeo)</label>
                <input 
                  value={newVideo.videoUrl} 
                  onChange={e => setNewVideo({...newVideo, videoUrl: e.target.value})} 
                  placeholder="https://youtube.com/watch?v=..." 
                  className="w-full bg-white border border-outline/20 px-6 py-4 rounded-xl font-medium text-on-surface focus:border-primary-container outline-none transition-all shadow-sm" 
                />
              </div>
              <div className="flex gap-4">
                {editingId && (
                  <button 
                    onClick={handleCancelEdit} 
                    className="flex-grow bg-white border border-outline/20 text-on-surface px-6 py-5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-surface transition-all"
                  >
                    Cancel
                  </button>
                )}
                <button 
                  onClick={handleAddVideo} 
                  disabled={isSaving || !newVideo.videoUrl} 
                  className={`flex-grow ${editingId ? 'bg-primary-container' : 'bg-on-surface'} text-white py-5 rounded-xl font-bold text-xs uppercase tracking-widest hover:brightness-110 active:opacity-80 transition-all shadow-xl shadow-on-surface/10 disabled:opacity-50 flex items-center justify-center gap-3`}
                >
                  <Save size={20} /> {isSaving ? 'Processing...' : (editingId ? 'Update Video' : 'Add Video to Topic')}
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Video Library</label>
            {loading ? (
              <div className="flex justify-center p-6 sm:p-8"><div className="w-6 h-6 border-2 border-primary-container border-t-transparent rounded-full animate-spin" /></div>
            ) : videos.length > 0 ? (
              <div className="space-y-4">
                {videos.map(v => (
                  <div key={v._id} className={`p-4 sm:p-6 bg-white border border-outline/10 rounded-xl flex flex-col gap-4 group hover:border-primary-container transition-all shadow-sm min-w-0`}>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 min-w-0">
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        <div className="w-12 h-12 bg-primary-container/5 rounded-xl flex items-center justify-center text-primary-container">
                          <PlayCircle size={24} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-on-surface text-base sm:text-lg leading-tight break-words">{v.title}</h4>
                          <p className="text-[10px] font-medium text-outline uppercase tracking-widest mt-1">Institutional Resource</p>
                        </div>
                      </div>
                      {!isStudent && (
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                          <button 
                            onClick={() => handleEdit(v)} 
                            className="text-outline hover:text-primary-container p-2.5 hover:bg-primary-container/5 rounded-lg"
                            title="Edit Video"
                          >
                            <Edit2 size={16}/>
                          </button>
                          <button 
                            onClick={() => handleDelete(v._id)} 
                            className="text-outline hover:text-error p-2.5 hover:bg-error/5 rounded-lg"
                            title="Delete Video"
                          >
                            <Trash2 size={16}/>
                          </button>
                        </div>
                      )}
                    </div>
                    {isStudent && (
                      getEmbeddableUrl(v.videoUrl) ? (
                        <div className="mt-2 space-y-4 w-full min-w-0">
                          <div className="relative aspect-video w-full max-w-full mx-auto rounded-xl overflow-hidden bg-black/5 border border-outline/5 shadow-inner">
                            <iframe
                              src={getEmbeddableUrl(v.videoUrl)}
                              title={v.title}
                              className="absolute inset-0 w-full h-full border-none"
                              allowFullScreen
                            />
                          </div>
                          <div className="max-w-full mx-auto rounded-xl border border-primary-container/15 bg-primary-container/5 p-4 sm:p-5 min-w-0">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-xl bg-primary-container/10 text-primary-container flex items-center justify-center shrink-0">
                                <Bot size={20} />
                              </div>
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary-container">AI Summary</p>
                                <p className="text-sm text-on-surface-variant leading-6 mt-2">{getVideoSummary(v)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <a
                          href={v.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 rounded-xl border border-primary-container/15 bg-primary-container/5 p-5 flex items-center justify-between gap-4 hover:bg-primary-container/10 transition-colors"
                        >
                          <div>
                            <p className="text-sm font-bold text-on-surface">Open matching video lessons</p>
                            <p className="text-xs text-on-surface-variant mt-1 break-all">{v.videoUrl}</p>
                          </div>
                          <PlayCircle className="text-primary-container shrink-0" size={26} />
                        </a>
                      )
                    )}
                    {!isStudent && <p className="text-[10px] text-outline truncate px-2 font-medium">{v.videoUrl}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-surface/50 border border-dashed border-outline/20 rounded-xl p-12 text-center opacity-40">
                <VideoOff size={40} className="mx-auto mb-3" />
                <p className="text-sm font-bold">No videos added yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicVideo;
