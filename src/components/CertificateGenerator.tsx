import { useState } from 'react';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';

interface CertificateGeneratorProps {
    courseId: string;
    courseName: string;
}

export default function CertificateGenerator({ courseId, courseName }: CertificateGeneratorProps) {
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!user) return;
        setLoading(true);
        setError(null);

        try {
            const response = await api.post('/certificates/generate', {
                user_id: user.id,
                course_id: courseId
            });

            setCertificateUrl(response.data.file_url);
        } catch (err: any) {
            console.error("Failed to generate certificate", err);
            setError(err.response?.data?.error || "An error occurred while generating your certificate.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', marginTop: '2rem' }}>
            <h3 className="text-gradient" style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Course Certificate</h3>
            <p className="text-secondary" style={{ marginBottom: '1.5rem' }}>
                Congratulations on completing <strong>{courseName}</strong>! You can now generate your official certificate of completion.
            </p>

            {error && (
                <div style={{ background: 'var(--danger)', color: 'white', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                    {error}
                </div>
            )}

            {certificateUrl ? (
                <div>
                    <p style={{ color: 'var(--success)', marginBottom: '1rem', fontWeight: '500' }}>✨ Certificate generated successfully!</p>
                    <a
                        href={`${import.meta.env.VITE_API_URL}/certificates/download?file=${certificateUrl.split('/').pop()}&name=${encodeURIComponent(courseName)}`}
                        className="btn btn-primary"
                        style={{ display: 'inline-block', textDecoration: 'none' }}
                    >
                        Download Certificate (PDF)
                    </a>
                </div>
            ) : (
                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="btn btn-primary"
                    style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}
                >
                    {loading ? 'Generating...' : 'Generate Certificate'}
                </button>
            )}
        </div>
    );
}
