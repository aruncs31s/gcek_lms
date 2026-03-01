import { useState } from 'react';
import { api } from '../lib/api';
import { VideoCameraIcon, FolderIcon } from '@heroicons/react/24/outline';
import type { Module } from '../types/course';

interface InlineModuleEditorProps {
    courseId: string;
    modules: Module[];
    onSuccess: () => void;
    onCancel: () => void;
    editModule?: Module | null;
}

export default function InlineModuleEditor({ courseId, modules, onSuccess, onCancel, editModule }: InlineModuleEditorProps) {
    const [title, setTitle] = useState(editModule?.title || '');
    const [description, setDescription] = useState(editModule?.description || '');
    const [points, setPoints] = useState<number | ''>(editModule?.points !== undefined ? editModule.points : '');
    const [isFree, setIsFree] = useState(editModule?.is_free || false);
    const [parentId, setParentId] = useState<string>(editModule?.parent_id || '');
    const [type, setType] = useState<'video' | 'chapter'>(editModule?.type === 'chapter' ? 'chapter' : 'video');
    const [videoUrl, setVideoUrl] = useState(editModule?.video_url || '');
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

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
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async () => {
        if (!title.trim()) return;
        setSaving(true);
        setError('');
        try {
            const payload = {
                title,
                description,
                points: points === '' ? 0 : Number(points),
                is_free: isFree,
                parent_id: type === 'video' && parentId ? parentId : null,
                type,
                video_url: type === 'video' ? videoUrl : ''
            };

            if (editModule) {
                await api.put(`/courses/${courseId}/modules/${editModule.id}`, payload);
            } else {
                await api.post(`/courses/${courseId}/modules`, payload);
            }
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.error || `Failed to ${editModule ? 'update' : 'create'} module`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ marginTop: '1rem', padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)' }} className="animate-fade-in">
            {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <button
                    onClick={() => setType('video')}
                    style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: type === 'video' ? '2px solid var(--brand-primary)' : '1px solid var(--border-color)', background: type === 'video' ? 'var(--bg-secondary)' : 'transparent', color: type === 'video' ? 'var(--brand-primary)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}
                >
                    <VideoCameraIcon style={{ width: '1.2rem' }} /> Video Module
                </button>
                <button
                    onClick={() => setType('chapter')}
                    style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: type === 'chapter' ? '2px solid var(--brand-primary)' : '1px solid var(--border-color)', background: type === 'chapter' ? 'var(--bg-secondary)' : 'transparent', color: type === 'chapter' ? 'var(--brand-primary)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}
                >
                    <FolderIcon style={{ width: '1.2rem' }} /> Chapter Heading
                </button>
            </div>

            <input
                className="input-field"
                placeholder={type === 'chapter' ? "e.g. Module 1: Introduction to Registers" : "e.g. Setting up your environment"}
                value={title}
                onChange={e => setTitle(e.target.value)}
                style={{ marginBottom: '1rem' }}
            />

            <textarea
                className="input-field"
                placeholder="Description (Markdown supported)"
                value={description}
                onChange={e => setDescription(e.target.value)}
                style={{ marginBottom: '1rem', minHeight: '80px', resize: 'vertical' }}
            />

            {type === 'video' && (
                <div className="module-editor-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                        <select
                            className="input-field"
                            value={parentId}
                            onChange={e => setParentId(e.target.value)}
                        >
                            <option value="">No Parent Chapter</option>
                            {modules.filter(m => m.type === 'chapter').map(c => (
                                <option key={c.id} value={c.id}>Under: {c.title}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ flex: 1 }}>
                        <input
                            type="number"
                            className="input-field"
                            placeholder="Points"
                            value={points}
                            onChange={e => setPoints(e.target.value === '' ? '' : parseInt(e.target.value))}
                            min={0}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                            type="checkbox"
                            id="is_free"
                            checked={isFree}
                            onChange={e => setIsFree(e.target.checked)}
                            style={{ width: '1.2rem', height: '1.2rem' }}
                        />
                        <label htmlFor="is_free" style={{ color: 'var(--text-primary)', cursor: 'pointer' }}>Free Preview</label>
                    </div>
                </div>
            )}

            {type === 'video' && (
                <div style={{ marginBottom: '1.5rem' }}>
                    <input type="file" accept="video/mp4, video/webm" onChange={handleVideoUpload} disabled={uploading} className="file-input" />
                    {uploading && <span style={{ color: 'var(--brand-primary)', fontSize: '0.8rem', marginTop: '0.5rem', display: 'block' }}>Uploading video...</span>}
                    {videoUrl && !uploading && <span style={{ color: 'var(--success)', fontSize: '0.8rem', marginTop: '0.5rem', display: 'block' }}>Video Ready!</span>}
                </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button onClick={onCancel} className="btn btn-secondary" disabled={saving || uploading}>Cancel</button>
                <button onClick={handleSubmit} className="btn btn-primary" disabled={saving || uploading || !title.trim()}>{saving ? 'Saving...' : 'Save'}</button>
            </div>
        </div>
    );
}
