import React from 'react';
import { MessageSquareDashed } from 'lucide-react';

const ManageDiscussionChannels = () => {
  return (
    <div className="mx-auto w-full max-w-[1440px] animate-in fade-in duration-500">
      <div className="rounded-xl border border-outline/10 bg-white p-16 shadow-sm flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-primary-container/10 rounded-xl border border-primary-container/10 flex items-center justify-center text-primary-container mb-8">
          <MessageSquareDashed size={32} />
        </div>
        <h2 className="text-3xl font-bold text-on-surface mb-4 tracking-tight">Discussions</h2>
        <p className="text-on-surface-variant max-w-lg mx-auto text-sm leading-relaxed font-medium">
          Discussion management is currently being configured. 
          Management tools will be available soon.
        </p>
      </div>
    </div>
  );
};

export default ManageDiscussionChannels;
