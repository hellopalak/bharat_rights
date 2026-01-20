import React from 'react';
import { Bell, Info, Calendar } from 'lucide-react';

const NOTIFICATIONS = [
    {
        id: 1,
        title: 'New Scheme Added',
        message: 'PM-YASASVI Scholarship is now accepting applications.',
        time: '2 hours ago',
        type: 'info'
    },
    {
        id: 2,
        title: 'Application Reminder',
        message: 'Last date for PM-KISAN verification is approaching.',
        time: '1 day ago',
        type: 'urgent'
    },
    {
        id: 3,
        title: 'Profile Enhancement',
        message: 'Add your income details to explore more relevant schemes.',
        time: '3 days ago',
        type: 'suggestion'
    }
];

export const NotificationsDropdown = () => {
    return (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
            <div className="px-4 py-2 border-b border-slate-50 flex justify-between items-center">
                <h3 className="font-semibold text-slate-900">Notifications</h3>
                <span className="text-xs text-primary-600 font-medium cursor-pointer">Mark all read</span>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
                {NOTIFICATIONS.map(note => (
                    <div key={note.id} className="px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 cursor-pointer transition-colors">
                        <div className="flex gap-3">
                            <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${note.type === 'urgent' ? 'bg-red-500' : 'bg-primary-500'}`} />
                            <div>
                                <h4 className="text-sm font-medium text-slate-800">{note.title}</h4>
                                <p className="text-xs text-slate-500 mt-0.5">{note.message}</p>
                                <span className="text-[10px] text-slate-400 mt-1 block">{note.time}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="px-4 py-2 border-t border-slate-50 text-center">
                <button className="text-xs font-semibold text-slate-600 hover:text-primary-600">View All Notifications</button>
            </div>
        </div>
    );
};
