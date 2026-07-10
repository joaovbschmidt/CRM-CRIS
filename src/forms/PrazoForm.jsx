import { useState, useEffect } from 'react';
import { TIPOS_PRAZO, STATUS_PRAZO } from '../constants';
import { fmt, today } from '../utils/dateHelpers';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';

export function PrazoForm({ open, onClose, prazo, onSave, processos }) {
  const [formPrazo, setFormPrazo] = useState({
    processoId: '', titulo: '', data: fmt(today), hora: '09:00', tipo: 'Audiência', status: 'Pendente'
  });

  useEffect(() => {
    if (open) {
      if (prazo) {
        setFormPrazo({ ...prazo });
      } else {
        setFormPrazo({
          processoId: processos[0]?.id || '',
          titulo: '', data: fmt(today), hora: '09:00', tipo: 'Audiência', status: 'Pendente'
        });
      }
    }
  }, [open, prazo, processos]);

  const handleSave = () => {
    onSave(formPrazo);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={prazo ? 'Editar Prazo' : 'Novo Prazo'}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="col-span-2">
          <Select
            label="Processo Vinculado"
            value={formPrazo.processoId}
            onChange={e => setFormPrazo({ ...formPrazo, processoId: e.target.value })}
            options={processos.map(p => ({ value: p.id, label: `${p.dadosPessoais.nomeCompleto} — ${p.dadosPessoais.numeroProcesso}` }))}
            placeholder="Selecione um processo"
          />
        </div>
        <div className="col-span-2">
          <Input label="Título do Prazo" value={formPrazo.titulo} onChange={e => setFormPrazo({ ...formPrazo, titulo: e.target.value })} />
        </div>
        <Input label="Data" type="date" value={formPrazo.data} onChange={e => setFormPrazo({ ...formPrazo, data: e.target.value })} />
        <Input label="Hora" type="time" value={formPrazo.hora} onChange={e => setFormPrazo({ ...formPrazo, hora: e.target.value })} />
        <Select label="Tipo" value={formPrazo.tipo} onChange={e => setFormPrazo({ ...formPrazo, tipo: e.target.value })} options={TIPOS_PRAZO} />
        <Select label="Status" value={formPrazo.status} onChange={e => setFormPrazo({ ...formPrazo, status: e.target.value })} options={STATUS_PRAZO} />
      </div>
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave}>{prazo ? 'Salvar Alterações' : 'Cadastrar Prazo'}</Button>
      </div>
    </Modal>
  );
}
