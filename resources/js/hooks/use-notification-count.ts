import { useState, useEffect } from 'react';
import axios from 'axios';

export function useNotificationCount() {
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchCount = async () => {
        try {
            const response = await axios.get('/notifications');
            setUnreadCount(response.data.unread_count);
        } catch (error) {
            console.error('Failed to fetch notification count:', error);
        }
    };

    useEffect(() => {
        fetchCount();

        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchCount, 30000);

        return () => clearInterval(interval);
    }, []);

    return { unreadCount, refreshCount: fetchCount };
}
