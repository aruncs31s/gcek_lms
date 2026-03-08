/**
 * UserSearchBar Component - Handles user search input
 * Single Responsibility: Only renders search input UI for user filtering
 */
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface UserSearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function UserSearchBar({ 
    value, 
    onChange, 
    placeholder = 'Search by name or email...' 
}: UserSearchBarProps) {
    return (
        <div style={{ marginTop: '2.5rem', maxWidth: '600px', margin: '2.5rem auto 0 auto' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <MagnifyingGlassIcon
                    style={{
                        position: 'absolute',
                        left: '1rem',
                        width: '1.25rem',
                        height: '1.25rem',
                        color: 'var(--text-secondary)',
                        pointerEvents: 'none'
                    }}
                />
                <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="form-input"
                    style={{
                        width: '100%',
                        paddingLeft: '2.75rem',
                        padding: '0.75rem 1rem 0.75rem 2.75rem',
                        fontSize: '0.95rem',
                        borderRadius: '12px'
                    }}
                />
            </div>
        </div>
    );
}
