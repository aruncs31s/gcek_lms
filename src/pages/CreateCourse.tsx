import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { FiBook } from 'react-icons/fi';
import CourseForm from '../components/CourseForm';

export default function CreateCourse() {
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
            // Navigate to the newly created course view
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

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
            <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                    <FiBook size={40} />
                    Create New Course
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Set up the foundation for your new educational content.</p>
            </div>

            <CourseForm
                formData={formData}
                error={error}
                loading={loading}
                uploadingImage={uploadingImage}
                onSubmit={handleSubmit}
                onChange={handleChange}
                onImageUpload={handleImageUpload}
                onCancel={() => navigate('/dashboard')}
            />
        </div>
    );
}
