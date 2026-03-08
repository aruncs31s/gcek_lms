interface SelectFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: readonly { readonly value: string; readonly label: string }[];
    required?: boolean;
}

export function SelectField({ 
    label, 
    name, 
    value, 
    onChange, 
    options, 
    required = true 
}: SelectFieldProps) {
    return (
        <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                {label}
            </label>
            <select 
                name={name} 
                value={value} 
                onChange={onChange} 
                className="input-field"
                required={required}
            >
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
