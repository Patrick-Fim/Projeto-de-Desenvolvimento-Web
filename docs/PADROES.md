# Padrões do projeto — Protetores da Terra

Guia de referência para quem for alterar a interface ou a API (pessoas ou IAs).
Siga estes padrões para manter o visual e o código consistentes.

Referências visuais ao vivo (fora do menu, acesse pela URL):

- `/estilo` — paleta, anéis, tipografia e botões.
- `/componentes` — `Button`, `MissionCard` e `Modal` em funcionamento.

---

## 1. Stack

- **Next.js 16 (App Router)** + **React 19**, em **JavaScript** (`.jsx`/`.js`).
- **Tailwind CSS v4** (configurado por CSS, sem `tailwind.config.js`).
- **Firebase**: Authentication (e-mail/senha) e Firestore (banco).
- **react-icons** (`react-icons/fa6`) para ícones — sempre ícones **preenchidos** (Font Awesome 6 solid).
- Imports com **caminho relativo** (`../../components/Button`). O atalho `@/` não está configurado.

## 2. Estrutura de pastas

```
src/
├── app/                  Páginas (cada pasta é uma rota) e API (app/api/...)
│   └── api/              Rotas HTTP: missoes, perfil, perfil/checkin, ranking, estatisticas
├── components/           Componentes reutilizáveis (Button, Modal, PageHeader, ...)
├── context/              AuthContext (usuário logado + perfil, para todas as telas)
├── lib/                  Dados e regras compartilhadas (rings, gamificacao, datas, firebase)
│   └── servidor/         Código usado só pela API (validação de token, perfis)
└── styles/               globals.css, theme.css (tokens) e fonts.css
```

## 3. Tokens de design (`src/styles/theme.css`)

**Regra de ouro:** todo visual sai daqui (tokens) e de `src/components/` (componentes). Ao criar algo
novo, primeiro crie o token ou o componente, depois use. Sempre atualize junto `/estilo`, `/componentes`
e este documento — assim, mudar em um lugar muda a ferramenta inteira.

**Nunca use cores fixas (hex) direto nos componentes.** Use as classes geradas pelos tokens.
Para criar uma cor nova: declare a variável em `:root` e em `.dark`, e exponha no `@theme inline`
como `--color-<nome>`. Isso gera `bg-<nome>`, `text-<nome>`, `border-<nome>` etc.

| Token | Uso | Classe |
|---|---|---|
| `--primary` / `--primary-dark` | Elementos e botões principais | `bg-primary`, `bg-primary-dark` |
| `--primary-text` | Texto azul sobre fundo claro (AA) | `text-primary-text` |
| `--foreground` / `--foreground-muted` | Texto principal / secundário | `text-foreground`, `text-foreground-muted` |
| `--accent` / `--accent-text` | Verde ecológico / texto verde (AA) | `bg-accent`, `text-accent-text` |
| `--background` / `--card` / `--border` | Fundo da página, cartões, bordas | `bg-background`, `bg-card`, `border-border` |
| `--danger-text` | Mensagens de erro (AA) | `text-danger-text` |
| `--ring-earth`, `-fire`, `-wind`, `-water`, `-heart` | Cores dos 5 anéis | `bg-ring-earth`, `text-ring-fire`... |
| `--bolha-propria` / `--bolha-propria-texto` | Bolha das minhas mensagens no chat | `bg-bolha-propria`, `text-bolha-propria-texto` |
| `--bolha-outra` / `--bolha-outra-texto` | Bolha das mensagens dos outros | `bg-bolha-outra`, `text-bolha-outra-texto` |
| `--scrollbar` / `--scrollbar-hover` | Barras de rolagem de toda a ferramenta (aplicadas em `globals.css`) | automático |

`color-scheme` também é definido nos tokens (`light` / `dark`) para que controles nativos do
navegador sigam o tema.

Opacidade: use o modificador do Tailwind (`bg-primary/10`, `border-accent/30`).

## 4. Tema claro/escuro

- O modo escuro é a classe `.dark` no `<html>`, alternada pelo `Navbar` e salva no `localStorage`.
- O variant `dark:` segue essa classe (`@custom-variant dark` em `globals.css`).
- Os tokens já mudam sozinhos no escuro. Use `dark:` só quando o contraste exigir.
- **Regra de contraste:** texto sobre fundo colorido (botões, selos de anel) usa
  `text-white dark:text-slate-950`, porque no escuro as cores de fundo ficam claras.

## 5. Tipografia

- **Montserrat** (`font-display`) para títulos — aplicada automaticamente em `h1`–`h4`.
- **Inter** para texto corrido (padrão do `body`).
- Títulos de página: `font-black tracking-tight`. Rótulos: `text-sm font-bold`.

## 6. Componentes reutilizáveis

| Componente | Para que serve | Props principais |
|---|---|---|
| `Button` | Todo botão de ação | `variant`: `primary`, `ecological`, `dark`, `outline`, `ghost`, `danger` · `size`: `sm`, `md`, `lg` · `ariaLabel` |
| `PageHeader` | Cabeçalho de toda página interna | `eyebrow`, `title`, `description` |
| `Modal` | Diálogos (fecha com Esc e clique fora, foca o botão de fechar) | `isOpen`, `onClose`, `title` |
| `MissionCard` | Cartão de missão | `mission`, `onSelectMission`, `estadoUsuario` (`criada`, `engajada`, `concluida`) |
| `Avatar` | Foto de perfil ou, sem foto, iniciais na cor do anel favorito | `nome`, `anel`, `fotoId`, `tamanho`: `sm`, `md`, `lg`, `xl` |
| `Campo` | Rótulo + campo + erro/dica de todo formulário. Exporta também `classeCampo(temErro)` e `a11yCampo(id, erro)` | `id`, `label`, `error`, `obrigatorio`, `dica` |
| `SeletorImagem` | Escolher/trocar/remover imagem com pré-visualização e compressão automática | `id`, `rotulo`, `formato` (`avatar`, `banner`, `capa`), `valor`, `onChange`, `dica` |
| `SeloPrazo` | Data limite da missão: "Faltam X dias", "Termina hoje", "Prazo encerrado" | `prazo` (AAAA-MM-DD), `completo` |
| `Foguinho` | Dias seguidos de acesso | `dias`, `grande` |
| `Logo` | Marca (cabeçalho e rodapé) | — |
| `AsciiGlobe` | Planeta em ASCII girando (canvas) | `className` |
| `CelebracaoAnel` | Animação em tela cheia ao criar missão (partículas próprias de cada anel) | `anel`, `titulo`, `xp`, `onFim` |
| `AvisoConquista` | Cartão "Conquista desbloqueada!" no canto inferior direito, com confetes (`canvas-confetti`) | `conquista`, `onFechar` |
| `NotificadorConquistas` | Montado no layout: detecta conquistas novas no perfil e mostra uma de cada vez (lembra as já comemoradas no `localStorage`) | — |
| `BolhaMensagem` | Uma mensagem do chat (texto, foto com/sem legenda, apagada). Foto tem largura fixa, estilo WhatsApp | `mensagem`, `minha`, `agrupada`, `onAbrirImagem`, `onImagemCarregada`, `acoes` |
| `ChatMissao` | Chat em tempo real da missão, com envio de imagens | `missaoId`, `podeParticipar`, `usuarioUid`, `chamarApi`, `totalMembros`, `acaoBloqueado` |
| `ScrollToTop` | Botão "voltar ao topo" | — |

Padrões visuais recorrentes: cartões `rounded-2xl border border-border bg-card shadow-sm`,
campos `rounded-xl border bg-background px-4 py-3 text-sm`, avisos flutuantes (toast) fixos
na parte de baixo com `role="status"`.

## 7. Anéis elementais (`src/lib/rings.js`)

Fonte única dos 5 anéis. **Não repita listas de anéis nas telas** — importe `RINGS` ou `getRing(id)`.
Cada anel tem `id` (`terra`, `fogo`, `vento`, `agua`, `coracao`), `label`, `Icon` e as classes
prontas `bg`, `text`, `border`, `soft`. `STATUS_STYLES` define as cores dos status das missões.

## 8. Gamificação (`src/lib/gamificacao.js`)

- `XP`: pontos por ação (acesso diário 5, denúncia 20, engajar 10, concluir 50).
- `NIVEIS` e `nivelDe(xp)`: nível atual, próximo nível e progresso.
- `CONQUISTAS`: calculadas a partir do perfil (função `teste`), não ficam salvas no banco.
- O foguinho usa as datas de `src/lib/datas.js` (fuso de Brasília).
- **Todo XP é concedido pela API**, nunca pelo navegador.

## 9. API e autenticação

- O navegador chama a API com `chamarApi()` do `useAuth()`, que envia
  `Authorization: Bearer <token do Firebase>`.
- No servidor, `usuarioDaRequisicao(request)` valida o token e devolve `{ uid, email, nome }`.
- Erros sempre no formato `{ "message": "texto para o usuário" }` com o status HTTP correto.
- Nunca devolva dados privados (ex.: e-mail) em rotas públicas — veja `missaoPublica` e `perfilPublico`.

| Rota | Métodos | Login |
|---|---|---|
| `/api/missoes` | `GET` lista · `POST` cria · `PATCH ?id=` engajar/concluir · `DELETE ?id=` (só o criador) | GET público; demais exigem |
| `/api/missoes/[id]` | `GET` uma missão e seus membros · `PUT` editar (só o criador) | GET público; PUT exige |
| `/api/imagens` | `POST` envia foto de perfil, banner ou capa (devolve o `id`) | Exige |
| `/api/imagens/[id]` | `GET` devolve a imagem como arquivo (com cache) | Público |
| `/api/missoes/[id]/mensagens` | `POST` envia mensagem/imagem · `DELETE ?mensagem=` apaga a própria | Exige (e ser membro) |
| `/api/perfil` | `GET` próprio perfil · `PATCH` editar | Exige |
| `/api/perfil/checkin` | `POST` acesso do dia (cria o perfil no 1º login) | Exige |
| `/api/ranking` | `GET` top 20 por XP | Público |
| `/api/estatisticas` | `GET` números da página inicial | Público |

Coleções do Firestore: `missoes` (com a subcoleção `mensagens` do chat), `usuarios` e `imagens`.

### Imagens (foto de perfil, banner e capa de missão)

- Formatos e limites em `FORMATOS_IMAGEM` (`src/lib/imagens.js`); a compressão acontece no navegador.
- Cada imagem é um documento em `imagens` e é exibida por `urlImagem(id)` → `/api/imagens/<id>`.
  Perfis e missões guardam só o id (`avatarId`, `bannerId`, `capaId`), então as listas continuam leves.
- Em formulários, use `salvarImagemSeNova(chamarApi, valor, idAtual, formato)`: envia só se a imagem mudou.
- A API só aceita imagens do próprio usuário e apaga a antiga ao trocar ou remover.

### Prazo e edição de missão

- `prazo` é opcional (AAAA-MM-DD). `infoPrazo` (texto/situação) e `erroPrazo`/`validarCamposMissao`
  ficam em `src/lib/missoes.js` e valem para o formulário e para a API.
- Depois do prazo, ninguém mais entra na missão (a API bloqueia); quem já entrou ainda pode concluir.
- Só o criador edita (`PUT /api/missoes/[id]`) e exclui a missão.

### Chat da missão

- Membros da missão = criador + participantes (`ehMembro` em `src/lib/missoes.js`). Só eles leem e escrevem.
- **Leitura em tempo real** direto do Firestore no navegador (`onSnapshot`, últimas 80 mensagens);
  **envio e exclusão sempre pela API**, que valida login, membro e tamanho.
- Imagens são comprimidas no navegador (até 1280px, JPEG) e salvas em base64 na própria mensagem,
  porque o Firebase Storage exige o plano Blaze. Limites em `CHAT` (`src/lib/missoes.js`).
- Mensagem apagada continua na conversa como "Mensagem apagada" (campo `apagada: true`).

## 10. Acessibilidade (meta: WCAG AA e Lighthouse acima de 90)

- Ícones decorativos com `aria-hidden="true"`; botões só com ícone precisam de `aria-label`.
- Todo campo tem `<label htmlFor>`; campos com erro usam `aria-invalid` e `aria-describedby`.
- Grupos de opções em `fieldset` + `legend`; filtros com `aria-pressed`.
- Foco visível: `focus-visible:ring-2 focus-visible:ring-primary`.
- Animações respeitam `prefers-reduced-motion` (já tratado em `globals.css`).

## 11. Código e Git

- Nomes de variáveis, funções e componentes em **português**, comentários curtos em português.
- Toda alteração nova em **uma branch própria** (ex.: `feature/nome-da-mudanca`).
- Mensagens de commit curtas, diretas, em minúsculas, sem emoji e sem atribuição a ferramentas.
- Rode `npm run build` antes de enviar para garantir que compila.
