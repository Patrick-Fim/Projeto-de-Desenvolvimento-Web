import Link from 'next/link';
import ScrollToTop from '../components/ScrollToTop';
import { RINGS } from '../lib/rings';
import {
  FaArrowRight,
  FaBullhorn,
  FaCircleCheck,
  FaEarthAmericas,
  FaHandshake,
  FaMagnifyingGlass,
  FaShieldHeart,
} from 'react-icons/fa6';

// Números de impacto (conteúdo ilustrativo).
const STATS = [
  { value: '100k+', label: 'Protetores ativos' },
  { value: '1.250', label: 'Missões concluídas' },
  { value: '890', label: 'Denúncias atendidas' },
  { value: '50+', label: 'Cidades atendidas' },
];

// Passo a passo de uso da plataforma.
const STEPS = [
  { Icon: FaBullhorn, title: 'Denuncie', desc: 'Registre uma ocorrência ambiental com local, anel elemental e detalhes do que foi observado.' },
  { Icon: FaMagnifyingGlass, title: 'Acompanhe', desc: 'A denúncia entra no Painel de Missões, onde pode ser buscada e filtrada pela comunidade.' },
  { Icon: FaHandshake, title: 'Engaje-se', desc: 'Escolha uma missão ativa e junte-se aos protetores que já atuam na sua região.' },
];

// Posição de cada anel ao redor do planeta, na ilustração do topo.
const ORBIT = [
  'left-1/2 top-0 -translate-x-1/2',
  'right-0 top-[30%]',
  'right-[10%] bottom-[2%]',
  'left-[10%] bottom-[2%]',
  'left-0 top-[30%]',
];

function SectionHeading({ eyebrow, title, desc }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-text">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground sm:text-4xl">{title}</h2>
      <p className="mt-3 text-foreground-muted">{desc}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <main>
      {/* Apresentação principal da plataforma e atalhos para as ações mais importantes. */}
      <section className="relative isolate overflow-hidden border-b border-border">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-24 -top-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -right-24 top-20 h-96 w-96 rounded-full bg-ring-earth/15 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--border)_1px,transparent_0)] bg-size-[28px_28px] opacity-60" />
        </div>

        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-16 md:py-24 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-7 text-center animate-fadeIn lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-accent-text">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              100.740 Protetores Ativos
            </span>

            <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              O Poder é de Vocês.{' '}
              <span className="bg-linear-to-r from-primary-dark via-primary to-ring-earth bg-clip-text text-transparent">
                Proteja a Terra.
              </span>
            </h1>

            <p className="mx-auto max-w-xl text-lg leading-relaxed text-foreground-muted lg:mx-0">
              Plataforma comunitária para catalogar missões ecológicas, denunciar crimes ambientais e mobilizar ações de preservação na sua região.
            </p>

            {/* Ações principais: consultar missões ou registrar uma denúncia. */}
            <div className="flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link
                href="/missoes"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary-dark px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-primary/25 transition hover:brightness-110 active:scale-[.98] dark:text-slate-950"
              >
                Explorar Painel de Missões
                <FaArrowRight aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/denuncia"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary-text/40 bg-card px-7 py-3.5 text-base font-bold text-primary-text transition hover:border-primary-text hover:bg-primary/5"
              >
                Registrar uma Denúncia
              </Link>
            </div>

            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-foreground-muted lg:justify-start">
              {['Gratuito e comunitário', 'Dados salvos no Firebase', 'Acessível (WCAG AA)'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <FaCircleCheck aria-hidden="true" className="text-accent-text" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Ilustração: o planeta cercado pelos cinco anéis. */}
          <div className="relative mx-auto aspect-square w-full max-w-[340px] sm:max-w-[420px]" aria-hidden="true">
            <div className="absolute inset-[6%] rounded-full border-2 border-dashed border-primary/25 animate-orbit" />
            <div className="absolute inset-[22%] flex items-center justify-center rounded-full bg-linear-to-br from-primary to-ring-water shadow-2xl shadow-primary/30 animate-float">
              <FaEarthAmericas className="text-7xl text-white/95 sm:text-8xl" />
            </div>
            {RINGS.map((ring, i) => {
              const Icon = ring.Icon;
              return (
                <div key={ring.id} className={`absolute flex flex-col items-center gap-1.5 ${ORBIT[i]}`}>
                  <span className={`flex h-14 w-14 items-center justify-center rounded-2xl text-xl text-white shadow-xl ring-4 ring-background sm:h-16 sm:w-16 sm:text-2xl ${ring.bg}`}>
                    <Icon />
                  </span>
                  <span className="rounded-full border border-border bg-card px-2.5 py-0.5 text-xs font-bold text-foreground shadow-sm">
                    {ring.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Números de impacto apresentados em quatro indicadores. */}
      <section className="border-b border-border bg-card" aria-label="Números de impacto">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-10 md:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse text-center md:border-l md:border-border md:pl-8 md:text-left md:first:border-l-0 md:first:pl-0">
              <dt className="mt-1 text-sm font-semibold text-foreground-muted">{stat.label}</dt>
              <dd className="font-display text-3xl font-black text-foreground sm:text-4xl">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Apresenta os anéis a partir dos dados centralizados em lib/rings. */}
      <section className="mx-auto max-w-6xl space-y-12 px-6 py-20">
        <SectionHeading
          eyebrow="Os cinco anéis"
          title="Escolha seu Anel Mágico"
          desc="Cada elemento guia uma frente estratégica de combate ambiental."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {RINGS.map((ring) => {
            const Icon = ring.Icon;
            return (
              <article
                key={ring.id}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
              >
                <span className={`absolute inset-x-0 top-0 h-1 ${ring.bg}`} aria-hidden="true" />
                <span className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl text-white shadow-md transition-transform group-hover:scale-110 dark:text-slate-950 ${ring.bg}`}>
                  <Icon aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-foreground">{ring.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{ring.desc}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Como funciona */}
      <section className="border-y border-border bg-card/60">
        <div className="mx-auto max-w-6xl space-y-12 px-6 py-20">
          <SectionHeading
            eyebrow="Como funciona"
            title="Da denúncia à ação em três passos"
            desc="Um fluxo simples para transformar o que você vê em mobilização da comunidade."
          />

          <ol className="grid gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => {
              const Icon = step.Icon;
              return (
                <li key={step.title} className="relative rounded-2xl border border-border bg-background p-7">
                  <span aria-hidden="true" className="absolute right-6 top-4 font-display text-5xl font-black text-primary/15">
                    0{i + 1}
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-xl text-primary-text">
                    <Icon aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{step.desc}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Chamada final */}
      <section className="mx-auto max-w-6xl px-6 pt-20">
        <div className="relative isolate overflow-hidden rounded-3xl bg-linear-to-br from-[#0077B6] via-[#023E8A] to-[#2E7D32] px-8 py-14 text-center shadow-2xl sm:px-16">
          <div aria-hidden="true" className="absolute -right-16 -top-16 -z-10 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div aria-hidden="true" className="absolute -bottom-20 -left-10 -z-10 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

          <FaShieldHeart aria-hidden="true" className="mx-auto text-4xl text-white/90" />
          <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">Viu algo errado na sua região?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/85">
            Registre uma denúncia em poucos minutos e transforme-a em uma missão da comunidade.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/denuncia"
              className="rounded-xl bg-white px-7 py-3.5 font-bold text-[#005F73] shadow-lg transition hover:bg-white/90"
            >
              Registrar Denúncia
            </Link>
            <Link
              href="/missoes"
              className="rounded-xl border-2 border-white/40 px-7 py-3.5 font-bold text-white transition hover:bg-white/10"
            >
              Ver Missões Ativas
            </Link>
          </div>
        </div>
      </section>

      {/* Atalho para retornar ao início da página após a rolagem. */}
      <ScrollToTop />
    </main>
  );
}
