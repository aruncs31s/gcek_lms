import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';

export default function CreateCourse() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: 0,
        thumbnail_url: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [uploadingImage, setUploadingImage] = useState(false);

    const navigate = useNavigate();
    const { user } = useAuthStore();

    // Protect route
    if (!user || user.role !== 'teacher') {
        return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Unauthorized. Only teachers can create courses.</div>;
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const form = new FormData();
        form.append('image', file);

        setUploadingImage(true);
        setError('');
        try {
            const res = await api.post('/upload/image', form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData(prev => ({ ...prev, thumbnail_url: res.data.file_url }));
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to upload image');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Send the price as a number
            const payload = {
                ...formData,
                price: Number(formData.price)
            };
            const response = await api.post('/courses', payload);
            // Navigate to the newly created course view
            navigate(`/courses/${response.data.id}`);
        } catch (err: any) {
            setError(err.response?.data?.error || 'An error occurred creating the course');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Create New Course</h1>
                <p className="text-secondary">Set up the foundation for your new educational content.</p>
            </div>

            <div className="glass-panel animate-fade-in" style={{ padding: '2rem' }}>
                {error && <div style={{ background: 'var(--danger)', color: 'white', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Course Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            className="input-field"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Advanced Embedded Systems"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Description</label>
                        <textarea
                            name="description"
                            required
                            className="input-field"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Describe what students will learn..."
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Price ($)</label>
                            <input
                                type="number"
                                name="price"
                                min="0"
                                step="0.01"
                                className="input-field"
                                value={formData.price}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Thumbnail Image (Optional)</label>
                            <input
                                type="file"
                                accept="image/jpeg, image/png, image/webp"
                                className="input-field"
                                onChange={handleImageUpload}
                                disabled={uploadingImage}
                            />
                            {uploadingImage && <span style={{ fontSize: '0.875rem', color: 'var(--brand-primary)', marginTop: '0.5rem', display: 'block' }}>Uploading...</span>}
                            {formData.thumbnail_url && !uploadingImage && (
                                <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--success)' }}>
                                    Image uploaded successfully!
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" disabled={loading || uploadingImage} className="btn btn-primary" style={{ flex: 1 }}>
                            {loading ? 'Creating...' : 'Publish Course'}
                        </button>
                        <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{ flex: 1 }}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
