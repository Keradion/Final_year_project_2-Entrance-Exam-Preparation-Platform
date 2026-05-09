import React, { useEffect, useMemo, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { TriangleAlert } from 'lucide-react';
import { createIssue, getMyIssues } from '../services/engagement';

const TopicReports = () => {
  const { topicId } = useParams();
  const { topic } = useOutletContext();
  const [issueText, setIssueText] = useState('');
  const [issues, setIssues] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const topicIssues = useMemo(
    () => issues.filter((issue) => {
      const issueTopicId = issue.topicId?._id || issue.topicId;
      return String(issueTopicId) === String(topicId);
    }),
    [issues, topicId]
  );

  const fetchIssues = async () => {
    try {
      const res = await getMyIssues();
      setIssues(res?.data || []);
    } catch (_err) {
      setIssues([]);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = issueText.trim();
    if (!trimmed) return;

    try {
      setIsSubmitting(true);
      await createIssue({ topicId, issueDescription: trimmed });
      setIssueText('');
      setFeedback('Report submitted.');
      await fetchIssues();
    } catch (err) {
      setFeedback(err?.response?.data?.message || 'Could not submit report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-4 sm:py-6 space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-500 w-full min-w-0 overflow-x-hidden">
      <div className="bg-white p-4 sm:p-8 rounded-xl border border-outline-variant shadow-sm min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 mb-4 min-w-0">
          <div className="w-11 h-11 sm:w-12 sm:h-12 bg-primary-container/5 rounded-xl flex items-center justify-center text-primary-container border border-primary-container/10 shrink-0">
            <TriangleAlert size={24} />
          </div>
          <div className="min-w-0">
            <h3 className="text-xl sm:text-2xl font-bold text-on-surface break-words">Report Topic Issue</h3>
            <p className="text-sm text-on-surface-variant mt-1 break-words">Report wrong answers, missing content, or confusing material for {topic?.topicName || 'this topic'}.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={issueText}
            onChange={(e) => { setIssueText(e.target.value); setFeedback(''); }}
            placeholder="Describe the issue..."
            rows={4}
            className="w-full border border-outline/20 rounded-xl px-4 py-3 text-sm"
          />
          <button disabled={isSubmitting} className="w-full sm:w-auto bg-primary-container text-white px-5 py-3 rounded-xl font-semibold text-sm disabled:opacity-50 min-h-11">
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
          {feedback && <p className="text-xs font-semibold text-primary-container">{feedback}</p>}
        </form>
      </div>

      <div className="space-y-3">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-outline px-2">My Reports For This Topic ({topicIssues.length})</h4>
        {topicIssues.map((issue) => (
          <div key={issue._id} className="p-4 rounded-xl border border-outline/10 bg-surface">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-sm">{issue.title}</p>
              <span className="text-[11px] px-2 py-1 rounded bg-primary-container/10 text-primary-container capitalize">{issue.issueStatus}</span>
            </div>
            <p className="text-xs text-on-surface-variant mt-2">{issue.issueDescription}</p>
            {issue.response && <p className="text-xs text-primary-container mt-2">Outcome: {issue.response}</p>}
          </div>
        ))}
        {topicIssues.length === 0 && (
          <div className="py-14 text-center rounded-xl border border-dashed border-outline/20 text-on-surface-variant">
            No reports for this topic yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicReports;
