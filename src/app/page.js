function ArrowIcon({ diagonal = false }) {
  return (
    <svg
      aria-hidden="true"
      className={diagonal ? "arrow-icon arrow-icon--diagonal" : "arrow-icon"}
      viewBox="0 0 20 20"
      fill="none"
    >
      {diagonal ? (
        <path d="M5 15 15 5M6 5h9v9" />
      ) : (
        <path d="M3.5 10h12m-5-5 5 5-5 5" />
      )}
    </svg>
  );
}

function Sparkle() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" fill="none">
      <path
        d="M24 2c2.8 12.1 8 17.3 22 22-14 4.7-19.2 9.9-22 22C21.2 33.9 16 28.7 2 24 16 19.3 21.2 14.1 24 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#inicio" aria-label="lori, início">
          lori<span>.</span>
        </a>
        <nav className="main-nav" aria-label="Navegação principal">
          <a href="#projetos">Projetos</a>
          <a href="#sobre">O que fazemos</a>
          <a href="#contato">Contato</a>
        </nav>
        <a className="header-cta" href="#contato">
          Vamos conversar <ArrowIcon diagonal />
        </a>
      </header>

      <section className="hero section-wrap" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> Estúdio digital independente</p>
          <h1>
            Ideias boas
            <br />
            merecem <span>forma.</span>
          </h1>
          <p className="hero-description">
            Criamos marcas e experiências digitais que aproximam pessoas de
            ideias extraordinárias.
          </p>
          <div className="hero-actions">
            <a className="button button--dark" href="#projetos">
              Explore nosso trabalho <ArrowIcon />
            </a>
            <a className="text-link" href="#sobre">Conheça o estúdio</a>
          </div>
        </div>

        <div className="hero-art" aria-label="Composição gráfica abstrata em verde e lilás">
          <div className="art-orbit art-orbit--one" />
          <div className="art-orbit art-orbit--two" />
          <div className="art-sun"><Sparkle /></div>
          <div className="art-label art-label--top">DESIGN COM INTENÇÃO</div>
          <div className="art-label art-label--bottom">FEITO PARA FICAR</div>
          <div className="art-card">
            <span className="art-card-mark">l.</span>
            <span className="art-card-rule" />
            <span className="art-card-caption">A próxima<br />boa ideia começa aqui.</span>
            <span className="art-card-link">↗</span>
          </div>
          <span className="art-index">01 — 04</span>
        </div>

        <div className="hero-foot">
          <span>Estratégia · Identidade · Digital</span>
          <a href="#projetos">Role para descobrir <span aria-hidden="true">↓</span></a>
        </div>
      </section>

      <section className="work-section section-wrap" id="projetos">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Um pouco do que fazemos</p>
            <h2>Trabalho com <span>intenção.</span></h2>
          </div>
          <a className="text-link" href="#contato">Tem um projeto em mente? <ArrowIcon diagonal /></a>
        </div>

        <div className="project-grid">
          <a className="project-card project-card--flora" href="#contato">
            <div className="project-art flora-art" aria-hidden="true">
              <div className="flora-topline"><span>flora</span><span>UMA NOVA FORMA DE CUIDAR</span></div>
              <div className="flora-copy">Seu tempo.<br /><em>Seu ritual.</em></div>
              <div className="flora-orb flora-orb--one" />
              <div className="flora-orb flora-orb--two" />
              <span className="flora-button">Descubra a flora <ArrowIcon /></span>
            </div>
            <div className="project-meta">
              <div><h3>flora</h3><p>Identidade · E-commerce</p></div>
              <span className="project-arrow"><ArrowIcon diagonal /></span>
            </div>
          </a>

          <a className="project-card project-card--norte" href="#contato">
            <div className="project-art norte-art" aria-hidden="true">
              <div className="norte-topline"><span>NORTE / 25</span><span>OUTRO JEITO DE CHEGAR</span></div>
              <div className="norte-sun" />
              <div className="norte-title">Vá além<br />do mapa<span>.</span></div>
              <div className="norte-landscape norte-landscape--back" />
              <div className="norte-landscape norte-landscape--front" />
              <span className="norte-coordinates">22°54&apos; S &nbsp; 43°10&apos; W</span>
            </div>
            <div className="project-meta">
              <div><h3>Norte</h3><p>Estratégia · Marca · Web</p></div>
              <span className="project-arrow"><ArrowIcon diagonal /></span>
            </div>
          </a>
        </div>
      </section>

      <section className="about-section" id="sobre">
        <div className="section-wrap about-inner">
          <div className="about-stamp"><Sparkle /><span>IDEIAS<br />EM MOVIMENTO</span></div>
          <div className="about-copy">
            <p className="eyebrow">Pequeno por escolha. Grande nas ideias.</p>
            <h2>Do primeiro rabisco ao último <span>detalhe.</span></h2>
            <p>
              Somos um estúdio independente que junta estratégia, design e
              tecnologia para transformar desafios em experiências claras,
              úteis e cheias de personalidade.
            </p>
            <a className="text-link" href="#contato">Mais sobre o nosso jeito <ArrowIcon diagonal /></a>
          </div>
          <div className="services-list">
            <div><span>01</span><p>Estratégia & direção</p><ArrowIcon diagonal /></div>
            <div><span>02</span><p>Identidade de marca</p><ArrowIcon diagonal /></div>
            <div><span>03</span><p>Design digital</p><ArrowIcon diagonal /></div>
            <div><span>04</span><p>Desenvolvimento web</p><ArrowIcon diagonal /></div>
          </div>
        </div>
      </section>

      <footer className="site-footer section-wrap" id="contato">
        <div className="footer-top">
          <p className="eyebrow"><span className="status-dot" /> Disponíveis para novos projetos</p>
          <h2>Vamos fazer<br />algo <span>incrível?</span></h2>
          <a className="button button--lime" href="mailto:oi@lori.studio">
            Conta pra gente <ArrowIcon diagonal />
          </a>
        </div>
        <div className="footer-bottom">
          <a className="wordmark wordmark--footer" href="#inicio">lori<span>.</span></a>
          <span>Design com propósito, feito com cuidado.</span>
          <span>© 2025 lori studio</span>
        </div>
      </footer>
    </main>
  );
}
