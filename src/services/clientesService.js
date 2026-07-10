import { supabase } from "../database/supabase";

// Converte o formato usado nos formulários (dadosPessoais + contato)
// para as colunas da tabela `clientes`
function toRow({ dadosPessoais, contato, userId }) {
  return {
    user_id: userId,
    nome_completo: dadosPessoais.nomeCompleto,
    cpf_cnpj: dadosPessoais.cpfCnpj,
    rg: dadosPessoais.rg,
    data_nascimento: dadosPessoais.dataNascimento || null,
    profissao: dadosPessoais.profissao,
    telefone: contato.telefonePrincipal,
    whatsapp: contato.whatsapp,
    email: contato.email,
    rua: contato.rua,
    numero: contato.numero,
    bairro: contato.bairro,
    cidade: contato.cidade,
    cep: contato.cep,
    contato_emergencia_nome: contato.contatoEmergenciaNome,
    contato_emergencia_telefone: contato.contatoEmergenciaTelefone,
  };
}

// Converte uma linha da tabela `clientes` de volta pro formato usado nos formulários
export function clienteRowToForm(row) {
  if (!row) return null;

  return {
    dadosPessoais: {
      nomeCompleto: row.nome_completo || '',
      cpfCnpj: row.cpf_cnpj || '',
      rg: row.rg || '',
      dataNascimento: row.data_nascimento || '',
      profissao: row.profissao || '',
    },
    contato: {
      telefonePrincipal: row.telefone || '',
      whatsapp: row.whatsapp || '',
      email: row.email || '',
      rua: row.rua || '',
      numero: row.numero || '',
      bairro: row.bairro || '',
      cidade: row.cidade || '',
      cep: row.cep || '',
      contatoEmergenciaNome: row.contato_emergencia_nome || '',
      contatoEmergenciaTelefone: row.contato_emergencia_telefone || '',
    },
  };
}

export const clientesService = {
  async createCliente({ dadosPessoais, contato, userId }) {
    const { data, error } = await supabase
      .from("clientes")
      .insert(toRow({ dadosPessoais, contato, userId }))
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCliente(id, { dadosPessoais, contato, userId }) {
    const { data, error } = await supabase
      .from("clientes")
      .update(toRow({ dadosPessoais, contato, userId }))
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
