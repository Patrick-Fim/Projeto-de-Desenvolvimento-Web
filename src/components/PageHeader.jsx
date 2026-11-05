// Cabeçalho padrão das páginas internas: selo, título, descrição e conteúdo extra.
export default function PageHeader({ eyebrow, title, description, children }) {
  return (
    <header className="relative isolate overflow-hidden border-b border-border">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-b from-primary/10 to-transparent" />
      <div aria-hidden="true" className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-ring-earth/10 blur-3xl" />

      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16 animate-fadeIn">
        {eyebrow && (
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-card/70 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary-text">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-4 max-w-3xl text-3xl font-black tracking-tight text-foreground md:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground-muted md:text-lg">
            {description}
          </p>
        )}
        {children}
      </div>
    </header>
  );
}
