import { fmt, addDays, today } from '../utils/dateHelpers';

export const INITIAL_PRAZOS = [
  {
    id: '1',
    processoId: '1',
    titulo: 'Audiência de Instrução e Julgamento',
    data: fmt(addDays(today, 2)),
    hora: '14:00',
    tipo: 'Audiência',
    status: 'Pendente',
  },
  {
    id: '2',
    processoId: '1',
    titulo: 'Prazo para juntada de documentos',
    data: fmt(addDays(today, -5)),
    hora: '23:59',
    tipo: 'Prazo Processual',
    status: 'Pendente',
  },
  {
    id: '3',
    processoId: '2',
    titulo: 'Reunião com perito judicial',
    data: fmt(addDays(today, 5)),
    hora: '10:00',
    tipo: 'Reunião',
    status: 'Pendente',
  },
  {
    id: '4',
    processoId: '2',
    titulo: 'Entrega de laudo pericial',
    data: fmt(addDays(today, 15)),
    hora: '18:00',
    tipo: 'Perícia',
    status: 'Pendente',
  },
  {
    id: '5',
    processoId: '3',
    titulo: 'Audiência de Custódia',
    data: fmt(addDays(today, 1)),
    hora: '09:30',
    tipo: 'Audiência',
    status: 'Pendente',
  },
];
