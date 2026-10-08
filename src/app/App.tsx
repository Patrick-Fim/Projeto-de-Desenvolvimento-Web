'use client';

import React, { useState, useEffect, useRef } from "react";
import {
  Leaf, Flame, Wind, Droplets, Heart, Globe, TreePine, Recycle,
  Users, Shield, ArrowRight, ChevronRight, Palette, Menu, X,
  Globe as SocialGlobe, Share2, Video, Mail, MapPin, Phone,
  Zap, Star, CheckCircle,
} from "lucide-react";

// Certifique-se de que a constante se chama C:
const C = {
  primary: "#0096C7",
  dark: "#03045E",
  bg: "#F0F9FF",
  ecoGreen: "#00AB39",
  white: "#FFFFFF",
  earth: "#2E7D32",
  fire: "#E63946",
  wind: "#00B4D8",
  water: "#0077B6",
  heart: "#D62828",
  text: "#0D1B2A",
  muted: "#4A7A5C",
  border: "rgba(0, 150, 199, 0.15)",
};

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  bg:       "#F0F9FF",
  bgHero:   "#E0F2FE",
  white:    "#FFFFFF",
  primary:  "#0096C7",
  primaryD: "#0077B6",
  dark:     "#03045E",
  darkMid:  "#0D1B2A",
  green:    "#00AB39",
  muted:    "#1A6694",
  mutedBg:  "#E0F2FE",
  border:   "rgba(0,150,199,0.15)",
  // rings
  earth:    "#2E7D32",
  fire:     "#E63946",
  wind:     "#00B4D8",
  water:    "#0077B6",
  heart:    "#D62828",
};

const H = '"Montserrat", system-ui, sans-serif';
const B = '"Inter", system-ui, sans-serif';

// ─── Ring data ────────────────────────────────────────────────────────────────
const RINGS = [
  { id: "terra",   name: "Terra",    emoji: "🌿", color: T.earth, bg: "#E8F5E9", icon: Leaf,     mission: "Solo & Florestas",   powers: ["Reflorestamento", "Compostagem", "Biodiversidade"], desc: "Guardiões do solo, florestas e biodiversidade. Plantam, compostam e restauram ecossistemas terrestres devastados.", count: 18420 },
  { id: "fogo",    name: "Fogo",     emoji: "🔥", color: T.fire,  bg: "#FFEBEE", icon: Flame,    mission: "Energia & Clima",    powers: ["Energia Solar", "Anti-queimadas", "Carbono Zero"],  desc: "Combatem queimadas ilegais e promovem a transição para energias limpas como solar e eólica.", count: 12840 },
  { id: "vento",   name: "Vento",    emoji: "💨", color: T.wind,  bg: "#E1F5FE", icon: Wind,     mission: "Ar & Mobilidade",   powers: ["Ar Puro", "Bike Elétrica", "Emissões Zero"],       desc: "Defensores do ar limpo e da mobilidade sustentável. Cada pedalada é um voto pelo futuro.", count: 21550 },
  { id: "agua",    name: "Água",     emoji: "💧", color: T.water, bg: "#E3F2FD", icon: Droplets, mission: "Oceanos & Rios",    powers: ["Praias Limpas", "Corais Vivos", "Água Potável"],    desc: "Guardiões dos mares, rios e aquíferos. Limpam praias, protegem corais e monitoram nascentes.", count: 16730 },
  { id: "coracao", name: "Coração",  emoji: "❤️", color: T.heart, bg: "#FCE4EC", icon: Heart,    mission: "Comunidade & Amor", powers: ["Educação", "Mobilização", "Comunidades"],           desc: "O elo entre todos os anéis. Educam, mobilizam e garantem que nenhum protetor lute sozinho.", count: 31200 },
];

// ─── Animated counter ─────────────────────────────────────────────────────────
function useCounter(target: number, active: boolean, duration = 2000) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    const step = target / (duration / 16);
    let v = 0;
    const t = setInterval(() => {
      v += step;
      if (v >= target) { setN(target); clearInterval(t); }
      else setN(Math.floor(v));
    }, 16);
    return () => clearInterval(t);
  }, [active, target, duration]);
  return n;
}

function Stat({ icon: Icon, value, unit, label, color, active }: {
  icon: React.ElementType; value: number; unit: string; label: string; color: string; active: boolean;
}) {
  const n = useCounter(value, active, 2400);
  const display = n >= 1000000
    ? (n / 1000000).toFixed(1) + "M"
    : n >= 1000
    ? (n / 1000).toFixed(1) + "K"
    : n.toString();

  return (
    <div className="relative rounded-2xl p-8 overflow-hidden group text-center" style={{ background: T.white, border: `2px solid ${T.border}`, boxShadow: "0 4px 24px rgba(0,150,199,0.08)" }}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle at top center, ${color}0A 0%, transparent 60%)` }} />
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: `${color}15`, border: `1.5px solid ${color}30` }}>
        <Icon size={24} style={{ color }} />
      </div>
      <div className="text-4xl font-black mb-1" style={{ fontFamily: H, color }}>
        {display}<span className="text-2xl">{unit}</span>
      </div>
      <p className="text-sm font-medium" style={{ fontFamily: B, color: T.muted }}>{label}</p>
    </div>
  );
}

// ─── Style Guide ──────────────────────────────────────────────────────────────
function StyleGuide({ open, onClose }: { open: boolean; onClose: () => void }) {
  const swatch = (hex: string, name: string, sub: string) => (
    <div key={hex} className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl flex-shrink-0 border border-black/10 shadow-sm" style={{ background: hex }} />
      <div>
        <p className="text-xs font-bold leading-tight" style={{ fontFamily: H, color: T.dark, fontSize: 11 }}>{name}</p>
        <p className="text-[10px] mt-0.5" style={{ fontFamily: B, color: T.muted }}>{sub}</p>
      </div>
    </div>
  );

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/25 z-40 lg:hidden" onClick={onClose} />}
      <aside
        className="fixed top-0 right-0 h-full z-50 overflow-y-auto"
        style={{
          width: 312,
          background: T.white,
          borderLeft: `2px solid ${T.primary}`,
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(.4,0,.2,1)",
          boxShadow: open ? "-12px 0 48px rgba(0,150,199,0.15)" : "none",
        }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4" style={{ background: T.dark, borderBottom: `1px solid rgba(0,150,199,0.25)` }}>
          <div className="flex items-center gap-2">
            <Palette size={15} color={T.primary} />
            <span className="text-sm font-bold" style={{ fontFamily: H, color: T.white }}>Design System</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:bg-white/10">
            <X size={16} color="white" />
          </button>
        </div>

        <div className="p-5 space-y-8">
          {/* Colors */}
          <section>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ fontFamily: H, color: T.muted }}>Paleta de Cores</p>
            <div className="space-y-3">
              {swatch(T.primary,  "Azul Capitão Planeta", "#0096C7 — Primary")}
              {swatch(T.primaryD, "Azul Oceano Profundo",  "#0077B6 — Primary Dark")}
              {swatch(T.dark,     "Azul Noite / Títulos",  "#03045E — Foreground")}
              {swatch(T.green,    "Verde Ecológico",       "#00AB39 — Accent")}
              {swatch(T.bg,       "Azul Celeste / Fundo",  "#F0F9FF — Background")}
              {swatch(T.white,    "Branco / Cards",        "#FFFFFF — Card")}
            </div>
            <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${T.border}` }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ fontFamily: H, color: T.muted }}>Anéis Elementais</p>
              <div className="space-y-3">
                {swatch(T.earth, "Terra — Verde Folha",      "#2E7D32")}
                {swatch(T.fire,  "Fogo — Vermelho Flamejante","#E63946")}
                {swatch(T.wind,  "Vento — Ciano Brilhante",  "#00B4D8")}
                {swatch(T.water, "Água — Azul Oceano",       "#0077B6")}
                {swatch(T.heart, "Coração — Terracota",      "#D62828")}
              </div>
            </div>
          </section>

          {/* Typography */}
          <section>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ fontFamily: H, color: T.muted }}>Tipografia</p>
            <div className="rounded-xl p-4 space-y-4" style={{ background: T.bg }}>
              <div>
                <p className="text-[9px] uppercase tracking-widest mb-1" style={{ fontFamily: B, color: T.muted }}>Display — Montserrat 900</p>
                <p className="text-xl font-black leading-tight" style={{ fontFamily: H, color: T.dark }}>O Poder é de Vocês!</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest mb-1" style={{ fontFamily: B, color: T.muted }}>Heading — Montserrat 700</p>
                <p className="text-base font-bold" style={{ fontFamily: H, color: T.primary }}>Escolha seu Anel Mágico</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest mb-1" style={{ fontFamily: B, color: T.muted }}>Body — Inter 400</p>
                <p className="text-sm leading-relaxed" style={{ fontFamily: B, color: T.muted }}>Cada ação conta para o futuro do planeta e das próximas gerações.</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest mb-1" style={{ fontFamily: B, color: T.muted }}>Label — Inter 600 · 12px</p>
                <p className="text-xs font-semibold" style={{ fontFamily: B, color: T.green }}>✓ 100.740 Protetores Ativos</p>
              </div>
            </div>
          </section>

          {/* Buttons */}
          <section>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ fontFamily: H, color: T.muted }}>Componentes — Botões</p>
            <div className="space-y-3">
              {[
                { label: "Primary — CTA", bg: T.primary, color: T.white },
                { label: "Primary Dark", bg: T.primaryD, color: T.white },
                { label: "Ecological — Accent", bg: T.green, color: T.white },
                { label: "Secondary / Dark", bg: T.dark, color: T.white },
              ].map(({ label, bg, color }) => (
                <div key={label}>
                  <p className="text-[9px] uppercase tracking-widest mb-1.5" style={{ fontFamily: B, color: T.muted }}>{label}</p>
                  <button
                    className="w-full py-3 rounded-xl text-sm font-bold transition-opacity hover:opacity-85"
                    style={{ background: bg, color, fontFamily: H, cursor: "pointer" }}
                  >
                    Tornar-se Protetor
                  </button>
                </div>
              ))}
              <div>
                <p className="text-[9px] uppercase tracking-widest mb-1.5" style={{ fontFamily: B, color: T.muted }}>Outline / Ghost</p>
                <button
                  className="w-full py-3 rounded-xl text-sm font-bold transition-all border-2 hover:bg-blue-50"
                  style={{ background: "transparent", color: T.primary, borderColor: T.primary, fontFamily: H, cursor: "pointer" }}
                >
                  Saiba Mais
                </button>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest mb-1.5" style={{ fontFamily: B, color: T.muted }}>Ring Buttons</p>
                <div className="grid grid-cols-5 gap-1.5">
                  {RINGS.map((r) => (
                    <button key={r.id} className="py-2 rounded-lg text-[10px] font-bold transition-opacity hover:opacity-80" style={{ background: r.color, color: T.white, fontFamily: H, cursor: "pointer" }}>
                      {r.emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Spacing */}
          <section>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ fontFamily: H, color: T.muted }}>Espaçamento</p>
            <div className="space-y-2">
              {[[4,"XS"],[8,"SM"],[16,"MD"],[24,"LG"],[40,"XL"],[64,"2XL"]].map(([px, label]) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="w-6 text-[10px] text-right" style={{ fontFamily: B, color: T.muted }}>{label}</span>
                  <div className="h-2.5 rounded-sm" style={{ width: `${px}px`, background: `${T.primary}55` }} />
                  <span className="text-[10px]" style={{ fontFamily: B, color: T.muted }}>{px}px</span>
                </div>
              ))}
            </div>
          </section>

          {/* Radius */}
          <section>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ fontFamily: H, color: T.muted }}>Raios de Borda</p>
            <div className="flex gap-3 flex-wrap">
              {[["4px","XS"],["8px","SM"],["12px","MD"],["16px","LG"],["9999px","Full"]].map(([r, l]) => (
                <div key={r} className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 border-2" style={{ borderRadius: r, borderColor: T.primary, background: `${T.primary}10` }} />
                  <p className="text-[9px]" style={{ fontFamily: B, color: T.muted }}>{l}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Shadows */}
          <section>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ fontFamily: H, color: T.muted }}>Elevação / Sombras</p>
            <div className="space-y-3">
              {[
                ["Nível 1 — Cards",   "0 2px 8px rgba(0,150,199,0.08)"],
                ["Nível 2 — Modais",  "0 8px 32px rgba(0,150,199,0.15)"],
                ["Nível 3 — Overlay", "0 20px 64px rgba(3,4,94,0.2)"],
              ].map(([label, shadow]) => (
                <div key={label as string} className="p-3 rounded-xl" style={{ background: T.white, boxShadow: shadow as string }}>
                  <p className="text-xs font-medium" style={{ fontFamily: B, color: T.muted }}>{label as string}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </aside>
    </>
  );
}

// ─── Ring Card ────────────────────────────────────────────────────────────────
function RingCard({
  ring,
  selected,
  onSelect,
}: {
  key?: string;
  ring: typeof RINGS[0];
  selected: boolean;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const Icon = ring.icon;
  const active = selected || hovered;

  // Busca o campo bg ou lightBg do objeto ring sem estourar erro
  const bgAccent = (ring as any).bg || (ring as any).lightBg || `${ring.color}15`;

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-2xl p-6 cursor-pointer transition-all duration-300 relative overflow-hidden"
      style={{
        background: selected ? ring.color : C.white,
        border: `2px solid ${active ? ring.color : C.border}`,
        transform: selected ? "translateY(-10px) scale(1.02)" : hovered ? "translateY(-5px)" : "none",
        boxShadow: selected
          ? `0 24px 48px ${ring.color}45`
          : hovered
          ? `0 12px 32px ${ring.color}25`
          : "0 4px 16px rgba(0,150,199,0.06)",
      }}
    >
      {/* Ambient glow */}
      {!selected && (
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(ellipse at top, ${ring.color}08 0%, transparent 60%)`,
          }}
        />
      )}

      {/* Emoji top-right */}
      <span className="absolute top-4 right-4 text-2xl select-none">{ring.emoji}</span>

      {/* Icon */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
        style={{
          background: selected ? "rgba(255,255,255,0.2)" : bgAccent,
          border: selected ? "1.5px solid rgba(255,255,255,0.35)" : "none",
        }}
      >
        <Icon size={28} style={{ color: selected ? "#fff" : ring.color }} />
      </div>

      <h3 className="text-xl font-black mb-1" style={{ fontFamily: H, color: selected ? "#fff" : ring.color }}>
        {ring.name}
      </h3>
      <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ fontFamily: H, color: selected ? "rgba(255,255,255,0.7)" : C.muted }}>
        {ring.mission}
      </p>
      <p className="text-sm leading-relaxed mb-4" style={{ color: selected ? "rgba(255,255,255,0.85)" : C.muted }}>
        {ring.desc}
      </p>

      {/* Powers */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {ring.powers.map((p) => (
          <span
            key={p}
            className="px-2.5 py-1 rounded-full text-[10px] font-bold"
            style={{
              fontFamily: H,
              background: selected ? "rgba(255,255,255,0.2)" : `${ring.color}15`,
              color: selected ? "#fff" : ring.color,
            }}
          >
            {p}
          </span>
        ))}
      </div>

      <p className="text-xs" style={{ fontFamily: B, color: selected ? "rgba(255,255,255,0.6)" : C.muted }}>
        {ring.count}
      </p>

      {selected && (
        <div className="mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.2)" }}>
          <CheckCircle size={14} color="white" />
          <span className="text-xs font-bold text-white" style={{ fontFamily: H }}>
            Anel Escolhido!
          </span>
        </div>
      )}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [navOpen,        setNavOpen]        = useState(false);
  const [sgOpen,         setSgOpen]         = useState(false);
  const [selectedRing,   setSelectedRing]   = useState<string | null>(null);
  const [statsVisible,   setStatsVisible]   = useState(false);
  const [formRing,       setFormRing]       = useState("");
  const [formCommit,     setFormCommit]     = useState("");
  const [formName,       setFormName]       = useState("");
  const [formEmail,      setFormEmail]      = useState("");
  const [submitted,      setSubmitted]      = useState(false);
  const [heroRing,       setHeroRing]       = useState<string | null>(null);
  const statsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsVisible(true); },
      { threshold: 0.25 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const activeRing = RINGS.find((r) => r.id === (selectedRing || formRing));

  const fieldStyle = (focused: boolean): React.CSSProperties => ({
    width: "100%", padding: "14px 16px", borderRadius: 12, outline: "none",
    border: `2px solid ${focused ? T.primary : T.border}`,
    background: T.bg, fontFamily: B, fontSize: 14, color: T.dark,
    transition: "border-color 0.2s",
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const focus = (id: string) => () => setFocusedField(id);
  const blur  = ()            => setFocusedField(null);

  return (
    <div style={{ fontFamily: B, background: T.bg, color: T.dark, overflowX: "hidden" }}>

      {/* ── Style Guide toggle tab ── */}
      <button
        onClick={() => setSgOpen(!sgOpen)}
        className="fixed z-40 flex flex-col items-center gap-2 py-4 px-3 rounded-l-xl shadow-xl transition-all duration-300 hover:px-4"
        style={{
          right: sgOpen ? 312 : 0,
          top: "50%",
          transform: "translateY(-50%)",
          background: T.dark,
          color: T.white,
          fontFamily: H,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.1em",
          transition: "right 0.3s cubic-bezier(.4,0,.2,1)",
        }}
        aria-label="Guia de Estilo"
      >
        <Palette size={15} />
        {["G","U","I","A"].map((c, i) => <span key={i}>{c}</span>)}
      </button>

      <StyleGuide open={sgOpen} onClose={() => setSgOpen(false)} />

      {/* ══════════════════════════════
          HEADER
      ══════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-30 transition-shadow" style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${T.border}`,
      }}>
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="relative w-9 h-9 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${T.primary} 0%, ${T.primaryD} 100%)` }}>
                <Globe size={18} color="white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center" style={{ background: T.green }}>
                <Leaf size={8} color="white" />
              </div>
            </div>
            <div>
              <p className="text-sm font-black leading-none" style={{ fontFamily: H, color: T.dark }}>Protetores</p>
              <p className="text-[10px] font-semibold" style={{ fontFamily: H, color: T.primary }}>da Terra</p>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {[["Causas","#causas"],["Anéis","#aneis"],["Sobre","#impacto"],["Projetos","#projetos"]].map(([label, href]) => (
              <a key={label} href={href}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                style={{ fontFamily: H, color: T.muted }}
                onMouseEnter={(e) => { e.currentTarget.style.color = T.primary; e.currentTarget.style.background = `${T.primary}0F`; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = T.muted; e.currentTarget.style.background = "transparent"; }}
              >{label}</a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href="#afiliacao" className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105 hover:shadow-lg flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${T.primary} 0%, ${T.primaryD} 100%)`, color: T.white, fontFamily: H, boxShadow: `0 4px 16px ${T.primary}40` }}
            >
              <Shield size={14} /> Tornar-se Protetor
            </a>
            <button onClick={() => setNavOpen(!navOpen)} className="md:hidden p-2 rounded-lg" style={{ color: T.dark }}>
              {navOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {navOpen && (
          <div className="md:hidden border-t px-5 py-4 space-y-1" style={{ background: T.white, borderColor: T.border }}>
            {[["Causas","#causas"],["Anéis","#aneis"],["Sobre","#impacto"],["Projetos","#projetos"]].map(([label, href]) => (
              <a key={label} href={href} onClick={() => setNavOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-semibold"
                style={{ fontFamily: H, color: T.muted }}
              >{label}</a>
            ))}
            <a href="#afiliacao" onClick={() => setNavOpen(false)}
              className="flex items-center justify-center gap-2 mt-2 px-4 py-3 rounded-full text-sm font-bold"
              style={{ background: T.primary, color: T.white, fontFamily: H }}
            ><Shield size={14} /> Tornar-se Protetor</a>
          </div>
        )}
      </header>

      {/* ══════════════════════════════
          HERO
      ══════════════════════════════ */}
      <section id="causas" className="relative min-h-screen flex items-center pt-16 overflow-hidden" style={{ background: `linear-gradient(160deg, ${T.bgHero} 0%, ${T.bg} 55%, #EFF6FF 100%)` }}>

        {/* Decorative orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute rounded-full" style={{ width: 600, height: 600, top: -200, right: -200, background: `radial-gradient(circle, ${T.primary}12 0%, transparent 65%)` }} />
          <div className="absolute rounded-full" style={{ width: 400, height: 400, bottom: -100, left: -100, background: `radial-gradient(circle, ${T.primaryD}10 0%, transparent 65%)` }} />
          <div className="absolute rounded-full" style={{ width: 300, height: 300, top: "40%", left: "30%", background: `radial-gradient(circle, ${T.green}08 0%, transparent 65%)` }} />
        </div>

        {/* Floating ring emojis */}
        {RINGS.map((r, i) => (
          <div key={r.id}
            className="absolute hidden lg:flex items-center justify-center rounded-full select-none"
            style={{
              width: 52, height: 52,
              background: `${r.color}18`,
              border: `2px solid ${r.color}30`,
              top: `${[18, 28, 60, 72, 42][i]}%`,
              left: `${[8, 5, 6, 10, 4][i]}%`,
              fontSize: 22,
              animation: `float ${3 + i * 0.7}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
            title={r.name}
          >{r.emoji}</div>
        ))}

        <div className="relative max-w-6xl mx-auto px-5 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-6" style={{ background: `${T.green}15`, color: T.green, border: `1px solid ${T.green}35`, fontFamily: H }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: T.green }} />
              Movimento Global · 100.740 Protetores Ativos
            </div>

            <h1 style={{ fontFamily: H, color: T.dark, fontSize: "clamp(2.6rem, 6vw, 4.5rem)", lineHeight: 1.05, fontWeight: 900 }}>
              O Poder é<br />
              <span style={{ color: T.primary }}>de Vocês!</span>
            </h1>

            <p className="mt-5 mb-8 text-lg leading-relaxed max-w-lg" style={{ color: T.muted }}>
              Juntos, os 5 Anéis Mágicos têm força para transformar o planeta. Terra, Fogo, Vento, Água e Coração — cada um de nós carrega um poder. <strong style={{ color: T.dark }}>Qual é o seu?</strong>
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <a href="#aneis" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base transition-all hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${T.primary} 0%, ${T.primaryD} 100%)`, color: T.white, fontFamily: H, boxShadow: `0 8px 32px ${T.primary}45` }}
              >
                Escolher meu Anel <ArrowRight size={18} />
              </a>
              <a href="#impacto" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base border-2 transition-all hover:bg-blue-50"
                style={{ color: T.primary, borderColor: T.primary, fontFamily: H }}
              >
                Ver Impacto
              </a>
            </div>

            {/* Ring selector preview */}
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-xs font-semibold" style={{ fontFamily: H, color: T.muted }}>5 Elementos:</p>
              {RINGS.map((r) => (
                <button key={r.id}
                  onClick={() => setHeroRing(r.id === heroRing ? null : r.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                  style={{
                    background: heroRing === r.id ? r.color : `${r.color}18`,
                    color: heroRing === r.id ? T.white : r.color,
                    border: `1.5px solid ${heroRing === r.id ? r.color : `${r.color}40`}`,
                    fontFamily: H,
                    transform: heroRing === r.id ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  {r.emoji} {r.name}
                </button>
              ))}
            </div>
          </div>

          {/* Right — card */}
          <div className="rounded-3xl p-8" style={{ background: T.white, boxShadow: `0 24px 64px rgba(0,150,199,0.15)`, border: `1.5px solid ${T.border}` }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ fontFamily: H, color: T.primary }}>Cadastro Rápido</p>
            <h2 className="text-2xl font-black mb-1" style={{ fontFamily: H, color: T.dark }}>Comece Agora</h2>
            <p className="text-sm mb-6" style={{ color: T.muted }}>Em 60 segundos você recebe seu Anel de Protetor.</p>

            <div className="space-y-3">
              <input type="text" placeholder="Seu nome completo"
                style={fieldStyle(focusedField === "hname")}
                onFocus={focus("hname")} onBlur={blur}
              />
              <input type="email" placeholder="Seu melhor e-mail"
                style={fieldStyle(focusedField === "hemail")}
                onFocus={focus("hemail")} onBlur={blur}
              />
              {/* Ring picker */}
              <div className="grid grid-cols-5 gap-2">
                {RINGS.map((r) => (
                  <button key={r.id}
                    onClick={() => setHeroRing(r.id === heroRing ? null : r.id)}
                    className="flex flex-col items-center gap-1 py-3 rounded-xl text-[10px] font-bold transition-all"
                    style={{
                      background: heroRing === r.id ? r.color : r.bg,
                      color: heroRing === r.id ? T.white : r.color,
                      border: `2px solid ${heroRing === r.id ? r.color : "transparent"}`,
                      fontFamily: H,
                      transform: heroRing === r.id ? "scale(1.05)" : "scale(1)",
                    }}
                  >
                    <span className="text-lg">{r.emoji}</span>
                    {r.name}
                  </button>
                ))}
              </div>
              {heroRing && (
                <p className="text-xs text-center font-semibold" style={{ color: RINGS.find(r=>r.id===heroRing)?.color, fontFamily: H }}>
                  Anel de {RINGS.find(r=>r.id===heroRing)?.name} selecionado ✓
                </p>
              )}
              <a href="#afiliacao"
                className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02]"
                style={{ background: `linear-gradient(135deg, ${T.primary} 0%, ${T.primaryD} 100%)`, color: T.white, fontFamily: H, boxShadow: `0 8px 24px ${T.primary}40` }}
              >
                <Shield size={16} /> Receber meu Anel de Protetor <ChevronRight size={16} />
              </a>
            </div>
            <p className="text-center text-xs mt-4" style={{ color: T.muted, fontFamily: B }}>Sem spam · Cancelamento a qualquer momento</p>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <p className="text-xs font-medium" style={{ color: T.muted, fontFamily: H }}>Descubra os Anéis</p>
          <div className="w-6 h-10 rounded-full border-2 flex items-start justify-center p-1.5" style={{ borderColor: `${T.primary}40` }}>
            <div className="w-1.5 h-2.5 rounded-full animate-bounce" style={{ background: T.primary }} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          RINGS
      ══════════════════════════════ */}
      <section id="aneis" className="py-24 px-5" style={{ background: T.bg }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-4" style={{ background: `${T.primary}10`, color: T.primary, fontFamily: H }}>
              <Zap size={12} /> Os 5 Elementos
            </div>
            <h2 className="font-black mb-4" style={{ fontFamily: H, color: T.dark, fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.1 }}>
              Escolha seu Anel Mágico
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: T.muted }}>
              Cada anel carrega uma força da natureza. Descubra qual ressoa com sua missão e junte-se aos protetores desse elemento.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {RINGS.map((ring) => (
              <RingCard
                key={ring.id}
                ring={ring}
                selected={selectedRing === ring.id}
                onSelect={() => setSelectedRing(ring.id === selectedRing ? null : ring.id)}
              />
            ))}
          </div>

          {/* Selection banner */}
          {selectedRing && activeRing && (
            <div className="mt-8 p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left" style={{ background: activeRing.bg, border: `2px solid ${activeRing.color}35` }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ background: activeRing.color }}>
                {activeRing.emoji}
              </div>
              <div className="flex-1">
                <p className="text-xl font-black mb-1" style={{ fontFamily: H, color: activeRing.color }}>Anel de {activeRing.name} — Selecionado!</p>
                <p className="text-sm" style={{ color: T.muted }}>Complete sua afiliação e torne-se oficialmente um Protetor do Anel de {activeRing.name}.</p>
              </div>
              <a href="#afiliacao"
                className="flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm transition-all hover:scale-105 flex-shrink-0"
                style={{ background: activeRing.color, color: T.white, fontFamily: H }}
              >
                Continuar <ArrowRight size={15} />
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════
          STATS
      ══════════════════════════════ */}
      <section id="impacto" ref={statsRef} className="py-24 px-5" style={{ background: `linear-gradient(180deg, ${T.bg} 0%, ${T.bgHero} 100%)` }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-4" style={{ background: `${T.green}15`, color: T.green, fontFamily: H }}>
              <Star size={12} /> Impacto Real
            </div>
            <h2 className="font-black mb-4" style={{ fontFamily: H, color: T.dark, fontSize: "clamp(2rem, 4vw, 2.8rem)" }}>Números que Falam por Si</h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: T.muted }}>Cada protetor faz diferença. Veja o que já conquistamos juntos desde 2020.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
            <Stat icon={TreePine}  value={2400000} unit="" label="Árvores Plantadas"          color={T.earth}  active={statsVisible} />
            <Stat icon={Recycle}   value={12800}   unit="T" label="Lixo Reciclado"            color={T.wind}   active={statsVisible} />
            <Stat icon={Users}     value={100740}  unit="" label="Protetores Ativos"          color={T.primary} active={statsVisible} />
            <Stat icon={Globe}     value={156}     unit="" label="Projetos no Mundo"          color={T.water}  active={statsVisible} />
          </div>

          {/* Progress section */}
          <div className="rounded-3xl p-8" style={{ background: T.white, border: `1.5px solid ${T.border}`, boxShadow: `0 8px 40px rgba(0,150,199,0.08)` }}>
            <p className="text-sm font-bold uppercase tracking-widest mb-6" style={{ fontFamily: H, color: T.muted }}>Metas de 2025 — Progresso</p>
            <div className="space-y-6">
              {[
                { label: "Árvores plantadas em biomas ameaçados", pct: 68, color: T.earth },
                { label: "Praias limpas pelos Protetores da Água", pct: 83, color: T.water },
                { label: "Comunidades com energia solar instalada", pct: 45, color: T.primary },
                { label: "Escolas com programa de educação ambiental", pct: 57, color: T.green },
              ].map(({ label, pct, color }) => (
                <div key={label}>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium" style={{ fontFamily: B, color: T.dark }}>{label}</p>
                    <span className="text-sm font-bold" style={{ fontFamily: H, color }}>{pct}%</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: T.mutedBg }}>
                    <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{
                      width: statsVisible ? `${pct}%` : "0%",
                      background: `linear-gradient(90deg, ${color} 0%, ${color}BB 100%)`,
                      boxShadow: `0 0 6px ${color}60`,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          AFFILIATION FORM
      ══════════════════════════════ */}
      <section id="afiliacao" className="py-24 px-5" style={{ background: T.dark }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-4" style={{ background: `${T.primary}30`, color: T.primary, fontFamily: H, border: `1px solid ${T.primary}40` }}>
              <Shield size={12} /> Afiliação Oficial
            </div>
            <h2 className="font-black mb-4" style={{ fontFamily: H, color: T.white, fontSize: "clamp(2rem, 4vw, 2.8rem)" }}>
              Receba seu Anel de Protetor
            </h2>
            <p className="text-lg" style={{ color: "rgba(255,255,255,0.65)" }}>
              Em menos de 24h você recebe seu anel digital, sua missão inaugural e acesso à comunidade de protetores.
            </p>
          </div>

          {submitted ? (
            <div className="rounded-3xl p-14 text-center" style={{ background: `linear-gradient(135deg, ${T.primaryD} 0%, ${T.dark} 100%)`, border: `2px solid ${T.primary}40` }}>
              <div className="text-6xl mb-6">{RINGS.find(r=>r.id===formRing)?.emoji || "🌍"}</div>
              <h3 className="text-3xl font-black mb-3" style={{ fontFamily: H, color: T.white }}>Bem-vindo, Protetor!</h3>
              <p className="text-lg mb-2" style={{ color: "rgba(255,255,255,0.8)" }}>
                {formName || "Você"} é agora um Protetor{formRing ? ` do Anel de ${RINGS.find(r=>r.id===formRing)?.name}` : " da Terra"}!
              </p>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>Confirme sua inscrição no e-mail {formEmail || "cadastrado"}.</p>
              <div className="flex justify-center mt-6 gap-3">
                {RINGS.map(r => (
                  <div key={r.id} className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ background: r.color, opacity: formRing === r.id ? 1 : 0.3 }}>{r.emoji}</div>
                ))}
              </div>
              <button onClick={() => setSubmitted(false)} className="mt-8 px-8 py-3 rounded-full text-sm font-bold" style={{ background: T.primary, color: T.white, fontFamily: H, cursor: "pointer" }}>
                Cadastrar outro protetor
              </button>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
              className="rounded-3xl p-8 sm:p-10" style={{ background: T.white, boxShadow: `0 24px 64px rgba(0,0,0,0.3)` }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ fontFamily: H, color: T.dark }}>Nome Completo *</label>
                  <input type="text" required placeholder="Ana Maria Silva"
                    value={formName} onChange={e => setFormName(e.target.value)}
                    style={fieldStyle(focusedField === "fname")}
                    onFocus={focus("fname")} onBlur={blur}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ fontFamily: H, color: T.dark }}>E-mail *</label>
                  <input type="email" required placeholder="ana@email.com"
                    value={formEmail} onChange={e => setFormEmail(e.target.value)}
                    style={fieldStyle(focusedField === "femail")}
                    onFocus={focus("femail")} onBlur={blur}
                  />
                </div>
              </div>

              {/* Ring */}
              <div className="mb-5">
                <label className="block text-sm font-bold mb-3" style={{ fontFamily: H, color: T.dark }}>Escolha do Anel *</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {RINGS.map((r) => {
                    const chosen = formRing === r.id;
                    const Icon = r.icon;
                    return (
                      <button key={r.id} type="button" onClick={() => setFormRing(r.id)}
                        className="flex flex-col items-center gap-2 py-4 px-2 rounded-2xl transition-all duration-200"
                        style={{
                          background: chosen ? r.color : r.bg,
                          border: `2px solid ${chosen ? r.color : "transparent"}`,
                          transform: chosen ? "scale(1.05)" : "scale(1)",
                          boxShadow: chosen ? `0 8px 24px ${r.color}40` : "none",
                          cursor: "pointer",
                        }}
                      >
                        <span className="text-2xl">{r.emoji}</span>
                        <span className="text-xs font-bold" style={{ fontFamily: H, color: chosen ? T.white : r.color }}>{r.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Commitment */}
              <div className="mb-6">
                <label className="block text-sm font-bold mb-2" style={{ fontFamily: H, color: T.dark }}>Compromisso Ambiental *</label>
                <select required value={formCommit} onChange={e => setFormCommit(e.target.value)}
                  className="appearance-none"
                  style={{ ...fieldStyle(focusedField === "fcommit"), color: formCommit ? T.dark : T.muted }}
                  onFocus={focus("fcommit")} onBlur={blur}
                >
                  <option value="" disabled>Selecione seu compromisso principal</option>
                  <option value="plantar">🌱 Plantar ao menos 10 árvores este ano</option>
                  <option value="reciclar">♻️ Reciclar 100% do lixo doméstico</option>
                  <option value="mobilizar">📣 Mobilizar 5 pessoas para a causa</option>
                  <option value="plastico">🛍️ Eliminar o plástico descartável do dia a dia</option>
                  <option value="energia">⚡ Migrar para energia renovável</option>
                  <option value="praia">🏖️ Participar de 3 mutirões de limpeza de praia</option>
                </select>
              </div>

              <button type="submit"
                className="w-full py-5 rounded-2xl text-base font-black flex items-center justify-center gap-3 transition-all hover:scale-[1.015]"
                style={{ background: `linear-gradient(135deg, ${T.primary} 0%, ${T.primaryD} 100%)`, color: T.white, fontFamily: H, boxShadow: `0 12px 40px ${T.primary}50`, cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = `0 16px 48px ${T.primary}65`}
                onMouseLeave={e => e.currentTarget.style.boxShadow = `0 12px 40px ${T.primary}50`}
              >
                <Shield size={20} /> Receber meu Anel de Protetor <ArrowRight size={20} />
              </button>

              <p className="text-center text-xs mt-4" style={{ color: T.muted, fontFamily: B }}>
                +100.740 protetores já se juntaram. Faça parte deste movimento.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ══════════════════════════════
          PROJECTS
      ══════════════════════════════ */}
      <section id="projetos" className="py-24 px-5" style={{ background: T.bg }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-4" style={{ background: `${T.primary}10`, color: T.primary, fontFamily: H }}>
              <Globe size={12} /> Em Campo Agora
            </div>
            <h2 className="font-black mb-4" style={{ fontFamily: H, color: T.dark, fontSize: "clamp(2rem, 4vw, 2.8rem)" }}>
              Projetos em Andamento
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format",
                alt: "Voluntários reflorestando área desmatada",
                ring: RINGS[0],
                title: "Sementes do Cerrado",
                desc: "500 hectares em reflorestamento no bioma Cerrado com espécies nativas. 2.400 voluntários em campo.",
                date: "Mar 2024",
              },
              {
                img: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&h=400&fit=crop&auto=format",
                alt: "Limpeza de praia com voluntários",
                ring: RINGS[3],
                title: "Oceano Vivo",
                desc: "Limpeza de 80 praias brasileiras e monitoramento de recifes de coral com tecnologia de drones.",
                date: "Jan 2024",
              },
              {
                img: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=600&h=400&fit=crop&auto=format",
                alt: "Painéis solares em comunidade rural",
                ring: RINGS[1],
                title: "Sol Para Todos",
                desc: "Energia solar instalada em 340 comunidades rurais sem acesso à eletricidade limpa no Nordeste.",
                date: "Jun 2024",
              },
            ].map((p) => (
              <article key={p.title} className="rounded-2xl overflow-hidden group" style={{ background: T.white, border: `1.5px solid ${T.border}`, boxShadow: "0 4px 20px rgba(0,150,199,0.06)" }}>
                <div className="relative h-48 overflow-hidden" style={{ background: T.mutedBg }}>
                  <img src={p.img} alt={p.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: p.ring.color, color: T.white, fontFamily: H }}>
                    {p.ring.emoji} Anel de {p.ring.name}
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xs font-medium mb-2" style={{ color: T.muted, fontFamily: B }}>Início: {p.date}</p>
                  <h3 className="text-xl font-black mb-2" style={{ fontFamily: H, color: T.dark }}>{p.title}</h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: T.muted }}>{p.desc}</p>
                  <a href="#" className="inline-flex items-center gap-1.5 text-sm font-bold transition-all" style={{ color: p.ring.color, fontFamily: H }}
                    onMouseEnter={e => e.currentTarget.style.gap = "8px"}
                    onMouseLeave={e => e.currentTarget.style.gap = "6px"}
                  >
                    Ver Projeto <ChevronRight size={15} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          FOOTER
      ══════════════════════════════ */}
      <footer style={{ background: T.darkMid, borderTop: `2px solid ${T.primary}25` }}>
        <div className="max-w-6xl mx-auto px-5 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="relative w-9 h-9">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${T.primary} 0%, ${T.primaryD} 100%)` }}>
                    <Globe size={18} color="white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center" style={{ background: T.green }}>
                    <Leaf size={8} color="white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-black" style={{ fontFamily: H, color: T.white }}>Protetores da Terra</p>
                  <p className="text-[10px] font-semibold" style={{ fontFamily: H, color: T.primary }}>Movimento Global</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.5)", fontFamily: B }}>
                Unidos pelos 5 Anéis Elementais, protegemos o planeta para as próximas gerações.
              </p>
              <div className="flex gap-3">
                {[SocialGlobe, Share2, Video, SocialGlobe].map((Icon, i) => (
                  <a key={i} href="#" className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{ background: "rgba(255,255,255,0.07)" }}
                    onMouseEnter={e => (e.currentTarget.style.background = T.primary)}
                    onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
                  >
                    <Icon size={15} color="white" />
                  </a>
                ))}
              </div>
            </div>

            {[
              { title: "Movimento", links: ["Sobre Nós","Os 5 Anéis","Manifesto","Parceiros","Imprensa"] },
              { title: "Projetos",  links: ["Sementes do Cerrado","Oceano Vivo","Sol Para Todos","Ar Puro","Ver Todos"] },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ fontFamily: H, color: T.primary }}>{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-sm transition-colors" style={{ color: "rgba(255,255,255,0.5)", fontFamily: B }}
                        onMouseEnter={e => (e.currentTarget.style.color = T.primary)}
                        onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                      >{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ fontFamily: H, color: T.primary }}>Contato</p>
              <div className="space-y-3">
                {[
                  { Icon: MapPin, text: "São Paulo, SP · Brasil" },
                  { Icon: Mail,   text: "contato@protetoresdaterra.org" },
                  { Icon: Phone,  text: "+55 (11) 9 9876-5432" },
                ].map(({ Icon, text }) => (
                  <div key={text} className="flex items-start gap-2.5">
                    <Icon size={14} style={{ color: T.primary, flexShrink: 0, marginTop: 2 }} />
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)", fontFamily: B }}>{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)", fontFamily: B }}>
              © 2025 Protetores da Terra. Todos os direitos reservados. Feito com 💙 pelo planeta.
            </p>
            <div className="flex gap-5">
              {["Privacidade","Termos de Uso","Cookies"].map(l => (
                <a key={l} href="#" className="text-xs transition-colors" style={{ color: "rgba(255,255,255,0.3)", fontFamily: B }}
                  onMouseEnter={e => (e.currentTarget.style.color = T.primary)}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
                >{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-12px) rotate(5deg); }
        }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,150,199,0.35); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(0,150,199,0.6); }
        * { scrollbar-width: thin; scrollbar-color: rgba(0,150,199,0.35) transparent; }
      `}</style>
    </div>
  );
}
