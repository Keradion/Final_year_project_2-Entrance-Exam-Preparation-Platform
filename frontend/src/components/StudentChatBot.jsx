import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bot, Maximize2, Minimize2, Send, X } from 'lucide-react';
import { askAiTutor } from '../services/ai';

const normalizeMathText = (text) => String(text)
  .replace(/\\times/g, ' x ')
  .replace(/×/g, ' x ')
  .replace(/÷/g, ' / ')
  .replace(/−/g, '-')
  .replace(/≤/g, '<=')
  .replace(/≥/g, '>=')
  .replace(/≠/g, '!=')
  .replace(/≈/g, '~')
  .replace(/√/g, 'sqrt')
  .replace(/π/g, 'pi')
  .replace(/∞/g, 'infinity')
  .replace(/[“”]/g, '"')
  .replace(/[‘’]/g, "'");

const isMathLine = (line) => {
  const value = line.trim();
  if (!value) return false;
  return /[=+\-*/^<>]|sqrt|frac|\\\(|\\\[|\$/.test(value)
    && /[0-9a-zA-Z)]/.test(value);
};

const renderInlineText = (text, allowMarkdown = true) => {
  if (!allowMarkdown) {
    return <React.Fragment>{normalizeMathText(text)}</React.Fragment>;
  }
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-bold">{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={index}>{normalizeMathText(part)}</React.Fragment>;
  });
};

const renderMessageText = (text, isUser) => {
  if (isUser) {
    return <p className="whitespace-pre-wrap">{text}</p>;
  }

  const blocks = String(text)
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (blocks.length === 0) return null;

  return (
    <div className="space-y-3">
      {blocks.map((block, blockIndex) => {
        const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
        const isBulletList = lines.every((line) => /^[-*•]\s+/.test(line));
        const isNumberedList = lines.every((line) => /^\d+[.)]\s+/.test(line));
        const heading = block.match(/^#{1,3}\s+(.+)$/);
        const isFormulaBlock = lines.some(isMathLine) && lines.length <= 4;

        if (heading) {
          return (
            <p key={blockIndex} className="font-bold text-on-surface">
              {renderInlineText(heading[1])}
            </p>
          );
        }

        if (isBulletList) {
          return (
            <ul key={blockIndex} className="list-disc pl-5 space-y-1">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>{renderInlineText(line.replace(/^[-*•]\s+/, ''))}</li>
              ))}
            </ul>
          );
        }

        if (isNumberedList) {
          return (
            <ol key={blockIndex} className="list-decimal pl-5 space-y-1">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>{renderInlineText(line.replace(/^\d+[.)]\s+/, ''))}</li>
              ))}
            </ol>
          );
        }

        if (isFormulaBlock) {
          return (
            <pre key={blockIndex} className="whitespace-pre-wrap font-mono text-[13px] leading-6 bg-surface border border-outline/10 rounded-lg px-3 py-2 overflow-x-auto">
              {normalizeMathText(lines.join('\n'))}
            </pre>
          );
        }

        return (
          <p key={blockIndex} className="whitespace-pre-line">
            {renderInlineText(normalizeMathText(lines.join('\n')), !lines.some(isMathLine))}
          </p>
        );
      })}
    </div>
  );
};

const StudentChatBot = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi, I am your AI tutor. Ask me about a topic, exercise, concept, quiz, or exam.' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const routeContext = useMemo(() => {
    const match = location.pathname.match(/\/curriculum\/topic\/([^/]+)(?:\/([^/]+))?/);
    return {
      topicId: match?.[1],
      page: match?.[2],
    };
  }, [location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = message.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { role: 'user', text }]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await askAiTutor({
        message: text,
        topicId: routeContext.topicId,
        page: routeContext.page,
      });
      setMessages((prev) => [...prev, { role: 'assistant', text: response?.data?.answer || 'No response.' }]);
    } catch (err) {
      const errorText = err.response?.data?.message || 'The AI tutor could not answer right now.';
      setMessages((prev) => [...prev, { role: 'assistant', text: errorText, isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed z-[90] rounded-full bg-error text-white shadow-xl shadow-error/30 flex items-center justify-center gap-1.5 sm:gap-2 pl-3 pr-3 sm:pl-4 sm:pr-4 py-3 min-h-11 min-w-11 sm:min-w-0 bottom-[max(1rem,env(safe-area-inset-bottom,0px)+0.5rem)] right-[max(1rem,env(safe-area-inset-right,0px))] sm:bottom-6 sm:right-6 hover:brightness-110 active:scale-95 transition-all"
        title="Ask AI tutor"
      >
        <Bot size={24} className="sm:w-[26px] sm:h-[26px] shrink-0" />
        <span className="text-xs sm:text-sm font-black whitespace-nowrap">AI Tutor</span>
      </button>

      {isOpen && (
        <div
          className={`fixed z-[100] bg-white border border-outline/10 shadow-2xl overflow-hidden flex flex-col min-w-0 max-w-[100vw] transition-all duration-200 ${
            isExpanded
              ? 'inset-3 sm:inset-4 rounded-2xl pb-[env(safe-area-inset-bottom,0px)]'
              : 'inset-x-3 top-3 bottom-[max(5rem,calc(env(safe-area-inset-bottom,0px)+5rem))] sm:inset-auto sm:right-6 sm:top-auto sm:bottom-24 sm:w-[min(380px,calc(100vw-3rem))] sm:h-[min(620px,85vh)] max-h-[calc(100vh-5.5rem)] sm:max-h-[calc(100vh-6rem)] rounded-2xl pb-[env(safe-area-inset-bottom,0px)]'
          }`}
        >
          <div className="p-3 sm:p-4 bg-error text-white flex items-center justify-between gap-2 shrink-0 relative z-10 min-w-0">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Bot size={20} className="shrink-0" />
              <div className="min-w-0">
                <p className="font-bold text-sm truncate">AI Tutor</p>
                <p className="text-[10px] sm:text-[11px] opacity-80 truncate">{routeContext.topicId ? 'Topic-aware chat' : 'General study chat'}</p>
              </div>
            </div>
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsExpanded((value) => !value)}
                className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center hover:bg-white/10 rounded-lg shrink-0 min-h-11 min-w-11 sm:min-h-0 sm:min-w-0"
                aria-label={isExpanded ? 'Minimize AI tutor' : 'Expand AI tutor'}
                title={isExpanded ? 'Minimize' : 'Full screen'}
              >
                {isExpanded ? <Minimize2 size={19} /> : <Maximize2 size={19} />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsExpanded(false);
                }}
                className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center hover:bg-white/10 rounded-lg shrink-0 min-h-11 min-w-11 sm:min-h-0 sm:min-w-0"
                aria-label="Close AI tutor"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className={`flex-1 min-h-0 overflow-y-auto overscroll-contain overflow-x-hidden p-3 sm:p-4 space-y-3 bg-surface/40 ${isExpanded ? 'sm:px-8' : ''}`}>
            {messages.map((item, idx) => (
              <div
                key={`${item.role}-${idx}`}
                className={`p-3 rounded-xl text-sm leading-relaxed min-w-0 break-words ${
                  item.role === 'user'
                    ? `bg-error text-white ml-auto max-w-[min(100%,85%)] ${isExpanded ? 'sm:max-w-2xl' : ''}`
                    : item.isError
                      ? `bg-error/10 text-error border border-error/20 mr-auto ${isExpanded ? 'max-w-3xl' : 'max-w-full'}`
                      : `bg-white border border-outline/10 text-on-surface mr-auto ${isExpanded ? 'max-w-3xl' : 'max-w-full'}`
                }`}
              >
                {renderMessageText(item.text, item.role === 'user')}
              </div>
            ))}
            {isLoading && (
              <div className="bg-white border border-outline/10 rounded-xl p-3 text-sm text-on-surface-variant mr-8">
                Thinking...
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-3 border-t border-outline/10 flex gap-2 bg-white shrink-0 min-w-0 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask a study question..."
              className="min-w-0 flex-1 border border-outline/20 rounded-xl px-3 py-2.5 min-h-11 text-sm outline-none focus:border-error"
            />
            <button
              type="submit"
              disabled={isLoading || !message.trim()}
              className="bg-error text-white rounded-xl px-4 min-h-11 min-w-11 shrink-0 flex items-center justify-center disabled:opacity-50 hover:brightness-110 transition-all"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default StudentChatBot;
