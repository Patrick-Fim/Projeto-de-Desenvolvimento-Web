# Relatório de estudo — Protetores da Terra

## 1. Visão geral

O projeto é uma aplicação web construída com **Next.js e React**, usando o **App Router**. As páginas ficam em `src/app`; os componentes reutilizáveis, em `src/components`; e os estilos globais e tokens visuais, em `src/styles`.

O objetivo da aplicação é apresentar um movimento ambiental comunitário, permitir a consulta de missões e ocorrências, e oferecer um formulário para registrar novas denúncias.

**Importante:** os dados da API são simulados em memória. Não há integração com banco de dados; os dados criados ou removidos podem ser perdidos quando o processo do servidor reinicia.

## 2. Como a aplicação é montada

O arquivo `src/app/layout.jsx` é o layout raiz. Ele:

- define o idioma da página como português do Brasil;
- configura título e descrição padrão;
- importa os estilos globais;
- exibe a barra de navegação e o rodapé ao redor de todas as páginas.

A barra de navegação, em `src/components/Navbar.jsx`, contém links para as páginas e controla o menu em telas menores. Também oferece alternância entre tema claro e escuro, guardando a escolha em `localStorage`. O rodapé, em `src/components/Footer.jsx`, mostra a descrição do projeto e links rápidos.

## 3. Páginas principais

| Rota | Arquivo | Função |
|---|---|---|
| `/` | `src/app/page.jsx` | Página inicial e apresentação do movimento. |
| `/missoes` | `src/app/missoes/page.jsx` | Lista, busca e filtro de missões; permite abrir detalhes, confirmar engajamento e excluir uma ocorrência. |
| `/denuncia` | `src/app/denuncia/page.jsx` | Formulário para cadastrar uma ocorrência ambiental. |
| `/componentes` | `src/app/componentes/page.jsx` | Demonstra e testa componentes reutilizáveis. |
| `/estilo` | `src/app/estilo/page.jsx` | Demonstra cores, tipografia, anéis e estilos de botões. |

### Página inicial

A página `src/app/page.jsx` apresenta o propósito da plataforma, os cinco anéis elementais e métricas ilustrativas. Os botões principais levam ao painel de missões e ao formulário de denúncia. As informações e métricas exibidas nessa página são conteúdo estático.

### Painel de missões

A página `src/app/missoes/page.jsx` é um componente de cliente React: usa estado e efeitos para interagir com a API.

Ao abrir a página, a função `carregarMissoes` solicita os dados a `/api/missoes`. A interface também permite:

- buscar pelo título ou pela localidade;
- filtrar pelo anel elemental;
- ver estados de carregamento, erro e lista vazia;
- abrir os detalhes de uma missão em um modal;
- confirmar engajamento, que exibe uma mensagem na tela;
- solicitar a exclusão, com uma etapa de confirmação.

O engajamento é apenas uma confirmação visual na interface; não altera o número de participantes na API.

### Formulário de denúncia

A página `src/app/denuncia/page.jsx` controla os campos com `useState` e valida os dados no navegador. Os campos incluem nome, e-mail, título, anel, localidade e descrição.

A função `validateField` verifica requisitos como nome com pelo menos três caracteres e nome e sobrenome, formato de e-mail, título com pelo menos cinco caracteres e descrição com pelo menos quinze. A validação ocorre ao sair de um campo e ao enviar o formulário.

Se os campos forem válidos, `handleSubmit` envia os dados em JSON para `/api/missoes` usando `POST`. Com sucesso, mostra uma mensagem e limpa o formulário; se houver falha, mostra o erro retornado pela solicitação.

### Páginas de demonstração

A página `src/app/componentes/page.jsx` usa dados de exemplo próprios para demonstrar botões, cartões, modal e feedback de engajamento. É uma página de showcase; os cartões dela não são carregados da API.

A página `src/app/estilo/page.jsx` apresenta a identidade visual do projeto: cores, anéis elementais, tipografia e exemplos de botões.

## 4. API e fluxo dos dados

A aplicação possui uma rota de API definida em `src/app/api/missoes/route.js`, acessível em `/api/missoes`.

| Método | O que faz | Como é usado |
|---|---|---|
| `GET` | Retorna a lista de missões armazenada em memória. | A página `/missoes` usa esse método ao carregar. |
| `POST` | Valida campos obrigatórios e acrescenta uma nova ocorrência à lista, com status inicial `Análise`. | O formulário de `/denuncia` usa esse método. |
| `DELETE` | Recebe o identificador pela query string, remove a ocorrência correspondente ou retorna erro se não encontrar o ID. | A página `/missoes` usa esse método após a confirmação de exclusão. |

A lista inicial inclui três ocorrências de exemplo. O “banco de dados” é uma variável no próprio arquivo da rota, então **não é persistente**. Não há outras APIs externas identificadas no código analisado.

## 5. Componentes reutilizáveis

- `src/components/Button.jsx`: botão configurável com variantes visuais, tamanhos e propriedades como `disabled` e `ariaLabel`.
- `src/components/MissionCard.jsx`: cartão de missão com anel, status, localização, participantes e ação para selecionar a missão.
- `src/components/Modal.jsx`: janela de detalhes que fecha pelo botão, por clique no fundo ou pela tecla `Escape`; também impede a rolagem da página enquanto está aberta.
- `src/components/ScrollToTop.jsx`: botão que aparece após rolar a página e retorna ao topo suavemente.

## 6. Estilos e tecnologias

Os estilos globais são importados em `src/styles/globals.css`. Os tokens de cores e fontes estão em `src/styles/theme.css`, com valores diferentes para os modos claro e escuro. As fontes Montserrat e Inter são declaradas em `src/styles/fonts.css`. As classes visuais usam Tailwind CSS.

Os comandos disponíveis estão definidos em `package.json`:

- `npm run dev`: inicia o servidor de desenvolvimento;
- `npm run build`: gera a compilação de produção;
- `npm start`: inicia a aplicação compilada;
- `npm run lint`: executa o ESLint.

## 7. Roteiro curto para apresentação

> “Este projeto é uma aplicação Next.js para mobilização ambiental. O layout raiz mantém navegação e rodapé em todas as páginas. Na página de missões, o React busca as ocorrências pela API, permitindo filtrar, pesquisar, ver detalhes e excluir. O formulário valida os dados e envia uma nova ocorrência pelo método POST. A API implementa GET, POST e DELETE, mas os dados ficam apenas em memória — não existe persistência em banco de dados. A interface usa componentes reutilizáveis, como cartões, botões e modal, e tem um tema claro/escuro.”

## 8. Perguntas que podem surgir

**Onde ficam as páginas?**  
Em `src/app`; o nome da pasta determina a rota.

**Onde ficam a API e os componentes?**  
A API está em `src/app/api/missoes`; os componentes reutilizáveis, em `src/components`.

**Os dados ficam salvos permanentemente?**  
Não. São mantidos em uma lista em memória no servidor.

**O usuário realmente se cadastra como voluntário?**  
A interface apenas exibe uma confirmação; não registra o engajamento na API.

**A página de componentes usa os mesmos dados do painel?**  
Não. Ela tem dados de demonstração locais para mostrar os componentes.
