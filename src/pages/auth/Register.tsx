import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import type { RegisterRequest, RegisterResponse } from './register';

export default function Register() {
    const [formData, setFormData] = useState<RegisterRequest>({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        role: 'student'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.login);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post<RegisterResponse>('/register', formData);
            setAuth(response.data.user, response.data.token);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data || 'An error occurred during registration');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', width: '100%', maxWidth: '500px' }}>
                <h2 className="text-gradient" style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>Create Account</h2>

                {error && <div style={{ background: 'var(--danger)', color: 'white', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>First Name</label>
                            <input type="text" name="firstname" required className="input-field" value={formData.firstname} onChange={handleChange} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Last Name</label>
                            <input type="text" name="lastname" required className="input-field" value={formData.lastname} onChange={handleChange} />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email</label>
                        <input type="email" name="email" required className="input-field" value={formData.email} onChange={handleChange} />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Password</label>
                        <input type="password" name="password" required className="input-field" value={formData.password} onChange={handleChange} />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>I am a...</label>
                        <select name="role" value={formData.role} onChange={handleChange} className="input-field">
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                        </select>
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%' }}>
                        {loading ? 'Registering...' : 'Sign Up'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ fontWeight: '500' }}>Log in</Link>
                </p>
            </div>
        </div>
    );
}
