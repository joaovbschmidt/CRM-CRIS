import { useState, useMemo, useEffect } from 'react';
import { processosService } from '../services/processosService';

export function useProcessos() {
  const [processos, setProcessos] = useState([]);
  const [searchProcesso, setSearchProcesso] = useState('');

  useEffect(() => {
    async function carregarProcessos() {
      try {
        const dados = await processosService.getProcessos();
        setProcessos(dados);
      } catch (error) {
        console.error('Erro ao carregar processos:', error);
      }
    }

    carregarProcessos();
  }, []);

  const filteredProcessos = useMemo(() => {
    if (!searchProcesso.trim()) return processos;

    const q = searchProcesso.toLowerCase();

    return processos.filter(p =>
      p.numero_processo?.toLowerCase().includes(q) ||
      p.tipo_acao?.toLowerCase().includes(q) ||
      p.advogado_responsavel?.toLowerCase().includes(q)
    );
  }, [processos, searchProcesso]);


  const saveProcesso = async (proc) => {
    try {
      if (proc.id) {
        const atualizado = await processosService.updateProcesso(proc.id, proc);
        setProcessos(prev => prev.map(p => (p.id === proc.id ? atualizado : p)));
      } else {
        const criado = await processosService.createProcesso(proc);
        setProcessos(prev => [criado, ...prev]);
      }
    } catch (error) {
      console.error('Erro ao salvar processo:', error);
      throw error;
    }
  };


  const deleteProcesso = async (id) => {
    try {
      await processosService.deleteProcesso(id);
      setProcessos(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Erro ao excluir processo:', error);
    }
  };


  const changeFase = async (id, fase) => {
    // Atualiza a tela na hora, sem esperar o servidor responder
    setProcessos(prev => prev.map(p => (p.id === id ? { ...p, fase } : p)));

    try {
      const proc = processos.find(p => p.id === id);
      if (proc) await processosService.updateProcesso(id, { ...proc, fase });
    } catch (error) {
      console.error('Erro ao atualizar fase:', error);
    }
  };


  const getNomeProcesso = (id) => {
    const p = processos.find(x => x.id === id);

    return p ? p.numero_processo : '—';
  };


  return {
    processos,
    filteredProcessos,
    searchProcesso,
    setSearchProcesso,
    saveProcesso,
    deleteProcesso,
    changeFase,
    getNomeProcesso
  };
}