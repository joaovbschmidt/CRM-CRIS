import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { formatDate } from '../utils/formatDate';
import { fmt, today, isOverdue } from '../utils/dateHelpers';

export function ReportPrazos({ processos, prazos, reportDateStart, reportDateEnd, getNomeProcesso }) {
  const filtered = prazos
    .filter(p => p.data >= reportDateStart && p.data <= reportDateEnd)
    .sort((a, b) => a.data.localeCompare(b.data));

  // Agrupar por processo
  const grouped = {};
  filtered.forEach(p => {
    if (!grouped[p.processoId]) grouped[p.processoId] = [];
    grouped[p.processoId].push(p);
  });

  return (
    <Card className="space-y-4">
      <div className="border-b border-border pb-4">
        <h3 className="text-lg font-bold">Relatório de Prazos</h3>
        <p className="text-xs text-text-muted mt-1">
          Período: {formatDate(reportDateStart)} a {formatDate(reportDateEnd)} • {filtered.length} prazo(s) • Gerado em {formatDate(fmt(today))}
        </p>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <p className="text-sm text-text-muted py-4 text-center">Nenhum prazo encontrado no período.</p>
      ) : (
        Object.entries(grouped).map(([procId, items]) => (
          <div key={procId} className="border border-border/50 rounded-lg overflow-hidden">
            <div className="bg-bg-highlight px-4 py-2">
              <p className="text-sm font-semibold">{getNomeProcesso(procId)}</p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left px-4 py-2 text-xs text-text-muted uppercase">Título</th>
                  <th className="text-left px-4 py-2 text-xs text-text-muted uppercase">Data</th>
                  <th className="text-left px-4 py-2 text-xs text-text-muted uppercase">Hora</th>
                  <th className="text-left px-4 py-2 text-xs text-text-muted uppercase">Tipo</th>
                  <th className="text-left px-4 py-2 text-xs text-text-muted uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map(p => (
                  <tr key={p.id} className="border-b border-border/30">
                    <td className="px-4 py-2">{p.titulo}</td>
                    <td className={`px-4 py-2 ${isOverdue(p) ? 'text-danger font-medium' : ''}`}>{formatDate(p.data)}</td>
                    <td className="px-4 py-2">{p.hora}</td>
                    <td className="px-4 py-2">{p.tipo}</td>
                    <td className="px-4 py-2"><StatusBadge status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </Card>
  );
}
