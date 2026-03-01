import { useState, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { api } from '../lib/api';
import { UserCircleIcon, CameraIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
    const { user, updateUser } = useAuthStore();
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState(user?.first_name || '');
    const [lastName, setLastName] = useState(user?.last_name || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');

    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!user) {
        navigate('/login');
        return null; // Will redirect anyway
    }

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError('');

        const form = new FormData();
        form.append('image', file);

        try {
            const res = await api.post('/upload/image', form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setAvatarUrl(res.data.file_url);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to upload profile picture');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccessMessage('');

        try {
            const res = await api.put('/users/profile', {
                first_name: firstName,
                last_name: lastName,
                bio: bio,
                avatar_url: avatarUrl
            });
            // Result is the updated user response
            const updatedUser = res.data;
            updateUser({
                first_name: updatedUser.first_name,
                last_name: updatedUser.last_name,
                bio: updatedUser.bio,
                avatar_url: updatedUser.avatar_url,
            });
            setSuccessMessage("Profile updated successfully!");
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="animate-fade-in edit-profile-container" style={{ paddingBottom: '4rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Account Settings</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Manage your public profile and preferences.</p>
            </div>

            <div className="glass-panel edit-profile-panel" style={{ padding: '3rem', borderRadius: '24px' }}>
                {error && <div style={{ color: 'var(--danger)', background: 'rgba(243, 139, 168, 0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 500 }}>{error}</div>}
                {successMessage && <div style={{ color: 'var(--success)', background: 'rgba(166, 227, 161, 0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckBadgeIcon style={{ width: '1.5rem' }} /> {successMessage}</div>}

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3rem' }}>
                    <div style={{ position: 'relative', marginBottom: '1rem' }}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            background: 'var(--bg-tertiary)',
                            border: '4px solid var(--border-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.15)'
                        }}>
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <UserCircleIcon style={{ width: '6rem', height: '6rem', color: 'var(--text-muted)' }} />
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                background: 'var(--brand-primary)',
                                color: '#000',
                                border: 'none',
                                borderRadius: '50%',
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                                transition: 'transform 0.2s ease'
                            }}
                            className="hover-card"
                            title="Upload new picture"
                        >
                            <CameraIcon style={{ width: '1.2rem', height: '1.2rem' }} />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                    {uploading && <span style={{ color: 'var(--brand-primary)', fontSize: '0.9rem', fontWeight: 500 }}>Uploading image...</span>}
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>Format: JPG, PNG, GIF</p>
                </div>

                <form onSubmit={handleSaveProfile} style={{ display: 'grid', gap: '1.5rem' }}>
                    <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 500 }}>First Name</label>
                            <input
                                type="text"
                                className="form-input"
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                                required
                                style={{ borderRadius: '12px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 500 }}>Last Name</label>
                            <input
                                type="text"
                                className="form-input"
                                value={lastName}
                                onChange={e => setLastName(e.target.value)}
                                required
                                style={{ borderRadius: '12px' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 500 }}>Professional Bio</label>
                        <textarea
                            className="form-input"
                            value={bio}
                            onChange={e => setBio(e.target.value)}
                            rows={5}
                            placeholder="Tell everyone a bit about yourself..."
                            style={{ borderRadius: '12px', resize: 'vertical' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            value={user.email}
                            disabled
                            style={{ borderRadius: '12px', background: 'var(--bg-tertiary)', color: 'var(--text-muted)', cursor: 'not-allowed' }}
                            title="Contact support to change email"
                        />
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={saving || uploading}
                            style={{ padding: '0.8rem 2.5rem', fontSize: '1.1rem', borderRadius: '12px' }}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
