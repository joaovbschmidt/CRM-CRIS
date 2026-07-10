import { useState, useEffect } from 'react';
import { FASES, TIPOS_ACAO, FORMAS_PAGAMENTO } from '../constants';
import { emptyDadosPessoais, emptyContato, emptyFinanceiro } from '../data/mockProcessos';
import { Modal } from '../components/ui/Modal';
import { TabButton } from '../components/navigation/TabButton';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';

export function ProcessoForm({ open, onClose, processo, onSave }) {
  const [processoTab, setProcessoTab] = useState('pessoais');
  const [formDP, setFormDP] = useState({ ...emptyDadosPessoais });
  const [formContato, setFormContato] = useState({ ...emptyContato });
  const [formFin, setFormFin] = useState({ ...emptyFinanceiro });
  const [formFase, setFormFase] = useState(1);

  useEffect(() => {
    if (open) {
      if (processo) {
        setFormDP({ ...processo.dadosPessoais });
        setFormContato({ ...processo.contato });
        setFormFin({ ...processo.financeiro });
        setFormFase(processo.fase);
      } else {
        setFormDP({ ...emptyDadosPessoais });
        setFormContato({ ...emptyContato });
        setFormFin({ ...emptyFinanceiro });
        setFormFase(1);
      }
      setProcessoTab('pessoais');
    }
  }, [open, processo]);

  const handleSave = () => {
    onSave({
      id: processo ? processo.id : undefined,
      dadosPessoais: { ...formDP },
      contato: { ...formContato },
      financeiro: { ...formFin },
      fase: formFase,
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={processo ? 'Editar Processo' : 'Novo Processo'}
      wide
    >
      <div className="flex gap-2 mb-6">
        <TabButton active={processoTab === 'pessoais'} onClick={() => setProcessoTab('pessoais')}>Dados Pessoais</TabButton>
        <TabButton active={processoTab === 'contato'} onClick={() => setProcessoTab('contato')}>Contato</TabButton>
        <TabButton active={processoTab === 'financeiro'} onClick={() => setProcessoTab('financeiro')}>Financeiro</TabButton>
      </div>

      {processoTab === 'pessoais' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Nome Completo" value={formDP.nomeCompleto} onChange={e => setFormDP({ ...formDP, nomeCompleto: e.target.value })} />
          <Input label="CPF / CNPJ" value={formDP.cpfCnpj} onChange={e => setFormDP({ ...formDP, cpfCnpj: e.target.value })} />
          <Input label="RG" value={formDP.rg} onChange={e => setFormDP({ ...formDP, rg: e.target.value })} />
          <Input label="Data de Nascimento" type="date" value={formDP.dataNascimento} onChange={e => setFormDP({ ...formDP, dataNascimento: e.target.value })} />
          <Input label="Profissão" value={formDP.profissao} onChange={e => setFormDP({ ...formDP, profissao: e.target.value })} />
          <Input label="Nº do Processo Judicial" value={formDP.numeroProcesso} onChange={e => setFormDP({ ...formDP, numeroProcesso: e.target.value })} />
          <Input label="Vara / Comarca" value={formDP.varaComarca} onChange={e => setFormDP({ ...formDP, varaComarca: e.target.value })} />
          <Select label="Tipo de Ação" value={formDP.tipoAcao} onChange={e => setFormDP({ ...formDP, tipoAcao: e.target.value })} options={TIPOS_ACAO} />
          <Input label="Advogado Responsável" value={formDP.advogadoResponsavel} onChange={e => setFormDP({ ...formDP, advogadoResponsavel: e.target.value })} />
          <Input label="Data de Abertura" type="date" value={formDP.dataAbertura} onChange={e => setFormDP({ ...formDP, dataAbertura: e.target.value })} />
          <Select
            label="Fase do Processo"
            value={formFase}
            onChange={e => setFormFase(Number(e.target.value))}
            options={FASES.map(f => ({ value: f.id, label: `Fase ${f.id} — ${f.label}` }))}
          />
        </div>
      )}

      {processoTab === 'contato' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Telefone Principal" value={formContato.telefonePrincipal} onChange={e => setFormContato({ ...formContato, telefonePrincipal: e.target.value })} />
          <Input label="WhatsApp" value={formContato.whatsapp} onChange={e => setFormContato({ ...formContato, whatsapp: e.target.value })} />
          <div className="col-span-2">
            <Input label="E-mail" type="email" value={formContato.email} onChange={e => setFormContato({ ...formContato, email: e.target.value })} />
          </div>
          <Input label="Rua" value={formContato.rua} onChange={e => setFormContato({ ...formContato, rua: e.target.value })} />
          <Input label="Número" value={formContato.numero} onChange={e => setFormContato({ ...formContato, numero: e.target.value })} />
          <Input label="Bairro" value={formContato.bairro} onChange={e => setFormContato({ ...formContato, bairro: e.target.value })} />
          <Input label="Cidade" value={formContato.cidade} onChange={e => setFormContato({ ...formContato, cidade: e.target.value })} />
          <Input label="CEP" value={formContato.cep} onChange={e => setFormContato({ ...formContato, cep: e.target.value })} />
          <div className="col-span-2 border-t border-border pt-4 mt-2">
            <p className="text-xs text-accent font-semibold uppercase tracking-wider mb-3">Contato de Emergência</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Nome" value={formContato.contatoEmergenciaNome} onChange={e => setFormContato({ ...formContato, contatoEmergenciaNome: e.target.value })} />
              <Input label="Telefone" value={formContato.contatoEmergenciaTelefone} onChange={e => setFormContato({ ...formContato, contatoEmergenciaTelefone: e.target.value })} />
            </div>
          </div>
        </div>
      )}

      {processoTab === 'financeiro' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Honorários Acordados (R$)" type="number" value={formFin.honorarios} onChange={e => setFormFin({ ...formFin, honorarios: Number(e.target.value) })} />
          <Select label="Forma de Pagamento" value={formFin.formaPagamento} onChange={e => setFormFin({ ...formFin, formaPagamento: e.target.value })} options={FORMAS_PAGAMENTO} />
          <Input label="Qtd. de Parcelas" type="number" value={formFin.parcelas} onChange={e => setFormFin({ ...formFin, parcelas: Number(e.target.value) })} />
          <Input label="Valor por Parcela (R$)" type="number" value={formFin.valorParcela} onChange={e => setFormFin({ ...formFin, valorParcela: Number(e.target.value) })} />
          <Input label="Valor já Recebido (R$)" type="number" value={formFin.valorRecebido} onChange={e => setFormFin({ ...formFin, valorRecebido: Number(e.target.value) })} />
          <Input label="Valor em Aberto (R$)" type="number" value={formFin.valorAberto} onChange={e => setFormFin({ ...formFin, valorAberto: Number(e.target.value) })} />
          <div className="col-span-2">
            <Textarea label="Observações Financeiras" value={formFin.observacoes} onChange={e => setFormFin({ ...formFin, observacoes: e.target.value })} />
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave}>{processo ? 'Salvar Alterações' : 'Cadastrar Processo'}</Button>
      </div>
    </Modal>
  );
}
