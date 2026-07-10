import { FASES } from '../../constants';

export function Badge({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold tracking-wide ${className}`}>
      {children}
    </span>
  );
}

export function FaseBadge({ faseId }) {
  const fase = FASES.find(f => f.id === faseId);
  if (!fase) return null;
  return <Badge className={`${fase.color} badge-print`}>{fase.label}</Badge>;
}

export function StatusBadge({ status }) {
  const map = {
    'Pendente': 'bg-warning-dim text-warning',
    'Concluído': 'bg-success-dim text-success',
    'Cancelado': 'bg-danger-dim text-danger',
  };
  return <Badge className={map[status] || ''}>{status}</Badge>;
}
