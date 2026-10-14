'use client';

import { useState, useEffect } from 'react';
import MissionCard from '../../components/MissionCard';
import Modal from '../../components/Modal';
import Button from '../../components/Button';

const RINGS = [
  { id: 'todos', label: 'Todos os Anéis', icon: '✨' },
  { id: 'terra', label: 'Terra', icon: '🌿' },
  { id: 'fogo', label: 'Fogo', icon: '🔥' },
  { id: 'vento', label: 'Vento', icon: '💨' },
  { id: 'agua', label: 'Água', icon: '💧' },
  { id: 'coracao', label: 'Coração', icon: '❤️' },
];

export default function MissoesPage() {
  const [missoes, setMissoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estados para as Interações (Busca e Filtro)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRing, setSelectedRing] = useState('todos');

  // Estados para o Modal e Feedback
  const [selectedMission, setSelectedMission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 1. Consumo da API REST (GET)
  const carregarMissoes = async () => {
    try {
      setLoading(true);
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

  // 2. Consumo da API REST (DELETE)
  const handleDeleteMission = async (id) => {
    try {
      const res = await fetch(`/api/missoes?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao excluir missão');
      
      setToastMessage('Denúncia/Missão removida com sucesso!');
      setIsModalOpen(false);
      carregarMissoes(); // Recarrega a lista
      setTimeout(() => setToastMessage(''), 4000);
    } catch (err) {
      alert(err.message);
    }
  };

  // Filtragem combinada (Busca + Anel Elemental)
  const missoesFiltradas = missoes.filter((m) => {
    const matchesSearch = 
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRing = selectedRing === 'todos' || m.ring.toLowerCase() === selectedRing;

    return matchesSearch && matchesRing;
  });

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-8 min-h-[80vh]">
      {/* Cabeçalho */}
      <header className="space-y-2 border-b border-border pb-6">
        <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">
          ✓ Painel Comunitário
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
          Missões e Ocorrências Ativas
        </h1>
        <p className="text-foreground/70 text-sm md:text-base max-w-2xl">
          Acompanhe os focos de atuação ecológica, filtre por elemento e engaje-se diretamente em causas ativas na sua região.
        </p>
      </header>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="bg-accent text-white p-4 rounded-xl shadow-md flex justify-between items-center animate-fadeIn">
          <span>🌿 {toastMessage}</span>
          <button onClick={() => setToastMessage('')} className="font-bold ml-4">✕</button>
        </div>
      )}

      {/* Barra de Filtros e Busca (Interações) */}
      <section className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Busca por texto */}
          <div className="w-full md:w-1/2">
            <label htmlFor="search" className="sr-only">Buscar missão por título ou cidade</label>
            <input
              id="search"
              type="text"
              placeholder="🔍 Buscar por título ou localidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {/* Contador de resultados */}
          <span className="text-xs font-semibold text-foreground/60">
            Exibindo {missoesFiltradas.length} de {missoes.length} ocorrências
          </span>
        </div>

        {/* Botoes de Seleção de Anel Elemental */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          {RINGS.map((ring) => (
            <button
              key={ring.id}
              onClick={() => setSelectedRing(ring.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedRing === ring.id
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-background hover:bg-primary/10 text-foreground border border-border'
              }`}
            >
              <span>{ring.icon}</span>
              <span>{ring.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Estado de Carregamento e Erro */}
      {loading && (
        <div className="text-center py-16 text-foreground/60">
          <p className="text-lg animate-pulse">Carregando missões ambientais...</p>
        </div>
      )}

      {error && (
        <div className="bg-ring-fire/10 border border-ring-fire text-ring-fire p-4 rounded-xl text-center">
          <p className="font-bold">Erro ao conectar com a API:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Grid de Missões */}
      {!loading && !error && (
        missoesFiltradas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {missoesFiltradas.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onSelectMission={(m) => {
                  setSelectedMission(m);
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card border border-border rounded-2xl p-8 space-y-3">
            <p className="text-3xl">🌱</p>
            <h3 className="text-lg font-bold text-foreground">Nenhuma missão encontrada</h3>
            <p className="text-sm text-foreground/70">Tente ajustar seus termos de busca ou o filtro de Anel Elemental.</p>
          </div>
        )
      )}

      {/* Modal de Detalhes e Ações (DELETE / Engajar) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedMission ? selectedMission.title : 'Detalhes'}
      >
        {selectedMission && (
          <div className="space-y-4">
            <p className="text-foreground/80 text-sm leading-relaxed">{selectedMission.description}</p>

            <div className="bg-background p-4 rounded-xl border border-border space-y-1.5 text-xs">
              <p>📍 <strong>Localização:</strong> {selectedMission.location}</p>
              <p>👥 <strong>Voluntários:</strong> {selectedMission.participants} Protetores</p>
              <p>🏷️ <strong>Anel Elemental:</strong> {selectedMission.ring?.toUpperCase()}</p>
              <p>⚡ <strong>Status:</strong> {selectedMission.status}</p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-border">
              {/* Botão DELETE */}
              <button
                onClick={() => handleDeleteMission(selectedMission.id)}
                className="text-xs text-ring-fire hover:underline font-semibold"
              >
                🗑️ Excluir Ocorrência (API DELETE)
              </button>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Fechar
                </Button>
                <Button
                  variant="ecological"
                  size="sm"
                  onClick={() => {
                    setIsModalOpen(false);
                    setToastMessage(`Você se voluntariou para: "${selectedMission.title}"!`);
                    setTimeout(() => setToastMessage(''), 4000);
                  }}
                >
                  Confirmar Engajamento
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}