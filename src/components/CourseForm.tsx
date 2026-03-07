import { FiUploadCloud, FiCheckCircle, FiX, FiSend } from 'react-icons/fi';

interface CourseFormData {
    title: string;
    description: string;
    price: number;
    thumbnail_url: string;
    status: string;
    duration: string;
    start_date: string;
    format: string;
}

interface CourseFormProps {
    formData: CourseFormData;
    error: string;
    loading: boolean;
    uploadingImage: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCancel: () => void;
    submitLabel?: string;
}

export default function CourseForm({
    formData,
    error,
    loading,
    uploadingImage,
    onSubmit,
    onChange,
    onImageUpload,
    onCancel,
    submitLabel = 'Publish Course'
}: CourseFormProps) {
    return (
        <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', borderRadius: '16px' }}>
            {error && <div style={{ background: 'rgba(243, 139, 168, 0.15)', color: 'var(--danger)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid var(--danger)', fontWeight: 500 }}>{error}</div>}

            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>Course Title</label>
                    <input
                        type="text"
                        name="title"
                        required
                        className="form-input"
                        value={formData.title}
                        onChange={onChange}
                        placeholder="e.g. Advanced Embedded Systems"
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>Description</label>
                    <textarea
                        name="description"
                        required
                        className="form-input"
                        value={formData.description}
                        onChange={onChange}
                        rows={5}
                        placeholder="Describe what students will learn..."
                        style={{ resize: 'vertical', minHeight: '120px' }}
                    />
                </div>

                <div className="form-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>Format</label>
                        <select
                            name="format"
                            className="form-input"
                            value={formData.format}
                            onChange={onChange}
                        >
                            <option value="course">Standard Course</option>
                            <option value="project">Project-Based</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>Price ($)</label>
                        <input
                            type="number"
                            name="price"
                            // min="0"
                            // step="0.01"
                            className="form-input"
                            value={formData.price}
                            onChange={onChange}
                            placeholder="0.00"
                            style={{  
                                MozAppearance: 'textfield',
                            }}
                            onWheel={(e) => e.currentTarget.blur()}
                        />
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>Thumbnail Image (Optional)</label>
                    <input
                        type="file"
                        accept="image/jpeg, image/png, image/webp"
                        className="file-input"
                        onChange={onImageUpload}
                        disabled={uploadingImage}
                    />
                    {uploadingImage && <span style={{ fontSize: '0.875rem', color: 'var(--brand-primary)', marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}><FiUploadCloud /> Uploading...</span>}
                    {formData.thumbnail_url && !uploadingImage && (
                        <div style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--success)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FiCheckCircle /> Image uploaded successfully!
                        </div>
                    )}
                </div>

                <div className="form-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>Status</label>
                        <select
                            name="status"
                            className="form-input"
                            value={formData.status}
                            onChange={onChange}
                        >
                            <option value="coming soon">Coming Soon</option>
                            <option value="active">Active</option>
                            <option value="ended">Ended</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>Duration</label>
                        <input
                            type="text"
                            name="duration"
                            className="form-input"
                            value={formData.duration}
                            onChange={onChange}
                            placeholder="e.g. 4 Weeks"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>Start Date</label>
                        <input
                            type="datetime-local"
                            name="start_date"
                            className="form-input"
                            value={formData.start_date}
                            onChange={onChange}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                    <button 
                        type="button" 
                        onClick={onCancel} 
                        className="btn btn-secondary" 
                        style={{ flex: 1, padding: '0.875rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                        <FiX size={18} /> Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={loading || uploadingImage} 
                        className="btn btn-primary" 
                        style={{ flex: 1, padding: '0.875rem 1.5rem', opacity: (loading || uploadingImage) ? 0.6 : 1, cursor: (loading || uploadingImage) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                        {loading ? <><FiUploadCloud className="animate-pulse" /> Creating...</> : <><FiSend /> {submitLabel}</>}
                    </button>
                </div>
            </form>
        </div>
    );
}
