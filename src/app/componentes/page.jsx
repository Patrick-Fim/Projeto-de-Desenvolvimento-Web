'use client';

import { useState } from 'react';
import Button from '../../components/Button';
import MissionCard from '../../components/MissionCard';
import Modal from '../../components/Modal';
import PageHeader from '../../components/PageHeader';
import CelebracaoAnel from '../../components/CelebracaoAnel';
import AvisoConquista from '../../components/AvisoConquista';
import BolhaMensagem from '../../components/BolhaMensagem';
import { CONQUISTAS } from '../../lib/gamificacao';
import { RINGS } from '../../lib/rings';

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
  // Controla a missão exibida, o modal e a confirmação temporária na página de demonstração.
  const [selectedMission, setSelectedMission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  // Anel da celebração em demonstração (null = nenhuma).
  const [anelCelebracao, setAnelCelebracao] = useState(null);
  // Conquista em demonstração (índice em CONQUISTAS; null = nenhuma).
  const [conquistaDemo, setConquistaDemo] = useState(null);

  const handleOpenModal = (mission) => {
    // Guarda a missão escolhida antes de abrir seus detalhes.
    setSelectedMission(mission);
    setIsModalOpen(true);
  };

  const handleConfirmEngagement = () => {
    // Fecha os detalhes e mostra um aviso temporário de confirmação.
    setIsModalOpen(false);
    setToastMessage(`Você se engajou com sucesso na missão "${selectedMission?.title}"!`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  return (
    <main>
      <PageHeader
        eyebrow="Showcase de Componentes"
        title="Componentes Reutilizáveis"
        description="Página de testes para validar o funcionamento do Button, do MissionCard e do Modal."
      />

      <div className="mx-auto max-w-6xl space-y-12 px-6 py-12">

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="bg-accent text-white p-4 rounded-xl shadow-lg border border-accent/20 flex items-center justify-between animate-fadeIn">
          <span>🌿 {toastMessage}</span>
          <button onClick={() => setToastMessage('')} className="font-bold ml-4">✕</button>
        </div>
      )}

      {/* Teste 1: Componente Button */}
      <section className="space-y-4 bg-card p-6 rounded-2xl border border-border shadow-sm">
        <h2 className="text-2xl font-bold text-foreground [overflow-wrap:anywhere]">1. Componente Button (`src/components/Button.jsx`)</h2>
        <p className="text-sm text-foreground-muted">
          Suporta as variantes <code className="text-primary-text font-mono">primary</code>, <code className="text-accent-text font-mono">ecological</code>, <code className="text-foreground font-mono">dark</code>, <code className="text-primary-text font-mono">outline</code> e <code className="font-mono">ghost</code>, além de tamanhos e acessibilidade por teclado.
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
        <h2 className="text-2xl font-bold text-foreground [overflow-wrap:anywhere]">2. Componente MissionCard (`src/components/MissionCard.jsx`)</h2>
        <p className="text-sm text-foreground-muted">
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
        <h2 className="text-2xl font-bold text-foreground [overflow-wrap:anywhere]">3. Componente Modal (`src/components/Modal.jsx`)</h2>
        <p className="text-sm text-foreground-muted">
          Atende à exigência de interatividade. Suporta fechamento via tecla <kbd className="px-2 py-1 bg-background border border-border rounded text-xs font-mono">ESC</kbd> ou clique na camada de fundo.
        </p>

        <Button variant="ecological" onClick={() => handleOpenModal(mockMissions[0])}>
          Abrir Modal Manualmente
        </Button>
      </section>

      {/* Teste 4: Celebração de missão criada */}
      <section className="space-y-4 bg-card p-6 rounded-2xl border border-border shadow-sm">
        <h2 className="text-2xl font-bold text-foreground [overflow-wrap:anywhere]">4. Componente CelebracaoAnel (`src/components/CelebracaoAnel.jsx`)</h2>
        <p className="text-sm text-foreground-muted">
          Animação exibida ao registrar uma denúncia: cada anel tem partículas e movimento próprios.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          {RINGS.map((ring) => {
            const Icon = ring.Icon;
            return (
              <button
                key={ring.id}
                type="button"
                onClick={() => setAnelCelebracao(ring.id)}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:brightness-110 dark:text-slate-950 ${ring.bg}`}
              >
                <Icon aria-hidden="true" />
                {ring.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Teste 5: Aviso de conquista */}
      <section className="space-y-4 bg-card p-6 rounded-2xl border border-border shadow-sm">
        <h2 className="text-2xl font-bold text-foreground [overflow-wrap:anywhere]">5. Componente AvisoConquista (`src/components/AvisoConquista.jsx`)</h2>
        <p className="text-sm text-foreground-muted">
          Aparece no canto inferior direito, com confetes, quando o protetor desbloqueia uma conquista.
        </p>
        <Button
          variant="primary"
          onClick={() => setConquistaDemo((atual) => (atual === null ? 0 : (atual + 1) % CONQUISTAS.length))}
        >
          Simular conquista
        </Button>
      </section>

      {/* Teste 6: Bolhas do chat */}
      <section className="space-y-4 bg-card p-6 rounded-2xl border border-border shadow-sm">
        <h2 className="text-2xl font-bold text-foreground [overflow-wrap:anywhere]">6. Componente BolhaMensagem (`src/components/BolhaMensagem.jsx`)</h2>
        <p className="text-sm text-foreground-muted">
          Mensagens do chat da missão: texto, foto com legenda (largura fixa, estilo WhatsApp), foto sem legenda e mensagem apagada.
        </p>
        <div className="rounded-xl border border-border bg-background p-4">
          <BolhaMensagem
            mensagem={{ autorNome: 'Ana Silva', autorAnel: 'agua', texto: 'Oi, pessoal! Bora marcar o mutirão para sábado?', criadoEm: '2026-11-05T13:02:00.000Z' }}
          />
          <BolhaMensagem
            agrupada
            mensagem={{ autorNome: 'Ana Silva', autorAnel: 'agua', imagem: '/ProTer1.png', criadoEm: '2026-11-05T13:03:00.000Z' }}
          />
          <BolhaMensagem
            minha
            mensagem={{ autorNome: 'Você', autorAnel: 'terra', imagem: '/ProTer2.png', texto: 'Fechado! Levo as luvas e os sacos de lixo.', criadoEm: '2026-11-05T13:05:00.000Z' }}
          />
          <BolhaMensagem
            minha
            agrupada
            mensagem={{ autorNome: 'Você', autorAnel: 'terra', apagada: true, criadoEm: '2026-11-05T13:06:00.000Z' }}
          />
        </div>
      </section>

      {conquistaDemo !== null && (
        <AvisoConquista
          key={`${conquistaDemo}-${CONQUISTAS[conquistaDemo].id}`}
          conquista={CONQUISTAS[conquistaDemo]}
          onFechar={() => setConquistaDemo(null)}
        />
      )}

      {anelCelebracao && (
        <CelebracaoAnel
          key={anelCelebracao}
          anel={anelCelebracao}
          titulo="Missão de demonstração"
          xp={20}
          onFim={() => setAnelCelebracao(null)}
        />
      )}

      {/* Modal Reutilizável Renderizado */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedMission ? `Missão: ${selectedMission.title}` : 'Detalhes da Missão'}
      >
        {selectedMission && (
          <div className="space-y-4">
            <p className="text-foreground-muted text-sm leading-relaxed">{selectedMission.description}</p>

            <div className="bg-background p-4 rounded-xl border border-border space-y-2 text-xs font-medium text-foreground">
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
      </div>
    </main>
  );
}