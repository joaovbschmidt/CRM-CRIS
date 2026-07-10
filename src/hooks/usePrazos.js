import { useState, useMemo } from 'react';
import { INITIAL_PRAZOS } from '../data/mockPrazos';
import { genId } from '../utils/idGenerator';
import { isNextDays, isOverdue } from '../utils/dateHelpers';

export function usePrazos() {
  const [prazos, setPrazos] = useState(INITIAL_PRAZOS);
  const [filterAgenda, setFilterAgenda] = useState('todos');

  const filteredPrazos = useMemo(() => {
    let list = [...prazos].sort((a, b) => a.data.localeCompare(b.data));
    if (filterAgenda === 'pendentes') list = list.filter(p => p.status === 'Pendente');
    else if (filterAgenda === 'proximos7') list = list.filter(p => isNextDays(p, 7));
    else if (filterAgenda === 'vencidos') list = list.filter(p => isOverdue(p));
    return list;
  }, [prazos, filterAgenda]);

  const savePrazo = (prazo) => {
    if (prazos.find(p => p.id === prazo.id)) {
      setPrazos(prev => prev.map(x => x.id === prazo.id ? prazo : x));
    } else {
      setPrazos(prev => [...prev, { ...prazo, id: prazo.id || genId() }]);
    }
  };

  const deletePrazo = (id) => {
    setPrazos(prev => prev.filter(p => p.id !== id));
  };

  const deletePrazosByProcessoId = (processoId) => {
    setPrazos(prev => prev.filter(p => p.processoId !== processoId));
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
