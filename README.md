# Projeto de Desenvolvimento

Este repositório contém o código-fonte da nossa aplicação. O objetivo deste documento é ajudar qualquer pessoa da equipa a configurar o ambiente e a executar o projeto localmente.


# Pré-requisitos

Antes de iniciar, confirma que tens os seguintes programas instalados no teu computador:

- Node.js
- Git


## Como Executar o Projeto

1. Instala as dependências necessárias:
   npm install

2. Inicia o servidor de desenvolvimento:
   npm run dev

3. Abre o navegador e acesse ao endereço: 

- LOCALHOST...


# Guia Rápido de Git

# Adicionar e Criar um Commit
Para guardar as tuas alterações no histórico do projeto:

1. Adicionar os ficheiros alterados:
-   git add .

2. Criar o commit com uma mensagem explicativa:
-   git commit -m "Descricao do que foi alterado"

3. Enviar as alterações para o GitHub:
-   git push


# Editar o Último Commit
Caso tenhas esquecido algum ficheiro ou queiras alterar a mensagem do commit recente (antes de fazer o push):

1. Alterar apenas a mensagem do último commit:
-  git commit --amend -m "Nova mensagem do commit"

2. Incluir ficheiros esquecidos no último commit sem alterar a mensagem:
-  git add .
-  git commit --amend --no-edit


# Baixar Alterações do GitHub (Puxar Commit)
Para atualizar o teu código local com os commits que os teus colegas enviaram:

1. Descarregar e juntar as alterações mais recentes no teu PC:
-  git pull