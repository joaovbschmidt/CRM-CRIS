import { ChevronRight, Briefcase, Clock, AlertTriangle, DollarSign } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import { isOverdue, isNextDays } from '../utils/dateHelpers';

export function Dashboard({ stats, prazos, getNomeProcesso }) {
  return (
    <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
      <div>
        <h2 className="text-2xl font-bold mb-1">Dashboard</h2>
        <p className="text-sm text-text-secondary">Visão geral do escritório</p>
      </div>

      <div className="grid grid-cols-4 gap-5">
        {[
          { label: 'Total de Processos', value: stats.totalProcessos, icon: Briefcase, accent: 'text-accent', bg: 'bg-accent-dim' },
          { label: 'Prazos da Semana', value: stats.next7, icon: Clock, accent: 'text-warning', bg: 'bg-warning-dim' },
          { label: 'Prazos Vencidos', value: stats.overdue, icon: AlertTriangle, accent: 'text-danger', bg: 'bg-danger-dim' },
          { label: 'Valor a Receber', value: formatCurrency(stats.valorReceber), icon: DollarSign, accent: 'text-success', bg: 'bg-success-dim' },
        ].map((kpi, i) => (
          <Card key={i} className="relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-2">{kpi.label}</p>
                <p className={`text-2xl font-bold ${kpi.accent}`}>{kpi.value}</p>
              </div>
              <div className={`w-10 h-10 ${kpi.bg} rounded-xl flex items-center justify-center`}>
                <kpi.icon size={20} className={kpi.accent} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ChevronRight size={18} className="text-accent" />
          Processos por Fase
        </h3>
        <div className="grid grid-cols-7 gap-3">
          {stats.porFase.map(f => (
            <Card key={f.id} className="text-center group hover:border-accent/30 transition-all cursor-default">
              <p className="text-2xl font-bold text-text-primary mb-1">{f.count}</p>
              <p className="text-[10px] text-text-muted uppercase tracking-wider leading-tight">{f.label}</p>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ChevronRight size={18} className="text-accent" />
          Próximos Prazos
        </h3>
        <Card>
          {prazos.filter(p => p.status === 'Pendente').sort((a, b) => a.data.localeCompare(b.data)).slice(0, 5).length === 0 ? (
            <p className="text-sm text-text-muted text-center py-4">Nenhum prazo pendente.</p>
          ) : (
            <div className="divide-y divide-border">
              {prazos.filter(p => p.status === 'Pendente').sort((a, b) => a.data.localeCompare(b.data)).slice(0, 5).map(p => (
                <div key={p.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${isOverdue(p) ? 'bg-danger animate-pulse' : isNextDays(p, 7) ? 'bg-warning' : 'bg-success'}`} />
                    <div>
                      <p className="text-sm font-medium">{p.titulo}</p>
                      <p className="text-xs text-text-muted">{getNomeProcesso(p.processoId)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${isOverdue(p) ? 'text-danger' : ''}`}>{formatDate(p.data)}</p>
                    <p className="text-xs text-text-muted">{p.hora}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
