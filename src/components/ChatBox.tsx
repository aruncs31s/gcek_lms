import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { api } from '../lib/api';

interface Message {
    id: string;
    sender_id: string;
    content: string;
    created_at: string;
}

export default function ChatBox({ conversationId }: { conversationId: string }) {
    const { user, token } = useAuthStore();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const ws = useRef<WebSocket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom helper
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!conversationId || !user || !token) return;

        // Load initial history
        const fetchHistory = async () => {
            try {
                const res = await api.get(`/chat/conversations/${conversationId}/messages`);
                setMessages(res.data);
            } catch (e) {
                console.error("Failed to load chat history");
            }
        };
        fetchHistory();

        // Connect WebSocket
        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8090/api';
        const wsBase = apiBase.replace(/^http/, 'ws').replace(/\/api$/, '');
        const wsUrl = `${wsBase}/ws/chat?token=${token}&user_id=${user.id}`;

        ws.current = new WebSocket(wsUrl);

        ws.current.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.conversation_id === conversationId) {
                setMessages((prev) => [...prev, msg]);
            }
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [conversationId, user, token]);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !ws.current) return;

        // Send payload matching the Go server expectation
        const payload = {
            conversation_id: conversationId,
            content: newMessage,
        };

        ws.current.send(JSON.stringify(payload));
        setNewMessage('');
    };

    return (
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '500px', padding: 0, overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Live Discussion</h3>
            </div>

            {/* Message List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.length === 0 ? (
                    <p className="text-muted" style={{ textAlign: 'center', marginTop: 'auto', marginBottom: 'auto' }}>No messages yet. Start the conversation!</p>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender_id === user?.id;
                        return (
                            <div key={msg.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                                <div style={{
                                    background: isMe ? 'var(--brand-primary)' : 'var(--bg-separator)',
                                    border: isMe ? 'none' : '1px solid var(--border-color)',
                                    color: 'white',
                                    padding: '0.75rem 1rem',
                                    borderRadius: isMe ? '12px 12px 0 12px' : '12px 12px 12px 0',
                                }}>
                                    {msg.content}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', textAlign: isMe ? 'right' : 'left' }}>
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={sendMessage} style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem', background: 'var(--bg-primary)' }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="input-field"
                    style={{ flex: 1, background: 'var(--bg-tertiary)' }}
                />
                <button type="submit" className="btn btn-primary">Send</button>
            </form>
        </div>
    );
}
