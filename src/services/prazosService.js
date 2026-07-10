import { supabase } from "../database/supabase";

async function getCurrentUserId() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!user) throw new Error("Usuário não autenticado.");
  return user.id;
}

function rowToPrazo(row) {
  return {
    id: row.id,
    processoId: row.processo_id,
    titulo: row.titulo,
    data: row.data,
    hora: row.hora,
    tipo: row.tipo,
    status: row.status,
  };
}

export const prazosService = {
  async getPrazos() {
    const { data, error } = await supabase
      .from("prazos")
      .select("*")
      .order("data", { ascending: true });

    if (error) throw error;
    return data.map(rowToPrazo);
  },

  async createPrazo(prazo) {
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from("prazos")
      .insert({
        user_id: userId,
        processo_id: prazo.processoId || null,
        titulo: prazo.titulo,
        data: prazo.data,
        hora: prazo.hora,
        tipo: prazo.tipo,
        status: prazo.status,
      })
      .select()
      .single();

    if (error) throw error;
    return rowToPrazo(data);
  },

  async updatePrazo(id, prazo) {
    const { data, error } = await supabase
      .from("prazos")
      .update({
        processo_id: prazo.processoId || null,
        titulo: prazo.titulo,
        data: prazo.data,
        hora: prazo.hora,
        tipo: prazo.tipo,
        status: prazo.status,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return rowToPrazo(data);
  },

  async deletePrazo(id) {
    const { error } = await supabase
      .from("prazos")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  },

  async deletePrazosByProcessoId(processoId) {
    const { error } = await supabase
      .from("prazos")
      .delete()
      .eq("processo_id", processoId);

    if (error) throw error;
    return true;
  },
};
