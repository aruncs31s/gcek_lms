import { useState } from 'react';
import { api } from '../lib/api';

interface CreateModuleModalProps {
    courseId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateModuleModal({ courseId, onClose, onSuccess }: CreateModuleModalProps) {
    const [title, setTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setVideoFile(file);
        setUploading(true);
        setError('');

        const form = new FormData();
        form.append('video', file);

        try {
            const res = await api.post('/upload/video', form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setVideoUrl(res.data.file_url);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to upload video');
            setVideoFile(null);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            await api.post(`/courses/${courseId}/modules`, {
                title,
                video_url: videoUrl
            });
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create module');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div className="glass-panel animate-fade-in" style={{ padding: '2rem', width: '100%', maxWidth: '500px', background: 'var(--bg-primary)' }}>
                <h2 className="text-gradient" style={{ marginBottom: '1.5rem' }}>Add New Module</h2>

                {error && <div style={{ background: 'var(--danger)', color: 'white', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Module Title</label>
                        <input
                            type="text"
                            required
                            className="input-field"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Introduction to Registers"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Video File</label>
                        <input
                            type="file"
                            accept="video/mp4, video/webm"
                            className="file-input"
                            onChange={handleVideoUpload}
                            disabled={uploading}
                        />
                        {uploading && <span style={{ fontSize: '0.875rem', color: 'var(--brand-primary)', marginTop: '0.5rem', display: 'block' }}>Uploading video... Please wait.</span>}
                        {videoUrl && !uploading && <span style={{ fontSize: '0.875rem', color: 'var(--success)', marginTop: '0.5rem', display: 'block' }}>Video uploaded ready! ({videoFile?.name})</span>}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button type="submit" disabled={saving || uploading || !title.trim()} className="btn btn-primary" style={{ flex: 1 }}>
                            {saving ? 'Saving...' : 'Create Module'}
                        </button>
                        <button type="button" onClick={onClose} disabled={saving || uploading} className="btn btn-secondary" style={{ flex: 1 }}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
