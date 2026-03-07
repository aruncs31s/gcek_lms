import { FiBook, FiList, FiFileText, FiUser, FiStar, FiSettings } from 'react-icons/fi';

type TabType = 'overview' | 'curriculum' | 'assignments' | 'instructor' | 'reviews' | 'settings';

interface CourseTabsProps {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
    isTeacher: boolean;
}

export default function CourseTabs({ activeTab, setActiveTab, isTeacher }: CourseTabsProps) {
    const tabs: { key: TabType; label: string; icon: any }[] = [
        { key: 'overview', label: 'Overview', icon: FiBook },
        { key: 'curriculum', label: 'Curriculum', icon: FiList },
        { key: 'assignments', label: 'Assignments', icon: FiFileText },
        { key: 'instructor', label: 'Instructor', icon: FiUser },
        { key: 'reviews', label: 'Reviews', icon: FiStar },
    ];

    if (isTeacher) {
        tabs.push({ key: 'settings', label: 'Settings', icon: FiSettings });
    }

    return (
        <div className="course-tabs glass-panel" style={{ 
            display: 'flex', 
            borderRadius: '12px',
            padding: '0.5rem',
            marginBottom: '1.5rem', 
            overflowX: 'auto',
            gap: '0.5rem',
            background: 'var(--bg-secondary)'
        }}>
            {tabs.map(({ key, label, icon: Icon }) => (
                <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    style={{
                        padding: '0.875rem 1.5rem',
                        background: activeTab === key ? 'var(--bg-primary)' : 'transparent',
                        border: activeTab === key ? '1px solid var(--border-color)' : '1px solid transparent',
                        borderRadius: '8px',
                        color: activeTab === key ? (key === 'settings' ? 'var(--warning)' : 'var(--brand-primary)') : 'var(--text-secondary)',
                        fontWeight: activeTab === key ? 600 : 500,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        whiteSpace: 'nowrap',
                        boxShadow: activeTab === key ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
                    }}
                >
                    <Icon size={18} />
                    {label}
                </button>
            ))}
        </div>
    );
}
