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
    },

    // New: Send a notification to a specific user
    async sendNotification(userId: string, notification: Omit<Notification, 'id' | 'created_at' | 'read'>) {
        if (!supabase) return;

        const { error } = await supabase
            .from('notifications')
            .insert({
                user_id: userId,
                title: notification.title,
                message: notification.message,
                type: notification.type,
                link: notification.link,
                read: false
            });

        if (error) {
            console.error('Error sending notification:', error);
            throw error;
        }
    },

    // New: Broadcast (Note: For large user bases, use the SQL function 'broadcast_notification' instead)
    async broadcastNotification(notification: Omit<Notification, 'id' | 'created_at' | 'read'>) {
        if (!supabase) return;

        // 1. Fetch all user profiles
        const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('id');

        if (profileError || !profiles) {
            console.error('Error fetching profiles for broadcast:', profileError);
            return;
        }

        // 2. Prepare batch inserts
        const notifications = profiles.map(profile => ({
            user_id: profile.id,
            title: notification.title,
            message: notification.message,
            type: notification.type,
            link: notification.link,
            read: false
        }));

        // 3. Insert in batches
        const { error } = await supabase
            .from('notifications')
            .insert(notifications);

        if (error) {
            console.error('Error broadcasting notifications:', error);
            throw error;
        }
    }
};
