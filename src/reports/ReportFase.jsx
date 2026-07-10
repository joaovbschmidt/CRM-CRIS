import { Card } from '../components/ui/Card';
import { FaseBadge } from '../components/ui/Badge';
import { FASES } from '../constants';
import { formatDate } from '../utils/formatDate';
import { fmt, today } from '../utils/dateHelpers';

export function ReportFase({ processos, prazos, reportFase }) {
  const fase = FASES.find(f => f.id === reportFase);
  const procs = processos.filter(p => p.fase === reportFase);

  return (
    <Card className="space-y-4">
      <div className="border-b border-border pb-4">
        <h3 className="text-lg font-bold">Relatório por Fase</h3>
        <div className="flex items-center gap-2 mt-1">
          <FaseBadge faseId={reportFase} />
          <span className="text-xs text-text-muted">• {procs.length} processo(s) • Gerado em {formatDate(fmt(today))}</span>
        </div>
      </div>

      {procs.length === 0 ? (
        <p className="text-sm text-text-muted py-4 text-center">Nenhum processo nesta fase.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 text-xs text-text-muted uppercase">Cliente</th>
              <th className="text-left py-2 text-xs text-text-muted uppercase">Tipo de Ação</th>
              <th className="text-left py-2 text-xs text-text-muted uppercase">Nº Processo</th>
              <th className="text-left py-2 text-xs text-text-muted uppercase">Próximo Prazo</th>
            </tr>
          </thead>
          <tbody>
            {procs.map(proc => {
              const nextPrazo = prazos
                .filter(p => p.processoId === proc.id && p.status === 'Pendente')
                .sort((a, b) => a.data.localeCompare(b.data))[0];
              return (
                <tr key={proc.id} className="border-b border-border/50">
                  <td className="py-2 font-medium">{proc.dadosPessoais.nomeCompleto}</td>
                  <td className="py-2">{proc.dadosPessoais.tipoAcao}</td>
                  <td className="py-2 text-xs font-mono">{proc.dadosPessoais.numeroProcesso}</td>
                  <td className="py-2">
                    {nextPrazo
                      ? `${formatDate(nextPrazo.data)} — ${nextPrazo.titulo}`
                      : <span className="text-text-muted">Sem prazos</span>
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </Card>
  );
}
