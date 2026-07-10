export function Card({ children, className = '', onClick, hover = false }) {
  return (
    <div
      onClick={onClick}
      className={`relative bg-bg-panel border border-border rounded-lg p-5 transition-all duration-200
        before:content-[''] before:absolute before:top-0 before:left-5 before:right-5 before:h-px before:bg-accent/40
        ${hover ? 'hover:border-accent/50 cursor-pointer' : ''}
        ${className}`}
    >
      {children}
    </div>
  );
}
