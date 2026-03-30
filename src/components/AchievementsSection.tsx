import { TrophyIcon } from '@heroicons/react/24/outline';

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon_url: string;
    points: number;
    earned_at: string;
}

interface AchievementsSectionProps {
    achievements: Achievement[];
}

export default function AchievementsSection({ achievements }: AchievementsSectionProps) {
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <TrophyIcon style={{ width: '1.5rem', height: '1.5rem', color: 'var(--warning)' }} />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Achievements</h2>
            </div>

            {(!achievements || achievements.length === 0) ? (
                <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderRadius: '16px' }}>
                    <p className="text-muted">No achievements earned yet.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
                    {achievements.map(achievement => (
                        <div key={achievement.id} className="stat-box" style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', textAlign: 'center' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(249, 226, 175, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning)' }}>
                                {achievement.icon_url ? (
                                    <img src={achievement.icon_url} alt={achievement.title} style={{ width: '24px', height: '24px' }} />
                                ) : (
                                    <TrophyIcon style={{ width: '1.5rem', height: '1.5rem' }} />
                                )}
                            </div>
                            <div>
                                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>{achievement.title}</h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--brand-primary)', fontWeight: 600, margin: 0 }}>+{achievement.points} pts</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
