interface FormFieldProps {
    label: string;
    name: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    required?: boolean;
    placeholder?: string;
}

export function FormField({ 
    label, 
    name, 
    type = 'text', 
    value, 
    onChange, 
    required = true, 
    placeholder 
}: FormFieldProps) {
    return (
        <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                {label}
            </label>
            <input
                type={type}
                name={name}
                required={required}
                className="input-field"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    );
}
