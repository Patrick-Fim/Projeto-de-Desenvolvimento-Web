'use client';

import { useState } from 'react';
import Button from '@/components/Button';
import MissionCard from '@/components/MissionCard';
import Modal from '@/components/Modal';

// Dados mockados para testar os cards
const mockMissions = [
  {
    id: 1,
    title: 'Reflorestamento das Margens do Rio',
    description: 'Plantio de mudas nativas para conter a erosão e restaurar a mata ciliar da região central.',
    ring: 'terra',
    location: 'Porto Alegre, RS',
    status: 'Ativa',
    participants: 42,
  },
  {
    id: 2,
    title: 'Mutirão de Limpeza da Praia',
    description: 'Recolhimento de resíduos plásticos e conscientização de banhistas sobre o descarte correto.',
    ring: 'agua',
    location: 'Florianópolis, SC',
    status: 'Ativa',
    participants: 128,
  },
  {
    id: 3,
    title: 'Combate a Focos de Incêndio Urbano',
    description: 'Monitoramento comunitário e denúncia de queimadas irregulares em terrenos baldios.',
    ring: 'fogo',
    location: 'Curitiba, PR',
    status: 'Urgente',
    participants: 15,
  },
];

export default function ComponentesPage() {
  const [selectedMission, setSelectedMission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleOpenModal = (mission) => {
    setSelectedMission(mission);
    setIsModalOpen(true);
  };

  const handleConfirmEngagement = () => {
    setIsModalOpen(false);
    setToastMessage(`Você se engajou com sucesso na missão "${selectedMission?.title}"!`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  return (
    <main className="min-h-screen p-6 md:p-12 space-y-12 max-w-6xl mx-auto">
      {/* Cabeçalho */}
      <header className="border-b border-primary/20 pb-6">
        <span className="text-xs font-semibold tracking-wider uppercase text-accent bg-accent/10 px-3 py-1 rounded-full">
          ✓ Showcase de Componentes
        </span>
        <h1 className="text-4xl font-extrabold text-foreground mt-3">
          Componentes Reutilizáveis
        </h1>
        <p className="text-foreground/70 mt-2 max-w-2xl">
          Página de testes para validar o funcionamento do <code className="bg-primary/10 text-primary px-2 py-0.5 rounded">Button</code>, do <code className="bg-primary/10 text-primary px-2 py-0.5 rounded">MissionCard</code> e do <code className="bg-primary/10 text-primary px-2 py-0.5 rounded">Modal</code>.
        </p>
      </header>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="bg-accent text-white p-4 rounded-xl shadow-lg border border-accent/20 flex items-center justify-between animate-fadeIn">
          <span>🌿 {toastMessage}</span>
          <button onClick={() => setToastMessage('')} className="font-bold ml-4">✕</button>
        </div>
      )}

      {/* Teste 1: Componente Button */}
      <section className="space-y-4 bg-card p-6 rounded-2xl border border-border shadow-sm">
        <h2 className="text-2xl font-bold">1. Componente Button (`src/components/Button.jsx`)</h2>
        <p className="text-sm text-foreground/70">
          Suporta as variantes <code className="text-primary font-mono">primary</code>, <code className="text-accent font-mono">ecological</code>, <code className="text-foreground font-mono">dark</code>, <code className="text-primary font-mono">outline</code> e <code className="font-mono">ghost</code>, além de tamanhos e acessibilidade por teclado.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Button variant="primary" onClick={() => alert('Botão Primary clicado!')}>
            Primary (MD)
          </Button>

          <Button variant="ecological" size="lg" onClick={() => alert('Botão Ecological LG clicado!')}>
            Ecological (LG)
          </Button>

          <Button variant="dark" size="sm" onClick={() => alert('Botão Dark SM clicado!')}>
            Dark (SM)
          </Button>

          <Button variant="outline">
            Outline
          </Button>

          <Button variant="ghost">
            Ghost
          </Button>

          <Button variant="primary" disabled>
            Desabilitado
          </Button>
        </div>
      </section>

      {/* Teste 2: Componente MissionCard */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">2. Componente MissionCard (`src/components/MissionCard.jsx`)</h2>
        <p className="text-sm text-foreground/70">
          Renderização dinâmica com os selos dos Anéis Elementais e botão de engajamento integrado.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {mockMissions.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              onSelectMission={handleOpenModal}
            />
          ))}
        </div>
      </section>

      {/* Teste 3: Componente Modal */}
      <section className="space-y-4 bg-card p-6 rounded-2xl border border-border shadow-sm">
        <h2 className="text-2xl font-bold">3. Componente Modal (`src/components/Modal.jsx`)</h2>
        <p className="text-sm text-foreground/70">
          Atende à exigência de interatividade. Suporta fechamento via tecla <kbd className="px-2 py-1 bg-background border border-border rounded text-xs">ESC</kbd> ou clique na camada de fundo.
        </p>

        <Button variant="ecological" onClick={() => handleOpenModal(mockMissions[0])}>
          Abrir Modal Manualmente
        </Button>
      </section>

      {/* Modal Reutilizável Renderizado */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedMission ? `Missão: ${selectedMission.title}` : 'Detalhes da Missão'}
      >
        {selectedMission && (
          <div className="space-y-4">
            <p className="text-foreground/80">{selectedMission.description}</p>

            <div className="bg-background p-4 rounded-xl border border-border space-y-2 text-sm">
              <p>📍 <strong>Localização:</strong> {selectedMission.location}</p>
              <p>👥 <strong>Voluntários Inscritos:</strong> {selectedMission.participants} Protetores</p>
              <p>⚡ <strong>Status:</strong> {selectedMission.status}</p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button variant="ecological" size="sm" onClick={handleConfirmEngagement}>
                Confirmar Participação
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}