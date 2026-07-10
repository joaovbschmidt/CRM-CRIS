import { supabase } from "../database/supabase";

function toRow({ financeiro, processoId, userId }) {
  return {
    processo_id: processoId,
    user_id: userId,
    honorarios: financeiro.honorarios,
    forma_pagamento: financeiro.formaPagamento,
    parcelas: financeiro.parcelas,
    valor_parcela: financeiro.valorParcela,
    valor_recebido: financeiro.valorRecebido,
    valor_aberto: financeiro.valorAberto,
    observacoes: financeiro.observacoes,
  };
}

export function contratoRowToForm(row) {
  if (!row) return null;

  return {
    honorarios: row.honorarios || 0,
    formaPagamento: row.forma_pagamento || 'À Vista',
    parcelas: row.parcelas || 1,
    valorParcela: row.valor_parcela || 0,
    valorRecebido: row.valor_recebido || 0,
    valorAberto: row.valor_aberto || 0,
    observacoes: row.observacoes || '',
  };
}

export const contratosService = {
  async createContrato({ financeiro, processoId, userId }) {
    const { data, error } = await supabase
      .from("contratos")
      .insert(toRow({ financeiro, processoId, userId }))
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateContrato(id, { financeiro, processoId, userId }) {
    const { data, error } = await supabase
      .from("contratos")
      .update(toRow({ financeiro, processoId, userId }))
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
