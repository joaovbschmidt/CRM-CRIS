export const FASES = [
  { id: 1, label: 'Consulta Inicial', color: 'bg-info text-white' },
  { id: 2, label: 'Documentação', color: 'bg-[#8E44AD] text-white' },
  { id: 3, label: 'Petição / Protocolo', color: 'bg-warning text-white' },
  { id: 4, label: 'Aguardando Audiência', color: 'bg-[#E67E22] text-white' },
  { id: 5, label: 'Em Andamento', color: 'bg-accent text-bg-primary' },
  { id: 6, label: 'Recursal', color: 'bg-danger text-white' },
  { id: 7, label: 'Encerrado / Arquivado', color: 'bg-text-muted text-white' },
];

export const TIPOS_ACAO = [
  'Trabalhista', 'Cível', 'Criminal', 'Família',
  'Tributário', 'Previdenciário', 'Consumidor', 'Ambiental', 'Outro'
];

export const FORMAS_PAGAMENTO = ['À Vista', 'Parcelado', 'Êxito'];

export const TIPOS_PRAZO = [
  'Audiência', 'Prazo Processual', 'Reunião', 'Perícia', 'Outro'
];

export const STATUS_PRAZO = ['Pendente', 'Concluído', 'Cancelado'];
