'use client';

import { useState, useEffect } from 'react';
import MissionCard from '../../components/MissionCard';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import PageHeader from '../../components/PageHeader';
import { RINGS, getRing } from '../../lib/rings';
import {
  FaMagnifyingGlass,
  FaLocationDot,
  FaUsers,
  FaBolt,
  FaCircleCheck,
  FaTriangleExclamation,
  FaSeedling,
  FaXmark,
  FaTrash,
} from 'react-icons/fa6';

// Opções disponíveis para filtrar as ocorrências pelo Anel Elemental.
const FILTROS = [{ id: 'todos', label: 'Todos os Anéis' }, ...RINGS];

export default function MissoesPage() {
  // Estados da lista, da busca e dos feedbacks das operações.
  const [missoes, setMissoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRing, setSelectedRing] = useState('todos');

  const [selectedMission, setSelectedMission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [toast, setToast] = useState(null);

  const mostrarToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const carregarMissoes = async () => {
    try {
      setLoading(true);
      setError('');
      // Consulta a API local para obter as missões cadastradas.
      const res = await fetch('/api/missoes');
      if (!res.ok) throw new Error('Falha ao carregar as missões');
      const data = await res.json();
      setMissoes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarMissoes();
  }, []);

  const handleDeleteMission = async (id) => {
    try {
      // Exclui a ocorrência e atualiza a lista após a resposta da API.
      const res = await fetch(`/api/missoes?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao excluir missão');

      setIsModalOpen(false);
      setConfirmingDelete(false);
      mostrarToast('success', 'Denúncia/Missão removida com sucesso!');
      carregarMissoes();
    } catch (err) {
      mostrarToast('error', err.message);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setConfirmingDelete(false);
  };

  const missoesFiltradas = missoes.filter((m) => {
    // A busca considera título e localidade; o anel é um filtro adicional.
    const termo = searchTerm.toLowerCase();
    const matchesSearch =
      (m.title || '').toLowerCase().includes(termo) ||
      (m.location || '').toLowerCase().includes(termo);

    const matchesRing = selectedRing === 'todos' || (m.ring || '').toLowerCase() === selectedRing;

    return matchesSearch && matchesRing;
  });

  const ringModal = selectedMission ? getRing(selectedMission.ring) : null;
  const RingModalIcon = ringModal?.Icon;

  return (
    <main>
      <PageHeader
        eyebrow={<><FaSeedling aria-hidden="true" /> Painel Comunitário</>}
        title="Missões e Ocorrências Ativas"
        description="Acompanhe os focos de atuação ecológica, filtre por elemento e engaje-se diretamente em causas ativas na sua região."
      />

      <div className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        {/* Barra de Filtros e Busca */}
        <section aria-label="Filtros de ocorrências" className="space-y-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <label htmlFor="search" className="sr-only">Buscar missão por título ou cidade</label>
              <FaMagnifyingGlass
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted"
              />
              <input
                id="search"
                type="search"
                placeholder="Buscar por título ou localidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-foreground-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <p className="text-sm text-foreground-muted" aria-live="polite">
              Exibindo <strong className="text-foreground">{missoesFiltradas.length}</strong> de {missoes.length} ocorrências
            </p>
          </div>

          {/* Botões de Seleção de Anel Elemental */}
          <div className="flex flex-wrap gap-2 border-t border-border pt-4" role="group" aria-label="Filtrar por anel elemental">
            {FILTROS.map((filtro) => {
              const ativo = selectedRing === filtro.id;
              const Icon = filtro.Icon;
              return (
                <button
                  key={filtro.id}
                  type="button"
                  onClick={() => setSelectedRing(filtro.id)}
                  aria-pressed={ativo}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    ativo
                      ? `border-transparent text-white shadow-md dark:text-slate-950 ${filtro.bg || 'bg-foreground'}`
                      : 'border-border bg-background text-foreground-muted hover:border-primary/40 hover:text-foreground'
                  }`}
                >
                  {Icon && <Icon aria-hidden="true" className={ativo ? '' : filtro.text} />}
                  {filtro.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Estado de Carregamento */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
            <span className="sr-only">Carregando missões ambientais...</span>
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-4 rounded-2xl border border-border bg-card p-6 animate-pulse">
                <div className="h-6 w-24 rounded-full bg-foreground/10" />
                <div className="h-5 w-3/4 rounded bg-foreground/10" />
                <div className="h-4 w-full rounded bg-foreground/10" />
                <div className="h-4 w-5/6 rounded bg-foreground/10" />
                <div className="h-9 w-full rounded-lg bg-foreground/10" />
              </div>
            ))}
          </div>
        )}

        {/* Estado de Erro */}
        {error && !loading && (
          <div role="alert" className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-danger-text/30 bg-danger-text/10 p-5 sm:flex-row sm:items-center">
            <p className="flex items-center gap-2 font-semibold text-danger-text">
              <FaTriangleExclamation aria-hidden="true" />
              Erro ao conectar com a API: {error}
            </p>
            <Button variant="outline" size="sm" onClick={carregarMissoes}>
              Tentar novamente
            </Button>
          </div>
        )}

        {/* Grid de Missões */}
        {!loading && !error && (
          missoesFiltradas.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {missoesFiltradas.map((mission) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  onSelectMission={(m) => {
                    setSelectedMission(m);
                    setConfirmingDelete(false);
                    setIsModalOpen(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-card px-8 py-16 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-2xl text-accent-text">
                <FaSeedling aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-lg font-bold text-foreground">Nenhuma missão encontrada</h2>
              <p className="mt-1 text-sm text-foreground-muted">
                Tente ajustar seus termos de busca ou o filtro de Anel Elemental.
              </p>
            </div>
          )
        )}
      </div>

      {/* Toast Feedback */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 left-1/2 z-[60] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-2xl px-5 py-4 shadow-2xl animate-fadeIn ${
            toast.type === 'error' ? 'bg-ring-fire text-white' : 'bg-accent-text text-white dark:text-slate-950'
          }`}
        >
          {toast.type === 'error' ? <FaTriangleExclamation aria-hidden="true" /> : <FaCircleCheck aria-hidden="true" />}
          <span className="flex-1 text-sm font-semibold">{toast.text}</span>
          <button onClick={() => setToast(null)} aria-label="Fechar aviso" className="cursor-pointer rounded-md p-1 hover:bg-white/15">
            <FaXmark aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedMission ? selectedMission.title : 'Detalhes'}
      >
        {selectedMission && (
          <div className="space-y-5">
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold text-white dark:text-slate-950 ${ringModal.bg}`}>
              <RingModalIcon aria-hidden="true" />
              Anel {ringModal.label}
            </span>

            <p className="text-sm leading-relaxed text-foreground-muted">{selectedMission.description}</p>

            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { Icon: FaLocationDot, label: 'Localização', value: selectedMission.location },
                { Icon: FaUsers, label: 'Voluntários', value: `${selectedMission.participants} Protetores` },
                { Icon: FaBolt, label: 'Status', value: selectedMission.status },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="rounded-xl border border-border bg-background p-3">
                  <dt className="flex items-center gap-1.5 text-xs font-semibold text-foreground-muted">
                    <Icon aria-hidden="true" className="text-primary-text" />
                    {label}
                  </dt>
                  <dd className="mt-1 text-sm font-bold text-foreground">{value}</dd>
                </div>
              ))}
            </dl>

            {/* Confirmação de Exclusão (Passo 2) */}
            {confirmingDelete ? (
              <div className="space-y-3 rounded-xl border border-danger-text/30 bg-danger-text/10 p-4 animate-fadeIn">
                <p className="text-sm font-semibold text-danger-text">
                  Tem certeza que deseja excluir esta ocorrência permanentemente?
                </p>
                <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
                  <Button variant="outline" size="sm" onClick={() => setConfirmingDelete(false)}>
                    Voltar / Cancelar
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteMission(selectedMission.id)}>
                    <FaTrash aria-hidden="true" />
                    Sim, Excluir Ocorrência
                  </Button>
                </div>
              </div>
            ) : (
              /* Ações Padrão */
              <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                <button
                  onClick={() => setConfirmingDelete(true)}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-danger-text transition hover:bg-danger-text/10"
                >
                  <FaTrash aria-hidden="true" />
                  Excluir Ocorrência
                </button>

                <div className="flex flex-col-reverse gap-2 sm:flex-row">
                  <Button variant="outline" size="sm" onClick={handleCloseModal}>
                    Fechar
                  </Button>
                  <Button
                    variant="ecological"
                    size="sm"
                    onClick={() => {
                      handleCloseModal();
                      mostrarToast('success', `Você se voluntariou para: "${selectedMission.title}"!`);
                    }}
                  >
                    Confirmar Engajamento
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </main>
  );
}
