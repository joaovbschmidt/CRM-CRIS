import { useState, useMemo, useEffect } from 'react';
import { prazosService } from '../services/prazosService';
import { isNextDays, isOverdue } from '../utils/dateHelpers';

export function usePrazos() {
  const [prazos, setPrazos] = useState([]);
  const [filterAgenda, setFilterAgenda] = useState('todos');

  useEffect(() => {
    prazosService.getPrazos()
      .then(setPrazos)
      .catch(error => console.error('Erro ao carregar prazos:', error));
  }, []);

  const filteredPrazos = useMemo(() => {
    let list = [...prazos].sort((a, b) => a.data.localeCompare(b.data));
    if (filterAgenda === 'pendentes') list = list.filter(p => p.status === 'Pendente');
    else if (filterAgenda === 'proximos7') list = list.filter(p => isNextDays(p, 7));
    else if (filterAgenda === 'vencidos') list = list.filter(p => isOverdue(p));
    return list;
  }, [prazos, filterAgenda]);

  const savePrazo = async (prazo) => {
    try {
      if (prazo.id) {
        const atualizado = await prazosService.updatePrazo(prazo.id, prazo);
        setPrazos(prev => prev.map(p => (p.id === prazo.id ? atualizado : p)));
      } else {
        const criado = await prazosService.createPrazo(prazo);
        setPrazos(prev => [...prev, criado]);
      }
    } catch (error) {
      console.error('Erro ao salvar prazo:', error);
      throw error;
    }
  };

  const deletePrazo = async (id) => {
    try {
      await prazosService.deletePrazo(id);
      setPrazos(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Erro ao excluir prazo:', error);
    }
  };

  const deletePrazosByProcessoId = async (processoId) => {
    try {
      await prazosService.deletePrazosByProcessoId(processoId);
      setPrazos(prev => prev.filter(p => p.processoId !== processoId));
    } catch (error) {
      console.error('Erro ao excluir prazos do processo:', error);
    }
  };

  return {
    prazos,
    filteredPrazos,
    filterAgenda,
    setFilterAgenda,
    savePrazo,
    deletePrazo,
    deletePrazosByProcessoId
  };
}
