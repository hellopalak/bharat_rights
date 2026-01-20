import React, { useEffect, useState } from 'react';
import { Bell, Info, Calendar } from 'lucide-react';
import { notificationService, type Notification } from '../../services/notificationService';
import { useAuth } from '../../contexts/AuthContext';

export const NotificationsDropdown = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadNotifications();
        }
    }, [user]);

    const loadNotifications = async () => {
        if (!user) return;
        setLoading(true);
        const data = await notificationService.getNotifications(user.id);
        setNotifications(data);
        setLoading(false);
    };

    const handleMarkAllRead = async () => {
        if (!user) return;
        await notificationService.markAllAsRead(user.id);
        loadNotifications();
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    if (loading) {
        return (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-lg border border-slate-100 py-4 z-50 flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
            <div className="px-4 py-2 border-b border-slate-50 flex justify-between items-center">
                <h3 className="font-semibold text-slate-900">Notifications</h3>
                {notifications.length > 0 && (
                    <span
                        onClick={handleMarkAllRead}
                        className="text-xs text-primary-600 font-medium cursor-pointer hover:text-primary-700"
                    >
                        Mark all read
                    </span>
                )}
            </div>
            <div className="max-h-[300px] overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-slate-500 text-sm">
                        No new notifications
                    </div>
                ) : (
                    notifications.map(note => (
                        <div key={note.id} className={`px-4 py-3 border-b border-slate-50 last:border-0 cursor-pointer transition-colors ${note.read ? 'bg-white' : 'bg-slate-50 hover:bg-slate-100'}`}>
                            <div className="flex gap-3">
                                <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${note.type === 'urgent' ? 'bg-red-500' : 'bg-primary-500'}`} />
                                <div>
                                    <h4 className={`text-sm ${note.read ? 'font-normal text-slate-600' : 'font-semibold text-slate-900'}`}>
                                        {note.title}
                                    </h4>
                                    <p className="text-xs text-slate-500 mt-0.5">{note.message}</p>
                                    <span className="text-[10px] text-slate-400 mt-1 block">
                                        {/* Since we formatted it in service to be just date, let's use the raw created_at if we want relative time, 
                                            but the service returns it as 'time' property which is date string. 
                                            Wait, in my service implementation I mapped time to toLocaleDateString(). 
                                            I should probably use created_at for relative time calculation. */
                                            formatTime(note.created_at)
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {notifications.length > 0 && (
                <div className="px-4 py-2 border-t border-slate-50 text-center">
                    <button className="text-xs font-semibold text-slate-600 hover:text-primary-600">View All Notifications</button>
                </div>
            )}
        </div>
    );
};
