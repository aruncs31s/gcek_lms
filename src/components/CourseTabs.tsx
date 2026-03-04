import { Cog6ToothIcon } from '@heroicons/react/24/outline';

type TabType = 'overview' | 'curriculum' | 'assignments' | 'instructor' | 'reviews' | 'settings';

interface CourseTabsProps {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
    isTeacher: boolean;
}

export default function CourseTabs({ activeTab, setActiveTab, isTeacher }: CourseTabsProps) {
    const tabs: TabType[] = isTeacher 
        ? ['overview', 'curriculum', 'assignments', 'instructor', 'reviews', 'settings']
        : ['overview', 'curriculum', 'assignments', 'instructor', 'reviews'];

    return (
        <div className="course-tabs" style={{ 
            display: 'flex', 
            borderBottom: '1px solid var(--border-color)', 
            marginBottom: '2rem', 
            overflowX: 'auto', 
            paddingBottom: '2px' 
        }}>
            {tabs.map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                        padding: '1rem 1.5rem',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === tab ? '2px solid var(--brand-primary)' : '2px solid transparent',
                        color: activeTab === tab ? (tab === 'settings' ? 'var(--warning)' : 'var(--brand-primary)') : 'var(--text-secondary)',
                        fontWeight: activeTab === tab ? 600 : 500,
                        fontSize: '1.05rem',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {tab === 'settings' && <Cog6ToothIcon style={{ width: '1.1rem' }} />}
                    {tab}
                </button>
            ))}
        </div>
    );
}
