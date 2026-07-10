export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-bg-highlight flex items-center justify-center mb-4">
        <Icon size={28} className="text-text-muted" />
      </div>
      <h3 className="text-lg font-medium text-text-secondary mb-1">{title}</h3>
      <p className="text-sm text-text-muted max-w-md">{description}</p>
    </div>
  );
}
