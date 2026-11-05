import Button from './Button';

// Mapeamento dos ícones e cores dos 5 Anéis Elementais
const ringStyles = {
  terra: { bg: 'bg-ring-earth', icon: '🌿', label: 'Terra' },
  fogo: { bg: 'bg-ring-fire', icon: '🔥', label: 'Fogo' },
  vento: { bg: 'bg-ring-wind', icon: '💨', label: 'Vento' },
  agua: { bg: 'bg-ring-water', icon: '💧', label: 'Água' },
  coracao: { bg: 'bg-ring-heart', icon: '❤️', label: 'Coração' },
};

export default function MissionCard({ mission, onSelectMission }) {
  const { title, description, ring = 'terra', location, status = 'Ativa', participants = 0 } = mission;
  // Usa Terra como apresentação padrão caso o anel recebido não seja reconhecido.
  const currentRing = ringStyles[ring.toLowerCase()] || ringStyles.terra;

  return (
    <article className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4">
      <div>
        {/* Cabeçalho do Card */}
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold text-white px-3 py-1 rounded-full ${currentRing.bg}`}>
            <span>{currentRing.icon}</span>
            <span>{currentRing.label}</span>
          </span>

          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-primary/15 text-primary-text border border-primary/30">
            {status}
          </span>
        </div>

        {/* Título e Descrição */}
        <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-1">{title}</h3>
        <p className="text-foreground-muted text-sm line-clamp-3 leading-relaxed">{description}</p>
      </div>

      {/* Rodapé do Card */}
      <div className="border-t border-border pt-4 space-y-3">
        <div className="flex justify-between items-center text-xs text-foreground-muted font-medium">
          <span>📍 {location}</span>
          <span>👥 {participants} Protetores</span>
        </div>

        <Button
          variant="primary"
          size="sm"
          className="w-full"
          onClick={() => onSelectMission && onSelectMission(mission)}
          ariaLabel={`Engajar-se na missão ${title}`}
        >
          Engajar na Missão
        </Button>
      </div>
    </article>
  );
}