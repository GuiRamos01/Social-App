# 🚀 SocialApp

Uma plataforma de rede social moderna e responsiva, desenvolvida com o ecossistema React, focada em compartilhamento de posts, interação entre usuários e uma experiência de interface fluida.

### Site Demo: <a href="https://majestic-cajeta-4cf95e.netlify.app">https://majestic-cajeta-4cf95e.netlify.app</a>

---

## 🛠️ Tecnologias Utilizadas

Este projeto utiliza uma stack de ponta para garantir performance e escalabilidade:

* **Frontend:** React (Vite), Javascript ES6+, Redux e React Router DOM.
* **Estilização:** Tailwind CSS, SASS e Radix UI (via Shadcn/UI).
* **Internacionalização:** i18next para suporte a múltiplos idiomas.
* **Serviços de Terceiros:** AWS SDK (S3), Cloudinary e Socket.io-client.

---

## ✨ Funcionalidades Principais

### 📱 Experiência do Usuário
* **Feed Dinâmico:** Visualização de posts com carregamento sob demanda ("Ver mais").
* **Perfis Detalhados:** Visualização de seguidores, seguindo, descrição e posts do usuário.
* **Navegação Inteligente:** Scroll automático para o topo ao mudar de página e barra de progresso de carregamento.
* **Tema Personalizável:** Suporte a temas claro e escuro.

### 🔐 Autenticação e Segurança
* **Fluxo de Acesso:** Login (e-mail/senha), cadastro e recuperação de senha.
* **Rotas Protegidas:** Acesso restrito a páginas como "Posts Salvos" e "Edição de Perfil" apenas para usuários autenticados.
* **Segurança Adicional:** Integração pronta para hCaptcha e fluxos de confirmação de e-mail.

### 📝 Gestão de Conteúdo
* **Criação de Posts:** Suporte a novos posts e sistema de comentários.
* **Mídias:** Visualização de fotos e integração de vídeos via Video.js e HLS.
* **Interatividade:** Menções, hashtags e links clicáveis nos conteúdos.

---

## 📂 Estrutura do Projeto

* `src/components/`: Componentes de interface (Botões, Header, Menu, ThemeProvider).
* `src/pages/`: Páginas principais (Home, Profile, Post, Auth).
* `src/redux/`: Configuração da store e estados globais.
* `src/styles/`: Arquivos de estilização em SASS e CSS.
* `src/scripts/`: Dados estáticos e mocks (ex: `posts.json`).

---
