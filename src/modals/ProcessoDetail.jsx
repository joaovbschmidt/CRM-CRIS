import { Modal } from '../components/ui/Modal';
import { FaseBadge, StatusBadge } from '../components/ui/Badge';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import { isOverdue } from '../utils/dateHelpers';

export function ProcessoDetail({ open, onClose, processo, prazos }) {
  if (!processo) return null;
  const procs = prazos.filter(p => p.processoId === processo.id);

  return (
    <Modal open={open} onClose={onClose} title={`Processo — ${processo.dadosPessoais.nomeCompleto}`} wide>
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <FaseBadge faseId={processo.fase} />
          <span className="text-xs text-text-muted">{processo.dadosPessoais.numeroProcesso}</span>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-accent uppercase tracking-wider mb-3">Dados Pessoais</h4>
          <div className="grid grid-cols-3 gap-3 text-sm">
            {[
              ['Nome', processo.dadosPessoais.nomeCompleto],
              ['CPF/CNPJ', processo.dadosPessoais.cpfCnpj],
              ['RG', processo.dadosPessoais.rg],
              ['Nascimento', formatDate(processo.dadosPessoais.dataNascimento)],
              ['Profissão', processo.dadosPessoais.profissao],
              ['Tipo de Ação', processo.dadosPessoais.tipoAcao],
              ['Vara/Comarca', processo.dadosPessoais.varaComarca],
              ['Advogado', processo.dadosPessoais.advogadoResponsavel],
              ['Abertura', formatDate(processo.dadosPessoais.dataAbertura)],
            ].map(([l, v], i) => (
              <div key={i}>
                <p className="text-text-muted text-xs">{l}</p>
                <p className="font-medium">{v || '—'}</p>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-border" />

        <div>
          <h4 className="text-xs font-semibold text-accent uppercase tracking-wider mb-3">Contato</h4>
          <div className="grid grid-cols-3 gap-3 text-sm">
            {[
              ['Telefone', processo.contato.telefonePrincipal],
              ['WhatsApp', processo.contato.whatsapp],
              ['E-mail', processo.contato.email],
              ['Endereço', `${processo.contato.rua}, ${processo.contato.numero} — ${processo.contato.bairro}`],
              ['Cidade', processo.contato.cidade],
              ['CEP', processo.contato.cep],
              ['Emergência', `${processo.contato.contatoEmergenciaNome} (${processo.contato.contatoEmergenciaTelefone})`],
            ].map(([l, v], i) => (
              <div key={i} className={l === 'Endereço' ? 'col-span-2' : ''}>
                <p className="text-text-muted text-xs">{l}</p>
                <p className="font-medium">{v || '—'}</p>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-border" />

        <div>
          <h4 className="text-xs font-semibold text-accent uppercase tracking-wider mb-3">Financeiro</h4>
          <div className="grid grid-cols-3 gap-3 text-sm">
            {[
              ['Honorários', formatCurrency(processo.financeiro.honorarios)],
              ['Pagamento', processo.financeiro.formaPagamento],
              ['Parcelas', `${processo.financeiro.parcelas}x de ${formatCurrency(processo.financeiro.valorParcela)}`],
              ['Recebido', formatCurrency(processo.financeiro.valorRecebido)],
              ['Em Aberto', formatCurrency(processo.financeiro.valorAberto)],
            ].map(([l, v], i) => (
              <div key={i}>
                <p className="text-text-muted text-xs">{l}</p>
                <p className={`font-medium ${l === 'Em Aberto' && processo.financeiro.valorAberto > 0 ? 'text-warning' : ''}`}>{v}</p>
              </div>
            ))}
            <div className="col-span-3">
              <p className="text-text-muted text-xs">Observações</p>
              <p className="font-medium">{processo.financeiro.observacoes || '—'}</p>
            </div>
          </div>
        </div>

        {procs.length > 0 && (
          <>
            <hr className="border-border" />
            <div>
              <h4 className="text-xs font-semibold text-accent uppercase tracking-wider mb-3">
                Prazos Vinculados ({procs.length})
              </h4>
              <div className="space-y-2">
                {procs.sort((a, b) => a.data.localeCompare(b.data)).map(p => (
                  <div key={p.id} className="flex items-center justify-between bg-bg-primary rounded-lg px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${isOverdue(p) ? 'bg-danger' : p.status === 'Concluído' ? 'bg-success' : 'bg-warning'}`} />
                      <span className="text-sm">{p.titulo}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-text-muted">{formatDate(p.data)} {p.hora}</span>
                      <StatusBadge status={p.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
