import { supabase } from '../lib/supabase';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'urgent' | 'suggestion';
    time: string;
    read: boolean;
    created_at: string;
    link?: string;
}

export const notificationService = {
    async getNotifications(userId: string) {
        if (!supabase) return [];

        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching notifications:', error);
            return [];
        }

        return data.map(n => ({
            ...n,
            time: new Date(n.created_at).toLocaleDateString() // distinct from relative time, handled in UI
        })) as Notification[];
    },

    async markAsRead(notificationId: string) {
        if (!supabase) return;

        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', notificationId);

        if (error) {
            console.error('Error marking notification as read:', error);
        }
    },

    async markAllAsRead(userId: string) {
        if (!supabase) return;

        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('user_id', userId);

        if (error) {
            console.error('Error marking all notifications as read:', error);
        }
    }
};
