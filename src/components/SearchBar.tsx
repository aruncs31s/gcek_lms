import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SearchResult {
    id: string;
    title: string;
    description: string;
    price: number;
    thumbnail_url?: string;
    teacher_name?: string;
}

export default function SearchBar() {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async (searchTerm: string) => {
        if (!searchTerm.trim()) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        try {
            const res = await api.get('/courses/search', {
                params: {
                    query: searchTerm,
                    limit: 8,
                    offset: 0,
                }
            });
            setResults(res.data || []);
            setIsOpen(true);
        } catch (err) {
            console.error('Search failed:', err);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        if (value.trim()) {
            handleSearch(value);
        } else {
            setResults([]);
            setIsOpen(false);
        }
    };

    const handleCourseSelect = (courseId: string) => {
        navigate(`/courses/${courseId}`);
        setQuery('');
        setResults([]);
        setIsOpen(false);
    };

    const handleViewAllResults = () => {
        navigate(`/courses?query=${encodeURIComponent(query)}`);
        setQuery('');
        setResults([]);
        setIsOpen(false);
    };

    return (
        <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
            {/* Search Input */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                background: 'var(--bg-secondary)',
                borderRadius: '24px',
                border: '1px solid var(--border-color)',
                transition: 'all 0.2s ease'
            }}>
                <MagnifyingGlassIcon style={{ width: '1.2rem', height: '1.2rem', color: 'var(--text-secondary)', flexShrink: 0 }} />
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => query && setIsOpen(true)}
                    placeholder="Search courses..."
                    style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem'
                    }}
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery('');
                            setResults([]);
                            setIsOpen(false);
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <XMarkIcon style={{ width: '1.1rem', height: '1.1rem', color: 'var(--text-secondary)' }} />
                    </button>
                )}
            </div>

            {/* Dropdown Results */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 0.5rem)',
                    left: 0,
                    right: 0,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    zIndex: 1000
                }}>
                    {isLoading ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            Searching...
                        </div>
                    ) : results.length > 0 ? (
                        <>
                            {results.map(course => (
                                <div
                                    key={course.id}
                                    onClick={() => handleCourseSelect(course.id)}
                                    style={{
                                        padding: '1rem',
                                        borderBottom: '1px solid var(--border-color)',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s',
                                        display: 'flex',
                                        gap: '1rem'
                                    }}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-tertiary)';
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                                    }}
                                >
                                    {course.thumbnail_url && (
                                        <div style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '8px',
                                            background: `url(${course.thumbnail_url}) center/cover`,
                                            flexShrink: 0
                                        }} />
                                    )}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <h4 style={{
                                            margin: '0 0 0.25rem 0',
                                            fontSize: '0.95rem',
                                            fontWeight: 600,
                                            color: 'var(--text-primary)',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {course.title}
                                        </h4>
                                        {course.teacher_name && (
                                            <p style={{
                                                margin: '0 0 0.25rem 0',
                                                fontSize: '0.85rem',
                                                color: 'var(--text-secondary)'
                                            }}>
                                                by {course.teacher_name}
                                            </p>
                                        )}
                                        <p style={{
                                            margin: 0,
                                            fontSize: '0.9rem',
                                            fontWeight: 600,
                                            color: 'var(--brand-primary)'
                                        }}>
                                            {course.price === 0 ? 'Free' : `$${course.price}`}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={handleViewAllResults}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'transparent',
                                    border: 'none',
                                    borderTop: '1px solid var(--border-color)',
                                    color: 'var(--brand-primary)',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-tertiary)';
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                                }}
                            >
                                View all results
                            </button>
                        </>
                    ) : (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            No courses found
                        </div>
                    )}
                </div>
            )}

            {/* Click outside to close */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 999
                    }}
                />
            )}
        </div>
    );
}
