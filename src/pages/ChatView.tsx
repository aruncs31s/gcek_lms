import { useSearchParams } from 'react-router-dom';
import ChatBox from '../components/ChatBox';
import { useAuthStore } from '../store/authStore';

export default function ChatView() {
    const [searchParams] = useSearchParams();
    const courseId = searchParams.get('course');
    const { user } = useAuthStore();

    if (!user) {
        return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Please log in to access chat.</div>;
    }

    // Assuming course chats have the same ID as the course for this simplified MVP.
    // In production, we'd query the backend for the specific Conversation ID linked to the course.
    const conversationId = courseId || "";

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Course Chat</h1>
                <p className="text-secondary">Discuss lectures, ask questions, and collaborate with your peers.</p>
            </div>

            {conversationId ? (
                <ChatBox conversationId={conversationId} />
            ) : (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                    <p className="text-muted" style={{ fontSize: '1.25rem' }}>No course selected for chat.</p>
                </div>
            )}
        </div>
    );
}
