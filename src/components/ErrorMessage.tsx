interface ErrorMessageProps {
    message: string | null;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
    if (!message) return null;

    return (
        <div 
            style={{ 
                background: 'var(--danger)', 
                color: 'white', 
                padding: '0.75rem', 
                borderRadius: '8px', 
                marginBottom: '1.5rem', 
                textAlign: 'center' 
            }}
        >
            {message}
        </div>
    );
}
