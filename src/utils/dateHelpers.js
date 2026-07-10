export const today = new Date();

export const fmt = (d) => d.toISOString().split('T')[0];

export const addDays = (d, n) => { 
  const r = new Date(d); 
  r.setDate(r.getDate() + n); 
  return r; 
};

export const isOverdue = (prazo) => {
  if (prazo.status !== 'Pendente') return false;
  return new Date(prazo.data + 'T23:59:59') < today;
};

export const isNextDays = (prazo, days) => {
  if (prazo.status !== 'Pendente') return false;
  const d = new Date(prazo.data + 'T23:59:59');
  const limit = addDays(today, days);
  return d >= today && d <= limit;
};
