export function Input({ label, value, onChange, type = 'text', placeholder = '', ...rest }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="bg-bg-primary border border-border rounded-lg px-3 py-2 text-sm text-text-primary
                   placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30
                   transition-colors duration-200"
        {...rest}
      />
    </div>
  );
}
