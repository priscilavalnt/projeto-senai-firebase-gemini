# Documentação de Desenvolvimento — Estúdio Tarja Preta

## 1. Visão Geral do Aplicativo
O **Estúdio Tarja Preta** é uma aplicação web moderna voltada para agendamento de sessões e visualização de portfólios autorais de tatuagem. O projeto foi projetado com visual marcante em tons de **amarelo e preto**, responsividade completa (mobile, tablet e desktop) e alternância discreta entre os modos **Dark e Light**.

---

## 2. Credenciais de Teste & Firebase Auth

### 2.1 Integração com o Firebase Auth
- O arquivo **`firebaseconfig.js`** (e `src/firebaseconfig.js`) está criado e pronto para receber as credenciais do seu projeto Firebase.
- Contém a exportação de `firebaseConfig`, inicialização segura do Firebase App, `GoogleAuthProvider`, `signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `signInWithPopup`, `signOut` e `onAuthStateChanged`.
- Para conectar ao seu Firebase real:
  1. Acesse o **[Firebase Console](https://console.firebase.google.com/)**.
  2. Vá em **Configurações do Projeto** > **Geral** > **Seus Aplicativos** (Web).
  3. Copie o objeto `firebaseConfig` e cole no arquivo `firebaseconfig.js`.
  4. Certifique-se de que na aba **Authentication > Sign-in method** os provedores **E-mail/senha** e **Google** estejam ativados.
- Se o arquivo mantiver os placeholders (`SUA_API_KEY_AQUI`), o aplicativo opera em modo seguro com os usuários de teste para garantir a navegação fluida sem falhas de tela.

### 2.2 Usuário Inicial de Teste
- **E-mail:** `eu@eu.com`
- **Senha:** `1234`
- **Atalho no App:** Botão *"Preencher"* na tela de login para preenchimento imediato em 1 clique.
- **Login com Google:** Botão proeminente *"Entrar com conta do Google"* integrado com `GoogleAuthProvider`.

### 2.3 Sistema de Envio e Verificação de E-mail (Padrão Firebase)
- **Envio Automático:** Ao cadastrar novo usuário via E-mail/Senha, o método padrão `sendEmailVerification(user)` do Firebase é invocado automaticamente.
- **Bloqueio de Acesso Obrigatório:** Caso o usuário faça login ou cadastro e `user.emailVerified` for `false`, ele é **estritamente bloqueado** na tela de **Confirmação de E-mail (`VerifyEmailScreen`)**.
- **Segurança Reforçada:** Todas as rotas e telas internas (Tatuadoras, Portfólio, Agenda, Detalhes e Meus Agendamentos) ficam inacessíveis enquanto o e-mail não for validado.
- **Recursos da Tela de Verificação:**
  - Botão *"Já validei meu e-mail / Atualizar Status"* (executa `await user.reload()` e valida `user.emailVerified` em tempo real).
  - Botão *"Reenviar E-mail de Verificação"* (com temporizador de 30 segundos anti-spam).
  - Checagem automática em segundo plano a cada 5 segundos.
  - Botão auxiliar *"Simular Validação"* para testes rápidos em ambientes de homologação/demonstração.
  - Opção de *"Sair ou entrar com outra conta"*.

---

## 3. Arquitetura das Telas do Aplicativo

### Tela 1: Login de Usuário (Tela Inicial)
- **Objetivo:** Ponto de entrada do aplicativo.
- **Recursos:**
  - Formulário com campos de **E-mail** e **Senha** com validações em tempo real.
  - Usuário inicial de teste configurado (`eu@eu.com` / `1234`).
  - Botão de autenticação via **Google Account**.
  - Link direto para a tela de cadastro para novos clientes.
  - Banner lateral editorial com a identidade visual do estúdio.

### Tela 2: Cadastro de Novos Usuários
- **Objetivo:** Registro de novos clientes no sistema do estúdio.
- **Recursos:**
  - Campo de **Nome Completo**.
  - Campo de **E-mail** com validação de formato.
  - Campo de **Senha** (mínimo de caracteres).
  - Campo de **Confirmação de Senha (Dupla Verificação)**, com validação visual instantânea que indica se as senhas coincidem.
  - Armazenamento local (`localStorage`) permitindo que novos usuários façam login subsequentemente.
  - Botão de retorno à tela de login.

### Tela 3: Tatuadoras Disponíveis no Estúdio
- **Objetivo:** Apresentação da equipe de profissionais residentes do estúdio.
- **Tatuadoras Cadastradas:**
  1. **Maya Lin:** Blackwork, Geométrico & Dotwork (8 anos de estrada).
  2. **Clara Duarte:** Fineline, Microrealismo & Botânica (6 anos de estrada).
  3. **Beatriz Prado:** Neo-Oriental Contemporâneo, Dark Art & Ilustrativo (10 anos de estrada).
- **Recursos:**
  - Fotos de alta qualidade das profissionais.
  - Filtros rápidos por estilo musical/estético (Blackwork, Fineline, Neo-Oriental).
  - Mini-thumbnails das últimas tatuagens feitas por cada uma.
  - **Interação:** O usuário clica na foto ou no card da tatuadora para abrir a galeria com seus trabalhos.

### Tela 4: Portfólio de Fotos da Tatuadora
- **Objetivo:** Galeria com as imagens das tatuagens realizadas pela profissional selecionada.
- **Recursos:**
  - Grid responsivo com as fotos das tatuagens e trabalhos disponíveis.
  - Filtros internos (Blackwork, Fineline, Oriental, Flashes Autorais).
  - **Modal Lightbox em Tela Cheia:** Ao clicar em qualquer imagem, abre-se uma visualização detalhada com zoom, indicação do local anatômico, tempo estimado da sessão e descrição da técnica.
  - **Botão Obrigatório de Agendamento:** *"Agendar Tatuagem com [Nome da Artista]"* direcionando diretamente para a agenda da profissional.
  - **Botão Obrigatório do WhatsApp:** Link direto `https://wa.me/...` com mensagem pré-formatada para contato e dúvidas rápidas.

### Tela 5: Agenda da Tatuadora
- **Objetivo:** Seleção de data e horário para a sessão de tatuagem.
- **Recursos:**
  - Calendário mensal interativo com dias disponíveis destacados (respeitando os dias de atendimento da tatuadora).
  - Bloqueio de datas passadas e dias esgotados.
  - Lista de horários disponíveis no dia escolhido (ex: `10:00`, `13:30`, `16:00`, `18:30`).
  - Identificação de vagas livres vs ocupadas em tempo real.
  - Resumo dinâmico da seleção antes de avançar.

### Tela 6: Informações Obrigatórias da Tatuagem
- **Objetivo:** Coleta das informações técnicas essenciais para a realização da tatuagem.
- **Campos Obrigatórios Implementados:**
  1. **Tamanho em centímetros (cm) [OBRIGATÓRIO]:** Slider e seletor numérico de 3 cm até 35+ cm com referências visuais de escala anatômica.
  2. **Local do corpo [OBRIGATÓRIO]:** Seletor de áreas do corpo (Antebraço, Braço, Ombro, Costela, Coxa, Costas, Peito, etc.) com campo de personalização livre caso o cliente escolha "Outro local".
  3. **Imagens de ideias/referências [OBRIGATÓRIO]:** Sistema de upload de imagens locais (arquivos PNG/JPG) com preview imediato, além de banco de presets/ideias do estúdio para inclusão rápida.
  4. **Número de contato / WhatsApp [OBRIGATÓRIO]:** Campo de telefone com máscara automática nacional `(XX) XXXXX-XXXX` e validação de dígitos mínimos.
  - Campo opcional adicional para observações e narrativa da ideia.
  - Validação estrita: formulário só avança se todos os 4 requisitos forem atendidos.

### Telas Complementares:
- **Comprovante de Agendamento (Sucesso):** Voucher com protocolo (`#TP-XXXXX`), resumo técnico, orientações pré-sessão e botão para notificar a tatuadora no WhatsApp com a mensagem formatada.
- **Meus Agendamentos:** Painel do usuário para consultar todas as suas sessões ativas com opção de contato direto ou cancelamento.

---

## 4. Design System & Identidade Visual
- **Paleta de Cores:**
  - **Preto Profundo / Charcoal:** `#0A0A0A`, `#121212`, `#18181B` (Remete à "Tarja Preta" e tinta para tattoo).
  - **Amarelo Destaque:** `#FACC15` / `#EAB308` (Alto contraste, energia visual e foco em CTAs primários).
  - **Neutros de Suporte:** Bordas em tons de cinza suave e tipografia com contraste WCAG AA.
- **Alternador de Modos Dark / Light:**
  - Ícone discreto posicionado no topo (`Header`), alternando entre ícone de Sol e Lua.
  - Persistência automática da preferência do usuário no `localStorage`.
- **Tipografia:** Famílias `Outfit` e `Plus Jakarta Sans` para legibilidade editorial e estética contemporânea.

---

## 5. Estrutura de Arquivos Criada
```
/
├── DESENVOLVIMENTO.md             # Esta documentação completa do projeto
├── index.html                     # Entrypoint com fontes e metas em PT-BR
├── metadata.json                  # Metadados do applet
├── package.json                   # Dependências do projeto
├── vite.config.ts                 # Configuração do Vite
└── src/
    ├── main.tsx                   # Inicialização do React
    ├── App.tsx                    # Orquestrador central e fluxo de navegação
    ├── index.css                  # Estilos globais e Tailwind v4
    ├── types/
    │   └── index.ts               # Tipagens TypeScript (User, Artist, Work, Booking)
    ├── data/
    │   └── studioData.ts          # Dados das tatuadoras, portfólios e credenciais de teste
    ├── context/
    │   └── ThemeContext.tsx       # Gerenciador de tema Dark/Light
    ├── components/
    │   ├── Header.tsx             # Barra superior de navegação e alternador de tema
    │   ├── ImageLightboxModal.tsx # Visualizador de fotos em tela cheia com zoom
    │   └── screens/
    │       ├── LoginScreen.tsx           # Tela 1 (Login)
    │       ├── RegisterScreen.tsx        # Tela 2 (Cadastro com dupla verificação)
    │       ├── ArtistsScreen.tsx         # Tela 3 (Lista de Tatuadoras)
    │       ├── PortfolioScreen.tsx       # Tela 4 (Fotos dos trabalhos + WhatsApp + Agendar)
    │       ├── ScheduleScreen.tsx        # Tela 5 (Agenda com dias e horários)
    │       ├── BookingDetailsScreen.tsx  # Tela 6 (Tamanho cm, local, imagens, contato)
    │       ├── BookingSuccessScreen.tsx  # Voucher e confirmação
    │       └── MyBookingsScreen.tsx      # Histórico de agendamentos
    └── assets/
        └── images/                       # Fotografias autorais geradas para o estúdio
```

---

## 6. Como Executar e Testar
1. Acesse o aplicativo na tela inicial de **Login**.
2. Clique no botão **"Preencher"** para carregar `eu@eu.com` e senha `1234`, ou clique em **"Entrar com conta do Google"**, ou acesse **"Criar Conta"** para testar o cadastro com dupla verificação.
3. Na tela de **Tatuadoras**, clique na foto de qualquer profissional (Maya Lin, Clara Duarte ou Beatriz Prado).
4. Na tela de **Portfólio**, visualize as fotos de trabalhos, clique em uma imagem para abrir o Lightbox, e utilize os botões **"Agendar Tatuagem"** ou **"WhatsApp"**.
5. Na **Agenda**, selecione uma data no calendário e um horário disponível.
6. Na tela de **Detalhes Obrigatórios**, defina o tamanho em cm, selecione o local do corpo, anexe uma ou mais imagens de ideias (ou use as referências rápidas) e informe seu telefone/WhatsApp.
7. Clique em **"Finalizar e Confirmar Agendamento"** para visualizar seu voucher com protocolo e notificar a profissional no WhatsApp.
