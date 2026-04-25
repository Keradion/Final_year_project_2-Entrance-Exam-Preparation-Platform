import React from 'react';
import { MessageSquareDashed } from 'lucide-react';

const ManageDiscussionChannels = () => {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-2">
      <div className="rounded-lg border border-outline/10 bg-white p-12 shadow-sm flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-primary-container/10 rounded-full flex items-center justify-center text-primary-container mb-6">
          <MessageSquareDashed size={32} />
        </div>
        <h2 className="text-2xl font-bold text-on-surface mb-2">Discussion Infrastructure</h2>
        <p className="text-on-surface-variant max-w-md mx-auto">
          The collaborative communication engine is currently undergoing institutional verification. Management capabilities will be enabled in the next deployment phase.
        </p>
      </div>
    </div>
  );
};

export default ManageDiscussionChannels;
