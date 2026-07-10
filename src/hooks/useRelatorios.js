import { useState } from 'react';
import { addDays, fmt, today } from '../utils/dateHelpers';

export function useRelatorios() {
  const [reportType, setReportType] = useState('A');
  const [reportProcessoId, setReportProcessoId] = useState('');
  const [reportFase, setReportFase] = useState(1);
  const [reportDateStart, setReportDateStart] = useState(fmt(addDays(today, -30)));
  const [reportDateEnd, setReportDateEnd] = useState(fmt(addDays(today, 30)));

  return {
    reportType, setReportType,
    reportProcessoId, setReportProcessoId,
    reportFase, setReportFase,
    reportDateStart, setReportDateStart,
    reportDateEnd, setReportDateEnd,
  };
}
