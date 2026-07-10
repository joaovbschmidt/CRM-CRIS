export function Button({ children, onClick, variant = 'primary', className = '', icon: Icon, size = 'md', type = 'button' }) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50';
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2.5 text-base',
  };
  const variants = {
    primary: 'bg-accent text-bg-primary hover:bg-accent-hover',
    secondary: 'bg-bg-highlight border border-border text-text-primary hover:border-accent/50 hover:text-accent',
    danger: 'bg-danger/20 text-danger hover:bg-danger/30',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-bg-highlight',
  };
  return (
    <button type={type} onClick={onClick} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {Icon && <Icon size={size === 'sm' ? 14 : 16} />}
      {children}
    </button>
  );
}
