import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';

export default function Home() {
    const { user } = useAuthStore();

    return (
        <div className="animate-fade-in">
            <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', marginBottom: '3rem' }}>
                <h1 className="text-gradient" style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>
                    Welcome to the Future of Embedded Learning
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto', marginBottom: '2.5rem' }}>
                    An all-in-one platform for Students, Teachers, and Admins to manage courses, certificates, and seamless communication.
                </p>

                {!user ? (
                    <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                        <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Get Started Today</Link>
                        <Link to="/login" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Login to Account</Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                        <Link to="/dashboard" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Go to Dashboard</Link>
                        <Link to="/courses" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Browse Courses</Link>
                    </div>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {[
                    { title: 'Learn from Experts', desc: 'Watch videos, engage in discussions, and upskill at your own pace.' },
                    { title: 'Interactive Chat', desc: 'Collaborate with your peers and teachers seamlessly with our built-in real-time chat.' },
                    { title: 'Earn Certificates', desc: 'Complete courses and instantly receive beautiful, verifiable certificates documenting your achievements.' }
                ].map((feature, i) => (
                    <div key={i} className="glass-panel" style={{ padding: '2rem', transition: 'transform 0.2s', cursor: 'default' }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--brand-primary)' }}>{feature.title}</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
