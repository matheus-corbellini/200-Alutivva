import { useState, useCallback, useEffect } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationState {
    isVisible: boolean;
    type: NotificationType;
    title: string;
    message: string;
}

export const useNotification = () => {
    const [notification, setNotification] = useState<NotificationState>({
        isVisible: false,
        type: 'success',
        title: '',
        message: ''
    });

    const showNotification = useCallback((type: NotificationType, title: string, message: string) => {
        if (!title || !message) {
            console.warn("Tentativa de mostrar notificação com dados inválidos:", { type, title, message });
            return;
        }
        setNotification({ isVisible: true, type, title, message });
    }, []);

    const hideNotification = useCallback(() => {
        setNotification(prev => ({ ...prev, isVisible: false, title: '', message: '' }));
    }, []);

    useEffect(() => {
        if (notification.isVisible && (!notification.title || !notification.message)) {
            setNotification({ isVisible: false, type: 'success', title: '', message: '' });
        }
    }, [notification]);

    return {
        notification,
        showNotification,
        hideNotification
    };
};
