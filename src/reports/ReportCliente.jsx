import { Card } from '../components/ui/Card';
import { FaseBadge, StatusBadge } from '../components/ui/Badge';
import { formatDate } from '../utils/formatDate';
import { formatCurrency } from '../utils/formatCurrency';
import { fmt, today } from '../utils/dateHelpers';

export function ReportCliente({ processos, prazos, reportProcessoId }) {
  const proc = processos.find(p => p.id === reportProcessoId);
  if (!proc) return <p className="text-sm text-text-muted py-8 text-center">Selecione um cliente para gerar o relatório.</p>;
  const procs = prazos.filter(p => p.processoId === reportProcessoId);

  return (
    <Card className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h3 className="text-lg font-bold">Relatório do Cliente</h3>
          <p className="text-xs text-text-muted">Gerado em {formatDate(fmt(today))}</p>
        </div>
        <FaseBadge faseId={proc.fase} />
      </div>

      <div>
        <h4 className="text-sm font-semibold text-accent mb-3">Dados Pessoais</h4>
        <table className="w-full text-sm">
          <tbody>
            {[
              ['Nome', proc.dadosPessoais.nomeCompleto],
              ['CPF/CNPJ', proc.dadosPessoais.cpfCnpj],
              ['RG', proc.dadosPessoais.rg],
              ['Data de Nascimento', formatDate(proc.dadosPessoais.dataNascimento)],
              ['Profissão', proc.dadosPessoais.profissao],
              ['Nº Processo', proc.dadosPessoais.numeroProcesso],
              ['Vara/Comarca', proc.dadosPessoais.varaComarca],
              ['Tipo de Ação', proc.dadosPessoais.tipoAcao],
              ['Advogado', proc.dadosPessoais.advogadoResponsavel],
              ['Data de Abertura', formatDate(proc.dadosPessoais.dataAbertura)],
            ].map(([l, v], i) => (
              <tr key={i} className="border-b border-border/50">
                <td className="py-1.5 text-text-muted w-40">{l}</td>
                <td className="py-1.5 font-medium">{v || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-accent mb-3">Contato</h4>
        <table className="w-full text-sm">
          <tbody>
            {[
              ['Telefone', proc.contato.telefonePrincipal],
              ['WhatsApp', proc.contato.whatsapp],
              ['E-mail', proc.contato.email],
              ['Endereço', `${proc.contato.rua}, ${proc.contato.numero} — ${proc.contato.bairro}, ${proc.contato.cidade} — ${proc.contato.cep}`],
              ['Emergência', `${proc.contato.contatoEmergenciaNome} (${proc.contato.contatoEmergenciaTelefone})`],
            ].map(([l, v], i) => (
              <tr key={i} className="border-b border-border/50">
                <td className="py-1.5 text-text-muted w-40">{l}</td>
                <td className="py-1.5 font-medium">{v || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-accent mb-3">Financeiro</h4>
        <table className="w-full text-sm">
          <tbody>
            {[
              ['Honorários', formatCurrency(proc.financeiro.honorarios)],
              ['Pagamento', proc.financeiro.formaPagamento],
              ['Parcelas', `${proc.financeiro.parcelas}x de ${formatCurrency(proc.financeiro.valorParcela)}`],
              ['Recebido', formatCurrency(proc.financeiro.valorRecebido)],
              ['Em Aberto', formatCurrency(proc.financeiro.valorAberto)],
              ['Observações', proc.financeiro.observacoes],
            ].map(([l, v], i) => (
              <tr key={i} className="border-b border-border/50">
                <td className="py-1.5 text-text-muted w-40">{l}</td>
                <td className="py-1.5 font-medium">{v || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {procs.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-accent mb-3">Prazos Vinculados</h4>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-xs text-text-muted uppercase">Título</th>
                <th className="text-left py-2 text-xs text-text-muted uppercase">Data</th>
                <th className="text-left py-2 text-xs text-text-muted uppercase">Hora</th>
                <th className="text-left py-2 text-xs text-text-muted uppercase">Tipo</th>
                <th className="text-left py-2 text-xs text-text-muted uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {procs.sort((a, b) => a.data.localeCompare(b.data)).map(p => (
                <tr key={p.id} className="border-b border-border/50">
                  <td className="py-2">{p.titulo}</td>
                  <td className="py-2">{formatDate(p.data)}</td>
                  <td className="py-2">{p.hora}</td>
                  <td className="py-2">{p.tipo}</td>
                  <td className="py-2"><StatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
