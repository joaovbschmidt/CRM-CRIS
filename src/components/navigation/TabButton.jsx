export function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
        ${active
          ? 'bg-accent text-bg-primary shadow-md shadow-accent/20'
          : 'text-text-secondary hover:text-text-primary hover:bg-bg-highlight'
        }`}
    >
      {children}
    </button>
  );
}
