import { useState, useMemo } from 'react';
import { LayoutDashboard, FolderOpen, CalendarDays, FileBarChart, Scale, LogOut } from 'lucide-react';

import { useProcessos } from './hooks/useProcessos';
import { usePrazos } from './hooks/usePrazos';
import { useRelatorios } from './hooks/useRelatorios';

import { FASES } from './constants';
import { isOverdue, isNextDays } from './utils/dateHelpers';

import { Dashboard } from './pages/Dashboard';
import { Processos } from './pages/Processos';
import { Agenda } from './pages/Agenda';
import { Relatorios } from './pages/Relatorios';

import { ProcessoForm } from './forms/ProcessoForm';
import { PrazoForm } from './forms/PrazoForm';
import { ProcessoDetail } from './modals/ProcessoDetail';

export default function CrmJuridico({ onLogout }) {
  const [page, setPage] = useState('dashboard');

  const {
    processos, filteredProcessos, searchProcesso, setSearchProcesso,
    saveProcesso, deleteProcesso, changeFase, getNomeProcesso
  } = useProcessos();

  const {
    prazos, filteredPrazos, filterAgenda, setFilterAgenda,
    savePrazo, deletePrazo, deletePrazosByProcessoId
  } = usePrazos();

  const relatoriosProps = useRelatorios();

  const [showProcessoModal, setShowProcessoModal] = useState(false);
  const [editingProcessoId, setEditingProcessoId] = useState(null);

  const [showPrazoModal, setShowPrazoModal] = useState(false);
  const [editingPrazoId, setEditingPrazoId] = useState(null);

  const [viewProcessoId, setViewProcessoId] = useState(null);

  const stats = useMemo(() => {
    const totalProcessos = processos.length;
    const next7 = prazos.filter(p => isNextDays(p, 7)).length;
    const overdue = prazos.filter(p => isOverdue(p)).length;
    const valorReceber = processos.reduce(
      (s, p) => s + (p.financeiro?.valorAberto || 0),
      0
    );
    const porFase = FASES.map(f => ({
      ...f,
      count: processos.filter(p => p.fase === f.id).length,
    }));
    return { totalProcessos, next7, overdue, valorReceber, porFase };
  }, [processos, prazos]);

  // Processo Handlers
  const openNewProcesso = () => {
    setEditingProcessoId(null);
    setShowProcessoModal(true);
  };

  const openEditProcesso = (proc) => {
    setEditingProcessoId(proc.id);
    setShowProcessoModal(true);
  };

  const handleDeleteProcesso = async (id) => {
    await deletePrazosByProcessoId(id);
    await deleteProcesso(id);
  };

  // Prazo Handlers
  const openNewPrazo = () => {
    setEditingPrazoId(null);
    setShowPrazoModal(true);
  };

  const openEditPrazo = (prazo) => {
    setEditingPrazoId(prazo.id);
    setShowPrazoModal(true);
  };

  // Sidebar
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'processos', label: 'Processos', icon: FolderOpen },
    { id: 'agenda', label: 'Agenda', icon: CalendarDays },
    { id: 'relatorios', label: 'Relatórios', icon: FileBarChart },
  ];

  const renderSidebar = () => (
    <aside data-no-print className="w-64 min-h-screen bg-bg-panel border-r border-border flex flex-col fixed left-0 top-0 z-40">
      <div className="px-6 py-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
            <Scale size={20} className="text-bg-primary" />
          </div>
          <div>
            <h1 className="text-base font-bold text-text-primary tracking-wide">CRM Jurídico</h1>
            <p className="text-[10px] text-text-muted uppercase tracking-widest">Gestão Processual</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${page === item.id
                ? 'bg-accent/15 text-accent shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-highlight'
              }`}
          >
            <item.icon size={18} />
            {item.label}
            {item.id === 'agenda' && stats.overdue > 0 && (
              <span className="ml-auto bg-danger text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {stats.overdue}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="px-6 py-4 border-t border-border space-y-3">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-danger hover:bg-bg-highlight transition-all duration-200"
        >
          <LogOut size={16} />
          Sair
        </button>
        <p className="text-[10px] text-text-muted text-center">
          © {new Date().getFullYear()} CRM Jurídico
        </p>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen">
      {renderSidebar()}
      <main className="flex-1 ml-64 p-8 min-h-screen">
        {page === 'dashboard' && (
          <Dashboard stats={stats} prazos={prazos} getNomeProcesso={getNomeProcesso} />
        )}
        {page === 'processos' && (
          <Processos
            processos={processos}
            filteredProcessos={filteredProcessos}
            searchProcesso={searchProcesso}
            setSearchProcesso={setSearchProcesso}
            openNewProcesso={openNewProcesso}
            openEditProcesso={openEditProcesso}
            deleteProcesso={handleDeleteProcesso}
            changeFase={changeFase}
            setViewProcessoId={setViewProcessoId}
          />
        )}
        {page === 'agenda' && (
          <Agenda
            prazos={prazos}
            filteredPrazos={filteredPrazos}
            filterAgenda={filterAgenda}
            setFilterAgenda={setFilterAgenda}
            stats={stats}
            openNewPrazo={openNewPrazo}
            openEditPrazo={openEditPrazo}
            deletePrazo={deletePrazo}
            getNomeProcesso={getNomeProcesso}
          />
        )}
        {page === 'relatorios' && (
          <Relatorios
            {...relatoriosProps}
            processos={processos}
            prazos={prazos}
            getNomeProcesso={getNomeProcesso}
          />
        )}
      </main>

      {/* Modais */}
      <ProcessoForm
        open={showProcessoModal}
        onClose={() => setShowProcessoModal(false)}
        processo={processos.find(p => p.id === editingProcessoId)}
        onSave={saveProcesso}
      />

      <PrazoForm
        open={showPrazoModal}
        onClose={() => setShowPrazoModal(false)}
        prazo={prazos.find(p => p.id === editingPrazoId)}
        onSave={savePrazo}
        processos={processos}
      />

      <ProcessoDetail
        open={!!viewProcessoId}
        onClose={() => setViewProcessoId(null)}
        processo={processos.find(p => p.id === viewProcessoId)}
        prazos={prazos}
      />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
