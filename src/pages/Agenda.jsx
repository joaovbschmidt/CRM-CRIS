import { Plus, CalendarDays, Edit3, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { StatusBadge, Badge } from '../components/ui/Badge';
import { formatDate } from '../utils/formatDate';
import { isOverdue, isNextDays } from '../utils/dateHelpers';

export function Agenda({
  prazos, filteredPrazos, filterAgenda, setFilterAgenda,
  stats, openNewPrazo, openEditPrazo, deletePrazo, getNomeProcesso
}) {
  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold mb-1">Agenda / Prazos</h2>
          <p className="text-sm text-text-secondary">{prazos.length} compromissos cadastrados</p>
        </div>
        <Button icon={Plus} onClick={openNewPrazo}>Novo Prazo</Button>
      </div>

      <div className="flex gap-2">
        {[
          { id: 'todos', label: 'Todos' },
          { id: 'pendentes', label: 'Pendentes' },
          { id: 'proximos7', label: 'Próximos 7 dias' },
          { id: 'vencidos', label: 'Vencidos' },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilterAgenda(f.id)}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all
              ${filterAgenda === f.id
                ? 'bg-accent text-bg-primary shadow-md shadow-accent/20'
                : 'bg-bg-panel border border-border text-text-secondary hover:text-text-primary hover:border-accent/30'
              }`}
          >
            {f.label}
            {f.id === 'vencidos' && stats.overdue > 0 && (
              <span className="ml-1.5 bg-danger text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {stats.overdue}
              </span>
            )}
          </button>
        ))}
      </div>

      {filteredPrazos.length === 0 ? (
        <EmptyState icon={CalendarDays} title="Nenhum prazo encontrado" description="Ajuste os filtros ou cadastre um novo prazo." />
      ) : (
        <div className="space-y-2">
          {filteredPrazos.map(p => {
            const overdue = isOverdue(p);
            const next7 = isNextDays(p, 7);
            return (
              <Card
                key={p.id}
                className={`flex items-center justify-between
                  ${overdue ? 'border-danger/40 bg-danger/5' : next7 ? 'border-warning/30 bg-warning/5' : ''}`}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={`w-3 h-3 rounded-full shrink-0
                    ${overdue ? 'bg-danger animate-pulse' : p.status === 'Concluído' ? 'bg-success' : p.status === 'Cancelado' ? 'bg-text-muted' : next7 ? 'bg-warning' : 'bg-info'}`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold truncate">{p.titulo}</p>
                      {overdue && <Badge className="bg-danger text-white text-[10px]">VENCIDO</Badge>}
                      {!overdue && next7 && <Badge className="bg-warning text-white text-[10px]">EM BREVE</Badge>}
                    </div>
                    <p className="text-xs text-text-muted mt-0.5">
                      {getNomeProcesso(p.processoId)} • {p.tipo}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className={`text-sm font-medium ${overdue ? 'text-danger' : ''}`}>{formatDate(p.data)}</p>
                    <p className="text-xs text-text-muted">{p.hora}</p>
                  </div>
                  <StatusBadge status={p.status} />
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" icon={Edit3} onClick={() => openEditPrazo(p)} />
                    <Button size="sm" variant="ghost" icon={Trash2} onClick={() => deletePrazo(p.id)} className="text-danger hover:text-danger" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
