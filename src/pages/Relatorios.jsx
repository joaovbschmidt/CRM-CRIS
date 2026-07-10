import { Printer } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';
import { FASES } from '../constants';
import { ReportCliente } from '../reports/ReportCliente';
import { ReportFase } from '../reports/ReportFase';
import { ReportPrazos } from '../reports/ReportPrazos';

export function Relatorios({
  reportType, setReportType,
  reportProcessoId, setReportProcessoId,
  reportFase, setReportFase,
  reportDateStart, setReportDateStart,
  reportDateEnd, setReportDateEnd,
  processos, prazos, getNomeProcesso
}) {
  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      <div data-no-print>
        <h2 className="text-2xl font-bold mb-1">Relatórios</h2>
        <p className="text-sm text-text-secondary">Gere relatórios detalhados para impressão</p>
      </div>

      <div data-no-print className="flex gap-2 flex-wrap">
        {[
          { id: 'A', label: 'Por Cliente' },
          { id: 'B', label: 'Por Fase' },
          { id: 'C', label: 'De Prazos' },
        ].map(r => (
          <button
            key={r.id}
            onClick={() => setReportType(r.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${reportType === r.id
                ? 'bg-accent text-bg-primary shadow-md shadow-accent/20'
                : 'bg-bg-panel border border-border text-text-secondary hover:text-text-primary hover:border-accent/30'
              }`}
          >
            Tipo {r.id} — {r.label}
          </button>
        ))}
      </div>

      <Card className="space-y-4" data-no-print>
        {reportType === 'A' && (
          <Select
            label="Selecione o Cliente / Processo"
            value={reportProcessoId}
            onChange={e => setReportProcessoId(e.target.value)}
            options={processos.map(p => ({ value: p.id, label: `${p.dadosPessoais.nomeCompleto} — ${p.dadosPessoais.numeroProcesso}` }))}
            placeholder="Selecione..."
          />
        )}
        {reportType === 'B' && (
          <Select
            label="Selecione a Fase"
            value={reportFase}
            onChange={e => setReportFase(Number(e.target.value))}
            options={FASES.map(f => ({ value: f.id, label: `Fase ${f.id} — ${f.label}` }))}
          />
        )}
        {reportType === 'C' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Data Início" type="date" value={reportDateStart} onChange={e => setReportDateStart(e.target.value)} />
            <Input label="Data Fim" type="date" value={reportDateEnd} onChange={e => setReportDateEnd(e.target.value)} />
          </div>
        )}
        <Button icon={Printer} onClick={() => window.print()}>Imprimir / Exportar</Button>
      </Card>

      <div data-print-area>
        {reportType === 'A' && <ReportCliente processos={processos} prazos={prazos} reportProcessoId={reportProcessoId} />}
        {reportType === 'B' && <ReportFase processos={processos} prazos={prazos} reportFase={reportFase} />}
        {reportType === 'C' && <ReportPrazos processos={processos} prazos={prazos} reportDateStart={reportDateStart} reportDateEnd={reportDateEnd} getNomeProcesso={getNomeProcesso} />}
      </div>
    </div>
  );
}
