import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { UserIcon } from '@heroicons/react/24/outline';

interface CourseReviewsProps {
    courseId: string;
}

export default function CourseReviews({ courseId }: CourseReviewsProps) {
    const { user } = useAuthStore();
    const [reviews, setReviews] = useState<any[]>([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            const res = await api.get(`/courses/${courseId}/reviews`);
            setReviews(res.data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [courseId]);

    const submitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post(`/courses/${courseId}/reviews`, { rating, comment });
            setComment('');
            setRating(5);
            fetchReviews();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={{ color: 'var(--text-muted)' }}>Loading reviews...</div>;

    const averageRating = reviews.length ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 0;

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>Student Reviews</h3>
                {reviews.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: '#fbbf24', fontSize: '1.5rem' }}>★</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{averageRating}</span>
                        <span style={{ color: 'var(--text-muted)' }}>({reviews.length} reviews)</span>
                    </div>
                )}
            </div>

            {user && (
                <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2.5rem', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Write a Review</h4>
                    <form onSubmit={submitReview}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Rating (1-5)</label>
                            <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="form-input" style={{ width: '120px' }}>
                                {[5, 4, 3, 2, 1].map(num => <option key={num} value={num}>{num} Stars</option>)}
                            </select>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Comment</label>
                            <textarea value={comment} onChange={(e) => setComment(e.target.value)} required className="form-input" rows={3} placeholder="What did you think about this course?"></textarea>
                        </div>
                        <button type="submit" disabled={submitting || !comment.trim()} className="btn btn-primary">{submitting ? 'Submitting...' : 'Submit Review'}</button>
                    </form>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {reviews.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first to review!</p> :
                    reviews.map(r => (
                        <div key={r.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                        {r.avatar_url ? <img src={r.avatar_url} alt={r.user_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <UserIcon style={{ width: '20px', color: 'var(--text-muted)' }} />}
                                    </div>
                                    <div>
                                        <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>{r.user_name || 'Anonymous User'}</h4>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(r.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div style={{ color: '#fbbf24', fontSize: '1.1rem' }}>
                                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                                </div>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: 1.5 }}>{r.comment}</p>
                        </div>
                    ))}
            </div>
        </div>
    );
}
