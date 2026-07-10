export function Card({ children, className = '', onClick, hover = false }) {
  return (
    <div
      onClick={onClick}
      className={`bg-bg-panel border border-border rounded-xl p-5 transition-all duration-200
        ${hover ? 'hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 cursor-pointer' : ''}
        ${className}`}
    >
      {children}
    </div>
  );
}
