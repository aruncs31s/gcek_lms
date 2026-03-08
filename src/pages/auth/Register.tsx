import { Link } from 'react-router-dom';
import { useRegisterForm } from '../../hooks/useRegisterForm';
import { FormField } from '../../components/FormField';
import { SelectField } from '../../components/SelectField';
import { ErrorMessage } from '../../components/ErrorMessage';
import { ROLE_OPTIONS } from '../../constants/roles';

export default function Register() {
    const { formData, error, loading, handleChange, handleSubmit } = useRegisterForm();

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div 
                className="glass-panel animate-fade-in" 
                style={{ padding: '2.5rem', width: '100%', maxWidth: '500px' }}
            >
                <h2 
                    className="text-gradient" 
                    style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}
                >
                    Create Account
                </h2>

                <ErrorMessage message={error} />

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <FormField
                            label="First Name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                        />
                        <FormField
                            label="Last Name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                        />
                    </div>

                    <FormField
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <FormField
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    <SelectField
                        label="I am a..."
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        options={ROLE_OPTIONS}
                    />

                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="btn btn-primary" 
                        style={{ marginTop: '0.5rem', width: '100%' }}
                    >
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
