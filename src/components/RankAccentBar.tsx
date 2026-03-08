/**
 * RankAccentBar Component - Displays colored accent bar for top 3 users
 * Single Responsibility: Only displays rank accent bar
 */
interface RankAccentBarProps {
    color: string;
}

export default function RankAccentBar({ color }: RankAccentBarProps) {
    return (
        <div
            style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '6px',
                backgroundColor: color
            }}
        />
    );
}
