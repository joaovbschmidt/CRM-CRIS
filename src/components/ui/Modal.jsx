import { X } from 'lucide-react';

export function Modal({ open, onClose, title, children, wide = false }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-bg-panel border border-border rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto
        ${wide ? 'w-full max-w-4xl' : 'w-full max-w-2xl'}
        animate-[fadeIn_0.2s_ease-out]`}
      >
        <div className="sticky top-0 bg-bg-panel border-b border-border px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
          <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors p-1">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
