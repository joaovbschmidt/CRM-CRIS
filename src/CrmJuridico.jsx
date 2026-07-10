import { useState, useMemo } from 'react';
import { LayoutDashboard, FolderOpen, CalendarDays, FileBarChart, Scale, LogOut, Menu, X } from 'lucide-react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const goToPage = (id) => {
    setPage(id);
    setMobileMenuOpen(false);
  };

  const renderSidebar = () => (
    <>
      {/* overlay no mobile, fecha o menu ao clicar fora */}
      {mobileMenuOpen && (
        <div
          data-no-print
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        data-no-print
        className={`w-64 min-h-screen bg-bg-panel border-r border-border flex flex-col fixed left-0 top-0 z-50
          transition-transform duration-200 ease-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="px-6 py-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border border-accent/40 rounded-md flex items-center justify-center">
              <Scale size={18} className="text-accent" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-text-primary tracking-wide font-display">CRM Jurídico</h1>
              <p className="text-[10px] text-text-muted uppercase tracking-widest">Gestão Processual</p>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-text-muted hover:text-text-primary p-1"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => goToPage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200
                ${page === item.id
                  ? 'bg-accent/15 text-accent border-l-2 border-accent'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-highlight border-l-2 border-transparent'
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
            className="w-full flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-text-secondary hover:text-danger hover:bg-bg-highlight transition-all duration-200"
          >
            <LogOut size={16} />
            Sair
          </button>
          <p className="text-[10px] text-text-muted text-center">
            © {new Date().getFullYear()} CRM Jurídico
          </p>
        </div>
      </aside>
    </>
  );

  const renderMobileHeader = () => (
    <header data-no-print className="md:hidden sticky top-0 z-30 bg-bg-panel border-b border-border px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Scale size={16} className="text-accent" />
        <span className="text-sm font-semibold font-display text-text-primary">CRM Jurídico</span>
      </div>
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="text-text-secondary hover:text-text-primary p-1"
      >
        <Menu size={22} />
      </button>
    </header>
  );

  return (
    <div className="flex min-h-screen">
      {renderSidebar()}
      <div className="flex-1 md:ml-64 min-h-screen flex flex-col">
        {renderMobileHeader()}
        <main className="flex-1 p-4 md:p-8">        {page === 'dashboard' && (
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
      </div>

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
