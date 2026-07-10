import { Plus, Search, FolderOpen, User, Hash, Gavel, Building2, Users, DollarSign, Eye, Edit3, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { FaseBadge } from '../components/ui/Badge';
import { formatCurrency } from '../utils/formatCurrency';
import { FASES } from '../constants';

export function Processos({
  processos, filteredProcessos, searchProcesso, setSearchProcesso,
  openNewProcesso, openEditProcesso, deleteProcesso, changeFase, setViewProcessoId
}) {
  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold mb-1">Processos</h2>
          <p className="text-sm text-text-secondary">{processos.length} processos cadastrados</p>
        </div>
        <Button icon={Plus} onClick={openNewProcesso}>Novo Processo</Button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={searchProcesso}
          onChange={e => setSearchProcesso(e.target.value)}
          placeholder="Buscar por nome, nº do processo ou tipo de ação..."
          className="w-full bg-bg-panel border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary
                     placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30"
        />
      </div>

      {filteredProcessos.length === 0 ? (
        <EmptyState icon={FolderOpen} title="Nenhum processo encontrado" description="Adicione um novo processo ou ajuste sua busca." />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filteredProcessos.map(proc => (
            <Card key={proc.id} hover className="group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <User size={14} className="text-accent shrink-0" />
                    <h3 className="text-base font-semibold truncate">{proc.dadosPessoais.nomeCompleto}</h3>
                  </div>
                  <p className="text-xs text-text-muted flex items-center gap-1.5">
                    <Hash size={11} /> {proc.dadosPessoais.numeroProcesso}
                  </p>
                </div>
                <FaseBadge faseId={proc.fase} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs text-text-secondary">
                <div className="flex items-center gap-1.5">
                  <Gavel size={12} className="text-text-muted" />
                  {proc.dadosPessoais.tipoAcao}
                </div>
                <div className="flex items-center gap-1.5">
                  <Building2 size={12} className="text-text-muted" />
                  {proc.dadosPessoais.varaComarca.split(' - ')[0]}
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={12} className="text-text-muted" />
                  {proc.dadosPessoais.advogadoResponsavel}
                </div>
                <div className="flex items-center gap-1.5">
                  <DollarSign size={12} className="text-text-muted" />
                  {formatCurrency(proc.financeiro.valorAberto)} em aberto
                </div>
              </div>

              <div className="mb-4">
                <select
                  value={proc.fase}
                  onChange={e => changeFase(proc.id, Number(e.target.value))}
                  onClick={e => e.stopPropagation()}
                  className="w-full bg-bg-primary border border-border rounded-lg px-3 py-1.5 text-xs text-text-primary
                             focus:outline-none focus:border-accent appearance-none"
                >
                  {FASES.map(f => (
                    <option key={f.id} value={f.id}>Fase {f.id} — {f.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 border-t border-border pt-3">
                <Button size="sm" variant="ghost" icon={Eye} onClick={() => setViewProcessoId(proc.id)}>Ver</Button>
                <Button size="sm" variant="ghost" icon={Edit3} onClick={() => openEditProcesso(proc)}>Editar</Button>
                <Button size="sm" variant="danger" icon={Trash2} onClick={() => deleteProcesso(proc.id)}>Excluir</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
