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
- **Firebase**: Authentication (e-mail/senha), Firestore (banco) e Hosting (hospedagem gratuita).
- **Site estático** (`output: 'export'` em `next.config.mjs`): o build gera a pasta `out/`, publicada
  no Firebase Hosting. **Não existe servidor**: nada de rotas `app/api`, Server Actions ou rotas dinâmicas
  (`[id]`). Use query string (ex.: `/missao?id=...`) e leia o valor no navegador.
- **react-icons** (`react-icons/fa6`) para ícones — sempre ícones **preenchidos** (Font Awesome 6 solid).
- Imports com **caminho relativo** (`../../components/Button`). O atalho `@/` não está configurado.

## 2. Estrutura de pastas

```
src/
├── app/                  Páginas (cada pasta é uma rota)
├── components/           Componentes reutilizáveis (Button, Modal, PageHeader, ...)
├── context/              AuthContext (usuário logado + perfil, para todas as telas)
├── lib/
│   ├── servicos.js       TODAS as operações de dados (missões, perfil, XP, chat, imagens)
│   ├── firestoreRest.js  Cliente da API REST do Firestore (GET/POST/PATCH/DELETE)
│   └── ...               rings, gamificacao, missoes, perfis, imagens, datas, firebase
└── styles/               globals.css, theme.css (tokens) e fonts.css
firestore.rules           Regras de segurança (quem pode ler/gravar o quê)
firebase.json             Configuração do Hosting (pasta out/) e das regras
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
| `ImagemSalva` | Mostra uma imagem salva no Firestore pelo id (com cache e espaço reservado ao carregar) | `id`, `alt`, `className` |
| `Conversa` | Chat em tempo real genérico (missão, time e privado), com imagens | `caminho` (ex.: `['missoes', id, 'mensagens']`), `titulo`, `subtitulo`, `podeParticipar`, `usuarioUid`, `fotosMembros`, `acaoBloqueado`, `compacto` |
| `ChatFlutuante` | Balão no canto inferior direito: chat do time (anel favorito) e conversas privadas entre amigos, escolhidos na mesma lista (montado no layout) | — |
| `BotaoAmizade` | Adicionar / pedido enviado / aceitar / conversar com outro protetor | `uid`, `nome`, `compacto` |
| `CampoBusca` | Campo de busca com lupa | `id`, `value`, `onChange`, `placeholder`, `rotulo` |
| `SeloPrazo` | Data limite da missão: "Faltam X dias", "Termina hoje", "Prazo encerrado" | `prazo` (AAAA-MM-DD), `completo` |
| `Foguinho` | Dias seguidos de acesso | `dias`, `grande` |
| `Logo` | Marca (cabeçalho e rodapé) | — |
| `AsciiGlobe` | Planeta em ASCII girando (canvas) | `className` |
| `CelebracaoAnel` | Animação em tela cheia ao criar missão (partículas próprias de cada anel) | `anel`, `titulo`, `xp`, `onFim` |
| `AvisoConquista` | Cartão "Conquista desbloqueada!" no canto inferior direito, com confetes (`canvas-confetti`) | `conquista`, `onFechar` |
| `NotificadorConquistas` | Montado no layout: detecta conquistas novas no perfil e mostra uma de cada vez (lembra as já comemoradas no `localStorage`) | — |
| `BolhaMensagem` | Uma mensagem do chat (texto, foto com/sem legenda, apagada). Foto tem largura fixa, estilo WhatsApp | `mensagem`, `minha`, `agrupada`, `onAbrirImagem`, `onImagemCarregada`, `acoes` |
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
- O XP é concedido em `src/lib/servicos.js`. As regras do Firestore limitam o ganho a no máximo +50 por
  gravação (dificulta trapaça, mas não impede totalmente — não há servidor).

## 9. Dados, API REST e segurança

- **Páginas nunca falam com o Firestore direto**: sempre chamam as funções de `src/lib/servicos.js`.
- **Missões usam a API REST do Firestore** (`https://firestore.googleapis.com/v1/...`), por
  `src/lib/firestoreRest.js`, com o token do usuário logado no cabeçalho `Authorization`:

| Função (servicos.js) | Verbo HTTP | O que faz | Quem pode |
|---|---|---|---|
| `listarMissoes()` | `GET` | lista as missões | todos |
| `obterMissao(id)` | `GET` | uma missão + membros | todos |
| `criarMissao(form, capa, perfil)` | `POST` | registra a denúncia (+20 XP) | logado |
| `editarMissao(id, campos, atual)` | `PATCH` | edita título, anel, local, prazo, descrição, capa | só o dono |
| `excluirMissao(id, atual)` | `DELETE` | exclui (devolve o XP da criação) | só o dono |
| `encerrarMissao(id, atual)` | `PATCH` | o líder encerra (status `Concluída`, +30 XP) | só o dono |

- O resto usa o SDK do Firebase: `checkin`, `editarPerfil`, `acaoMissao` (engajar/concluir), `ranking`,
  `estatisticas`, `enviarMensagem`, `apagarMensagem`, `enviarImagem`, `carregarImagem`.
- Erros sempre como `Error` com mensagem em português para mostrar ao usuário.

### Social, times e rankings

- **Amigos**: coleção `amizades`, id = os dois uids em ordem separados por `_` (`idPar`). Status `pendente` → `aceita`.
  O `AmigosContext` escuta as amizades em tempo real e controla o balão: `abrirConversa(uid)` (amigo) e `abrirTime()` (time).
- **Conversa privada**: `conversas/{par}/mensagens`, só entre amigos aceitos.
- **Time**: `times/{anel}/mensagens`; o time é o anel favorito do perfil. A página `/time` mostra o placar e os
  membros; o chat do time abre no balão de conversas (`ChatFlutuante`), ao lado dos amigos.
- **Rankings**: `ranking(periodo)` e `rankingElementos(periodo)`, com `periodo` = `semanal`, `mensal` ou `geral`.
  O XP do período fica em `xpPorPeriodo` (chaves `chaveSemana()` / `chaveMes()` de `datas.js`) e é
  atualizado por `aplicarXp` sempre que alguém ganha ou perde XP. O ranking dos elementos soma no navegador
  (sem índices compostos).
- **Missão encerrada**: `status: 'Concluída'` (`missaoConcluida`); `aceitaProtetores` diz se ainda dá para entrar
  (não encerrada e dentro do prazo). O painel separa as abas Ativas e Concluídas.

### Regras de segurança (`firestore.rules`)

Como não há servidor, **a segurança está nas regras**. Ao criar um campo ou coleção nova, atualize-as:

- `usuarios`: leitura pública (sem e-mail); cada um só grava o próprio perfil; XP sobe no máximo +50 por vez.
- `missoes`: leitura pública; só o dono edita/exclui; outros só mexem em `participantIds`,
  `participants` e `concluidoPor` (entrar/concluir).
- `missoes/{id}/contatos`: e-mail de quem denunciou — só o dono lê.
- `missoes/{id}/mensagens`: só membros (criador + participantes) leem e escrevem.
- `imagens`: leitura pública; cada um só cria/apaga as próprias.
- `amizades`: só os dois envolvidos leem; quem pede cria como pendente; só quem recebeu aceita.
- `conversas/{par}/mensagens`: só os dois amigos (amizade aceita).
- `times/{anel}/mensagens`: só quem tem aquele anel no perfil.

Coleções: `missoes` (subcoleções `mensagens` e `contatos`), `usuarios`, `imagens`, `amizades`,
`conversas` (subcoleção `mensagens`) e `times` (subcoleção `mensagens`).

### Chat da missão

- Leitura em tempo real (`onSnapshot`, últimas 80 mensagens) em `ChatMissao`; envio e exclusão por
  `enviarMensagem` / `apagarMensagem`. Mensagem apagada fica como "Mensagem apagada".
- Imagens do chat vão comprimidas (base64) na própria mensagem. Limites em `CHAT` (`src/lib/missoes.js`).

### Imagens (foto de perfil, banner e capa)

- Formatos e limites em `FORMATOS_IMAGEM` (`src/lib/imagens.js`); compressão no navegador.
- Cada imagem é um documento em `imagens`; perfis e missões guardam só o id (`avatarId`, `bannerId`, `capaId`).
- Para exibir, use o componente `ImagemSalva` (carrega com cache). Em formulários, o valor do
  `SeletorImagem` é o id salvo, um data URL novo ou `null`; `salvarImagemSeNova` resolve o id final.

### Prazo e edição de missão

- `prazo` opcional (AAAA-MM-DD); `infoPrazo`, `erroPrazo` e `validarCamposMissao` em `src/lib/missoes.js`.
- Depois do prazo ninguém mais entra na missão; quem já entrou ainda pode concluir.

### Publicar no Firebase (gratuito)

```
npm run build
firebase deploy --only hosting,firestore:rules
```

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
