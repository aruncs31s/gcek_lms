import { useState, useEffect, useRef } from 'react';
import { api } from '../lib/api';
import { BellIcon } from '@heroicons/react/24/outline';

interface Notification {
    id: string;
    title: string;
    message: string;
    is_read: boolean;
    type: string;
    created_at: string;
}

export default function NotificationBell() {
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchUnreadCount = async () => {
        try {
            const res = await api.get('/notifications/unread-count');
            setUnreadCount(res.data.count || 0);
        } catch (err) {
            console.error("Failed to fetch unread count", err);
        }
    };

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data || []);
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        }
    };

    useEffect(() => {
        // Fetch initially
        fetchUnreadCount();
        // Poll every 30 seconds for new notifications
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    const toggleDropdown = () => {
        if (!isOpen) {
            fetchNotifications();
        }
        setIsOpen(!isOpen);
    };

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleMarkAsRead = async (id: string) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
            // Update the count immediately for good UX
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error("Failed to mark as read", err);
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.is_read) {
            handleMarkAsRead(notification.id);
        }
        setIsOpen(false);
        // Navigate based on type if needed, e.g. to assignments view
        // if (notification.type === 'assignment_submitted' || notification.type === 'assignment_graded') {
        //     navigate('/dashboard'); // Route depends on exact course but dashboard works
        // }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem',
                    position: 'relative', color: 'var(--text-secondary)'
                }}
            >
                <BellIcon style={{ width: '1.5rem', height: '1.5rem' }} />
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute', top: '0', right: '0',
                        background: 'var(--danger)', color: 'white',
                        fontSize: '0.7rem', fontWeight: 'bold',
                        padding: '0.1rem 0.35rem', borderRadius: '50%',
                        transform: 'translate(25%, -25%)'
                    }}>
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute', top: '100%', right: '0', marginTop: '0.5rem',
                    width: '320px', maxHeight: '400px', overflowY: 'auto',
                    background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                    borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    zIndex: 50, display: 'flex', flexDirection: 'column'
                }} className="animate-fade-in">
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ margin: 0 }}>Notifications</h4>
                        {unreadCount > 0 && (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{unreadCount} unread</span>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {notifications.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                No notifications yet.
                            </div>
                        ) : (
                            notifications.map(n => (
                                <div
                                    key={n.id}
                                    onClick={() => handleNotificationClick(n)}
                                    style={{
                                        padding: '1rem', borderBottom: '1px solid var(--border-color)',
                                        background: n.is_read ? 'transparent' : 'var(--bg-tertiary)',
                                        cursor: 'pointer', transition: 'background 0.2s',
                                        display: 'flex', flexDirection: 'column', gap: '0.25rem'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <strong style={{ fontSize: '0.95rem', color: n.is_read ? 'var(--text-primary)' : 'var(--primary-color)' }}>{n.title}</strong>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {new Date(n.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        {n.message}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
