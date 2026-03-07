import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { FiEye, FiEdit3, FiSave, FiX, FiPlus, FiTrash2, FiUploadCloud, FiCheckCircle } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';

interface Module {
    title: string;
    description: string;
    content_type: 'video' | 'document' | 'text';
    content_url: string;
    order_index: number;
}

export default function AdvancedCourseCreator() {
    const [mode, setMode] = useState<'split' | 'edit' | 'preview'>('split');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: 0,
        thumbnail_url: '',
        status: 'coming soon',
        duration: '',
        start_date: '',
        format: 'course'
    });
    const [modules, setModules] = useState<Module[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const navigate = useNavigate();
    const { user } = useAuthStore();

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

    const handleSubmit = async () => {
        setError('');
        setLoading(true);

        try {
            const payload: any = {
                ...formData,
                price: Number(formData.price)
            };
            if (payload.start_date) {
                payload.start_date = new Date(payload.start_date).toISOString();
            } else {
                delete payload.start_date;
            }
            const response = await api.post('/courses', payload);
            
            // Create modules
            for (const module of modules) {
                await api.post(`/courses/${response.data.id}/modules`, module);
            }
            
            navigate(`/courses/${response.data.id}`);
        } catch (err: any) {
            setError(err.response?.data?.error || 'An error occurred creating the course');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addModule = () => {
        setModules([...modules, {
            title: '',
            description: '',
            content_type: 'text',
            content_url: '',
            order_index: modules.length
        }]);
    };

    const updateModule = (index: number, field: keyof Module, value: any) => {
        const updated = [...modules];
        updated[index] = { ...updated[index], [field]: value };
        setModules(updated);
    };

    const removeModule = (index: number) => {
        setModules(modules.filter((_, i) => i !== index));
    };

    const renderPreview = () => (
        <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '16px', height: '100%', overflow: 'auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                {formData.thumbnail_url && (
                    <img src={formData.thumbnail_url} alt="Course thumbnail" style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1.5rem' }} />
                )}
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>{formData.title || 'Course Title'}</h1>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-primary">{formData.format}</span>
                    <span className="badge badge-success">{formData.status}</span>
                    {formData.duration && <span className="badge badge-primary">{formData.duration}</span>}
                    {formData.price > 0 && <span className="badge badge-primary">${formData.price}</span>}
                </div>
                <div className="markdown-content" style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    <ReactMarkdown>{formData.description || '*No description yet*'}</ReactMarkdown>
                </div>
            </div>

            {modules.length > 0 && (
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Course Curriculum</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {modules.map((module, idx) => (
                            <div key={idx} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                                    <span style={{ background: 'var(--brand-primary)', color: 'var(--bg-primary)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>{idx + 1}</span>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>{module.title || `Module ${idx + 1}`}</h3>
                                    <span className="badge badge-primary" style={{ marginLeft: 'auto' }}>{module.content_type}</span>
                                </div>
                                <div className="markdown-content" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                    <ReactMarkdown>{module.description || '*No description*'}</ReactMarkdown>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    const renderEditor = () => (
        <div style={{ height: '100%', overflow: 'auto', padding: '1rem' }}>
            <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '16px' }}>
                {error && <div style={{ background: 'rgba(243, 139, 168, 0.15)', color: 'var(--danger)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid var(--danger)', fontWeight: 500 }}>{error}</div>}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>Course Title</label>
                        <input
                            type="text"
                            name="title"
                            className="form-input"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Advanced Embedded Systems"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>Description (Markdown supported)</label>
                        <textarea
                            name="description"
                            className="form-input"
                            value={formData.description}
                            onChange={handleChange}
                            rows={6}
                            placeholder="Describe what students will learn... (You can use **bold**, *italic*, lists, etc.)"
                            style={{ resize: 'vertical', minHeight: '150px', fontFamily: 'monospace' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>Format</label>
                            <select name="format" className="form-input" value={formData.format} onChange={handleChange}>
                                <option value="course">Standard Course</option>
                                <option value="project">Project-Based</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>Price ($)</label>
                            <input type="number" name="price" min="0" step="0.01" className="form-input" value={formData.price} onChange={handleChange} placeholder="0.00" />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>Thumbnail Image</label>
                        <input type="file" accept="image/jpeg, image/png, image/webp" className="file-input" onChange={handleImageUpload} disabled={uploadingImage} />
                        {uploadingImage && <span style={{ fontSize: '0.875rem', color: 'var(--brand-primary)', marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}><FiUploadCloud /> Uploading...</span>}
                        {formData.thumbnail_url && !uploadingImage && (
                            <div style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--success)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FiCheckCircle /> Image uploaded!
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>Status</label>
                            <select name="status" className="form-input" value={formData.status} onChange={handleChange}>
                                <option value="coming soon">Coming Soon</option>
                                <option value="active">Active</option>
                                <option value="ended">Ended</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>Duration</label>
                            <input type="text" name="duration" className="form-input" value={formData.duration} onChange={handleChange} placeholder="e.g. 4 Weeks" />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>Start Date</label>
                            <input type="datetime-local" name="start_date" className="form-input" value={formData.start_date} onChange={handleChange} />
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Course Modules</h3>
                            <button onClick={addModule} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem' }}>
                                <FiPlus /> Add Module
                            </button>
                        </div>

                        {modules.map((module, idx) => (
                            <div key={idx} className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1rem', borderRadius: '12px', border: '2px solid var(--border-color)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h4 style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>Module {idx + 1}</h4>
                                    <button onClick={() => removeModule(idx)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <FiTrash2 size={14} /> Remove
                                    </button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={module.title}
                                        onChange={(e) => updateModule(idx, 'title', e.target.value)}
                                        placeholder="Module title"
                                    />
                                    <textarea
                                        className="form-input"
                                        value={module.description}
                                        onChange={(e) => updateModule(idx, 'description', e.target.value)}
                                        placeholder="Module description (Markdown supported)"
                                        rows={3}
                                        style={{ fontFamily: 'monospace' }}
                                    />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                                        <select
                                            className="form-input"
                                            value={module.content_type}
                                            onChange={(e) => updateModule(idx, 'content_type', e.target.value)}
                                        >
                                            <option value="text">Text</option>
                                            <option value="video">Video</option>
                                            <option value="document">Document</option>
                                        </select>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={module.content_url}
                                            onChange={(e) => updateModule(idx, 'content_url', e.target.value)}
                                            placeholder="Content URL (video link, document URL, etc.)"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
            {/* Toolbar */}
            <div className="glass-panel" style={{ padding: '1rem 1.5rem', marginBottom: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 700 }}>Advanced Course Creator</h1>
                
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <div className="glass-panel" style={{ display: 'flex', gap: '0.25rem', padding: '0.25rem', borderRadius: '8px' }}>
                        <button
                            onClick={() => setMode('edit')}
                            className={mode === 'edit' ? 'btn btn-primary' : 'btn btn-secondary'}
                            style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}
                        >
                            <FiEdit3 size={16} /> Edit
                        </button>
                        <button
                            onClick={() => setMode('split')}
                            className={mode === 'split' ? 'btn btn-primary' : 'btn btn-secondary'}
                            style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}
                        >
                            <FiEdit3 size={16} /> <FiEye size={16} /> Split
                        </button>
                        <button
                            onClick={() => setMode('preview')}
                            className={mode === 'preview' ? 'btn btn-primary' : 'btn btn-secondary'}
                            style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}
                        >
                            <FiEye size={16} /> Preview
                        </button>
                    </div>

                    <button onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{ padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FiX size={18} /> Cancel
                    </button>
                    <button onClick={handleSubmit} disabled={loading || !formData.title} className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: (loading || !formData.title) ? 0.6 : 1 }}>
                        <FiSave size={18} /> {loading ? 'Publishing...' : 'Publish Course'}
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, overflow: 'hidden', display: 'grid', gridTemplateColumns: mode === 'split' ? '1fr 1fr' : '1fr', gap: '1rem' }}>
                {(mode === 'edit' || mode === 'split') && renderEditor()}
                {(mode === 'preview' || mode === 'split') && renderPreview()}
            </div>
        </div>
    );
}
