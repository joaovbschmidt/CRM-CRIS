import { supabase } from "../database/supabase";
import { clientesService, clienteRowToForm } from "./clientesService";
import { contratosService, contratoRowToForm } from "./contratosService";

// Pega o usuário logado atualmente. Todas as operações de escrita
// precisam disso pra preencher o user_id (usado pelo RLS).
async function getCurrentUserId() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!user) throw new Error("Usuário não autenticado.");
  return user.id;
}

// Junta as linhas de processos + clientes + contratos no formato
// aninhado (dadosPessoais / contato / financeiro) que as telas usam
function rowToProcesso(row) {
  const clienteForm = clienteRowToForm(row.clientes);
  const contratoForm = contratoRowToForm(
    Array.isArray(row.contratos) ? row.contratos[0] : row.contratos
  );

  return {
    id: row.id,
    clienteId: row.cliente_id,
    fase: row.fase,
    dadosPessoais: {
      ...(clienteForm?.dadosPessoais || {}),
      numeroProcesso: row.numero_processo || '',
      varaComarca: row.vara_comarca || '',
      tipoAcao: row.tipo_acao || 'Cível',
      advogadoResponsavel: row.advogado_responsavel || '',
      dataAbertura: row.data_abertura || '',
    },
    contato: clienteForm?.contato || {},
    financeiro: contratoForm || {},
    // campos "achatados" que algumas telas/buscas usam diretamente
    numero_processo: row.numero_processo,
    tipo_acao: row.tipo_acao,
    advogado_responsavel: row.advogado_responsavel,
  };
}

export const processosService = {
  // Buscar todos os processos do usuário logado, já com cliente e contrato
  async getProcessos() {
    const { data, error } = await supabase
      .from("processos")
      .select("*, clientes(*), contratos(*)")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data.map(rowToProcesso);
  },

  // Criar processo (cria cliente, processo e contrato em sequência)
  async createProcesso(processo) {
    const userId = await getCurrentUserId();

    const cliente = await clientesService.createCliente({
      dadosPessoais: processo.dadosPessoais,
      contato: processo.contato,
      userId,
    });

    const { data: processoRow, error: processoError } = await supabase
      .from("processos")
      .insert({
        user_id: userId,
        cliente_id: cliente.id,
        numero_processo: processo.dadosPessoais.numeroProcesso,
        vara_comarca: processo.dadosPessoais.varaComarca,
        tipo_acao: processo.dadosPessoais.tipoAcao,
        advogado_responsavel: processo.dadosPessoais.advogadoResponsavel,
        fase: processo.fase,
        data_abertura: processo.dadosPessoais.dataAbertura || null,
      })
      .select()
      .single();

    if (processoError) throw processoError;

    const contrato = await contratosService.createContrato({
      financeiro: processo.financeiro,
      processoId: processoRow.id,
      userId,
    });

    return rowToProcesso({ ...processoRow, clientes: cliente, contratos: contrato });
  },

  // Atualizar processo (atualiza cliente, processo e contrato)
  async updateProcesso(id, processo) {
    const userId = await getCurrentUserId();

    // Precisa do cliente_id e do id do contrato pra saber o que atualizar
    const { data: existing, error: fetchError } = await supabase
      .from("processos")
      .select("*, contratos(*)")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    const cliente = await clientesService.updateCliente(existing.cliente_id, {
      dadosPessoais: processo.dadosPessoais,
      contato: processo.contato,
      userId,
    });

    const { data: processoRow, error: processoError } = await supabase
      .from("processos")
      .update({
        numero_processo: processo.dadosPessoais.numeroProcesso,
        vara_comarca: processo.dadosPessoais.varaComarca,
        tipo_acao: processo.dadosPessoais.tipoAcao,
        advogado_responsavel: processo.dadosPessoais.advogadoResponsavel,
        fase: processo.fase,
        data_abertura: processo.dadosPessoais.dataAbertura || null,
      })
      .eq("id", id)
      .select()
      .single();

    if (processoError) throw processoError;

    const existingContrato = Array.isArray(existing.contratos) ? existing.contratos[0] : existing.contratos;

    const contrato = existingContrato
      ? await contratosService.updateContrato(existingContrato.id, {
          financeiro: processo.financeiro,
          processoId: id,
          userId,
        })
      : await contratosService.createContrato({
          financeiro: processo.financeiro,
          processoId: id,
          userId,
        });

    return rowToProcesso({ ...processoRow, clientes: cliente, contratos: contrato });
  },

  // Excluir processo (remove contrato(s) antes, por causa da FK)
  async deleteProcesso(id) {
    const { error: contratoError } = await supabase
      .from("contratos")
      .delete()
      .eq("processo_id", id);

    if (contratoError) throw contratoError;

    const { error } = await supabase
      .from("processos")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  },
};
