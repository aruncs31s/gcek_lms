import { FiBook, FiList, FiFileText, FiUser, FiStar, FiSettings, FiUsers } from 'react-icons/fi';

type TabType = 'overview' | 'curriculum' | 'assignments' | 'instructor' | 'reviews' | 'settings' | 'students';

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
        tabs.push({ key: 'students', label: 'Students', icon: FiUsers });
        tabs.push({ key: 'settings', label: 'Settings', icon: FiSettings });
    }

    return (
        <div style={{
            display: 'flex',
            borderBottom: '2px solid var(--border-color)',
            marginBottom: '2rem',
            overflowX: 'auto',
            gap: '0',
            scrollbarWidth: 'none',
        }}>
            {tabs.map(({ key, label, icon: Icon }) => {
                const isActive = activeTab === key;
                const isSettings = key === 'settings';
                const activeColor = isSettings ? 'var(--warning)' : 'var(--brand-primary)';

                return (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        style={{
                            padding: '0.9rem 1.4rem',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: isActive ? `3px solid ${activeColor}` : '3px solid transparent',
                            marginBottom: '-2px',
                            color: isActive ? activeColor : 'var(--text-muted)',
                            fontWeight: isActive ? 700 : 500,
                            fontSize: '0.92rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.55rem',
                            whiteSpace: 'nowrap',
                            transition: 'color 0.2s ease, border-color 0.2s ease',
                            position: 'relative',
                        }}
                    >
                        <Icon size={17} />
                        {label}
                    </button>
                );
            })}
        </div>
    );
}
