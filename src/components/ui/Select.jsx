export function Select({ label, value, onChange, options, placeholder = '' }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="bg-bg-primary border border-border rounded-lg px-3 py-2 text-sm text-text-primary
                   focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30
                   transition-colors duration-200 appearance-none"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => (
          <option key={typeof o === 'string' ? o : o.value} value={typeof o === 'string' ? o : o.value}>
            {typeof o === 'string' ? o : o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
