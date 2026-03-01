import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { api } from '../lib/api';

interface Message {
    id: string;
    sender_id: string;
    content: string;
    attachment_url?: string;
    created_at: string;
}

export default function ChatBox({ conversationId }: { conversationId: string }) {
    const { user, token } = useAuthStore();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [attachment, setAttachment] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const ws = useRef<WebSocket | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
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

        ws.current.onerror = (error) => {
            console.error("WebSocket error:", error);
            alert("WebSocket connection failed. Chat may not work on this hosting.");
        };

        ws.current.onopen = () => {
            console.log("WebSocket connected");
        };

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

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!newMessage.trim() && !attachment) || !ws.current || uploading) return;

        let attachment_url = undefined;
        if (attachment) {
            setUploading(true);
            try {
                const formData = new FormData();
                formData.append('attachment', attachment);
                const res = await api.post('/upload/attachment', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                attachment_url = res.data.file_url;
            } catch (err) {
                console.error("Failed to upload attachment", err);
                setUploading(false);
                return;
            }
            setUploading(false);
            setAttachment(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }

        // Send payload matching the Go server expectation
        const payload = {
            conversation_id: conversationId,
            content: newMessage,
            attachment_url: attachment_url,
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
                                    {msg.content && <div style={{ marginBottom: msg.attachment_url ? '0.5rem' : '0' }}>{msg.content}</div>}
                                    {msg.attachment_url && (
                                        msg.attachment_url.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                                            <a href={msg.attachment_url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginTop: msg.content ? '0.5rem' : '0' }}>
                                                <img src={msg.attachment_url} alt="attachment" style={{ maxWidth: '100%', borderRadius: '8px', maxHeight: '200px' }} />
                                            </a>
                                        ) : (
                                            <a href={msg.attachment_url} target="_blank" rel="noopener noreferrer" style={{ color: isMe ? '#e0f2fe' : 'var(--brand-primary)', textDecoration: 'underline', fontSize: '0.9rem', wordBreak: 'break-all', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                📎 Download Attachment
                                            </a>
                                        )
                                    )}
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
            <form onSubmit={sendMessage} style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem', background: 'var(--bg-primary)', alignItems: 'center' }}>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                    style={{ display: 'none' }}
                />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="btn btn-secondary" style={{ padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center' }} title="Attach File">
                    📎
                </button>
                <div style={{ flex: 1, position: 'relative' }}>
                    {attachment && (
                        <div style={{ position: 'absolute', bottom: '100%', left: 0, background: 'var(--bg-secondary)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem', alignItems: 'center', border: '1px solid var(--border-color)', marginBottom: '4px', zIndex: 10 }}>
                            <span style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{attachment.name}</span>
                            <button type="button" onClick={() => { setAttachment(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', padding: 0 }}>&times;</button>
                        </div>
                    )}
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="input-field"
                        style={{ width: '100%', background: 'var(--bg-tertiary)' }}
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={uploading}>
                    {uploading ? '...' : 'Send'}
                </button>
            </form>
        </div>
    );
}
