import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { TrashIcon } from '@heroicons/react/24/outline';
import type { Course } from '../types/course';

interface CourseSettingsFormProps {
    course: Course;
    onSuccess: () => void;
}

export default function CourseSettingsForm({ course, onSuccess }: CourseSettingsFormProps) {
    const navigate = useNavigate();
    const [title, setTitle] = useState(course.title);
    const [description, setDescription] = useState(course.description);
    const [price, setPrice] = useState(course.price.toString());
    const [thumbnailUrl, setThumbnailUrl] = useState(course.thumbnail_url || '');
    const [type, setType] = useState(course.type || 'paid');
    const [status, setStatus] = useState(course.status || 'not started');
    const [duration, setDuration] = useState(course.duration || '');
    const [isCertificateAvailable, setIsCertificateAvailable] = useState(course.is_certificate_available || false);

    // Format date for datetime-local input
    const formatDateTimeLocal = (isoString?: string) => {
        if (!isoString) return '';
        const d = new Date(isoString);
        if (isNaN(d.getTime())) return '';
        return d.toISOString().slice(0, 16);
    };

    const [startDate, setStartDate] = useState(formatDateTimeLocal(course.start_date));

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [deleting, setDeleting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccessMessage('');

        try {
            const payload: any = {
                title,
                description,
                price: parseFloat(price) || 0,
                thumbnail_url: thumbnailUrl,
                type,
                status,
                duration,
                is_certificate_available: isCertificateAvailable
            };
            if (startDate) {
                payload.start_date = new Date(startDate).toISOString();
            }
            await api.put(`/courses/${course.id}`, payload);
            setSuccessMessage('Course updated successfully!');
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to update course');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to permanently delete this course? This action cannot be undone.")) return;
        setDeleting(true);
        try {
            await api.delete(`/courses/${course.id}`);
            navigate('/dashboard');
        } catch (err: any) {
            alert('Failed to delete course');
            setDeleting(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        const form = new FormData();
        form.append('image', file);

        try {
            const res = await api.post('/upload/image', form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setThumbnailUrl(res.data.file_url);
        } catch (err) {
            alert('Image upload failed');
        } finally {
            setUploadingImage(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Course Settings</h3>

            {error && <div style={{ padding: '1rem', background: 'rgba(243, 139, 168, 0.1)', color: 'var(--danger)', borderRadius: '8px', marginBottom: '1.5rem' }}>{error}</div>}
            {successMessage && <div style={{ padding: '1rem', background: 'rgba(166, 227, 161, 0.1)', color: 'var(--success)', borderRadius: '8px', marginBottom: '1.5rem' }}>{successMessage}</div>}

            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Course Title</label>
                    <input type="text" className="form-input" value={title} onChange={e => setTitle(e.target.value)} required />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Description (Markdown support)</label>
                    <textarea className="form-input" value={description} onChange={e => setDescription(e.target.value)} rows={6} required />
                </div>

                <div className="form-grid-3" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Price ($)</label>
                        <input type="number" step="0.01" className="form-input" value={price} onChange={e => setPrice(e.target.value)} required />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Type</label>
                        <select className="form-input" value={type} onChange={e => setType(e.target.value)}>
                            <option value="paid">Paid</option>
                            <option value="free">Free</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Status</label>
                        <select className="form-input" value={status} onChange={e => setStatus(e.target.value)}>
                            <option value="active">Active</option>
                            <option value="coming soon">Coming Soon</option>
                            <option value="not started">Not Started</option>
                            <option value="ended">Ended</option>
                        </select>
                    </div>
                </div>

                <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Duration (e.g. "4 Weeks")</label>
                        <input type="text" className="form-input" value={duration} onChange={e => setDuration(e.target.value)} placeholder="10 Hours" />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Start Date</label>
                        <input type="datetime-local" className="form-input" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <input type="checkbox" id="certAvailable" checked={isCertificateAvailable} onChange={e => setIsCertificateAvailable(e.target.checked)} style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--brand-primary)' }} />
                    <label htmlFor="certAvailable" style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>Enable Certificate of Completion</label>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Thumbnail Image ({thumbnailUrl ? 'Found' : 'Missing'})</label>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} className="file-input" />
                        </div>
                        {thumbnailUrl && (
                            <img src={thumbnailUrl} alt="Thumbnail preview" style={{ height: '50px', width: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                        )}
                    </div>
                    {uploadingImage && <small style={{ color: 'var(--brand-primary)' }}>Uploading image...</small>}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-start', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '1rem' }}>
                    <button type="submit" className="btn btn-primary" disabled={saving || uploadingImage} style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
                        {saving ? 'Saving Changes...' : 'Save Changes'}
                    </button>
                </div>
            </form>

            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--danger)' }}>
                <h4 style={{ color: 'var(--danger)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Danger Zone</h4>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Once you delete a course, there is no going back. Please be certain.</p>
                <button onClick={handleDelete} disabled={deleting} className="btn" style={{ background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.75rem 1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <TrashIcon style={{ width: '1.2rem' }} />
                    {deleting ? 'Deleting...' : 'Delete Course'}
                </button>
            </div>
        </div>
    );
}
