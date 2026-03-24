# 🛡️ Sistema de Gestão Interna - 17º BPM

<p align="center">
  <img src="https://img.shields.io/badge/Next.js%2015-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Lucide_Icons-FF69B4?style=for-the-badge&logo=lucide&logoColor=white" alt="Lucide" />
</p>

<p align="center">
  <strong>Plataforma inteligente para otimização de fluxos administrativos e controle operacional.</strong>
</p>

---

## 📖 Sobre o Projeto: De Planilhas para Performance Digital

O **Sistema de Gestão Interna - 17º BPM** nasceu de uma necessidade clara: modernizar e centralizar o controle de processos que, até então, dependiam de fluxos manuais e planilhas descentralizadas. O objetivo principal é converter a complexidade operacional em uma plataforma digital de alta performance, garantindo organização de dados, agilidade na consulta de informações e uma interface intuitiva para o militar.

Construído com **Next.js 15** e **React 19**, o sistema entrega uma experiência veloz, segura e preparada para escala.

---

### 🔄 A Grande Transformação: O Foco na Central de Serviços

O maior desafio e foco inicial do projeto foi a **Central de Serviços e Manutenções**. Anteriormente gerida através de uma planilha no Google Sheets (veja abaixo), a gestão sofria com a falta de alertas visuais, dificuldade na busca e risco de dados inconsistentes.

#### **O "Antes": Gestão Baseada em Google Sheets**
<p align="center">
  <img src="./screenshots/tabela controle de servicos - planilha.png" width="90%" style="border-radius: 8px; border: 1px solid #eaecef;" alt="Planilha Google Sheets Anterior" />
  <br>
  <em>A planilha original: dados descentralizados, sem automação e com visualização complexa.</em>
</p>

#### **O "Depois": O Novo Sistema Digital**
Nossa solução transformou essa planilha em um **Painel de Controle Inteligente** (visível na seção "Visual Preview"), onde as mesmas informações agora possuem:

* **Indicadores Visuais (KPIs):** Contagem instantânea de serviços 'Atrasados', 'Em Alerta' e 'Em Dia'.
* **Busca e Filtros Dinâmicos:** Encontre qualquer manutenção ou item em segundos.
* **Lógica de Cálculo Automático:** O sistema prevê a próxima data de execução baseada na periodicidade e última execução.
* **UX Otimizada:** Modais de cadastro rápido e interface limpa para focar no que importa.

## 📸 Demonstração da Interface (Visual Preview)

<p align="center">
  Abaixo, apresentamos os fluxos principais já implementados. Toda a interface utiliza **dados simulados (Mock Data)** para validar a usabilidade antes da integração com o banco de dados.
</p>

<table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td width="50%" valign="top" style="padding: 10px;">
      <div align="center" style="border: 1px solid #eaecef; border-radius: 12px; padding: 20px; height: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <p align="center">
          <img src="https://img.shields.io/badge/🔐-Login-blue?style=flat&logoColor=white" alt="Login Icon" />
        </p>
        <p align="center" style="font-size: 11px; color: #586069; margin-top: 5px; margin-bottom: 15px; min-height: 25px;">
          Autenticação segura para militares do 17º BPM.
        </p>
        <img src="./screenshots/login.png" width="100%" style="border-radius: 8px; border: 1px solid #f0f0f0;" alt="Tela de Login" />
      </div>
    </td>
    <td width="50%" valign="top" style="padding: 10px;">
      <div align="center" style="border: 1px solid #eaecef; border-radius: 12px; padding: 20px; height: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <p align="center">
          <img src="https://img.shields.io/badge/📊-Dashboard-orange?style=flat&logoColor=white" alt="Dashboard Icon" />
        </p>
        <p align="center" style="font-size: 11px; color: #586069; margin-top: 5px; margin-bottom: 15px; min-height: 25px;">
          Visão geral com indicadores de manutenção.
        </p>
        <img src="./screenshots/dashboard.png" width="100%" style="border-radius: 8px; border: 1px solid #f0f0f0;" alt="Dashboard Geral" />
      </div>
    </td>
  </tr>

  <tr>
    <td width="50%" valign="top" style="padding: 10px;">
      <div align="center" style="border: 1px solid #eaecef; border-radius: 12px; padding: 20px; height: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <p align="center">
          <img src="https://img.shields.io/badge/👤-Novo_Usuário-emerald?style=flat&logoColor=white" alt="User Icon" />
        </p>
        <p align="center" style="font-size: 11px; color: #586069; margin-top: 5px; margin-bottom: 15px; min-height: 25px;">
          Fluxo de registro de militares e níveis de acesso.
        </p>
        <img src="./screenshots/cadastrar_usuario.png" width="100%" style="border-radius: 8px; border: 1px solid #f0f0f0;" alt="Cadastro de Usuário" />
      </div>
    </td>
    <td width="50%" valign="top" style="padding: 10px;">
      <div align="center" style="border: 1px solid #eaecef; border-radius: 12px; padding: 20px; height: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <p align="center">
          <img src="https://img.shields.io/badge/⚙️-Novo_Serviço-amber?style=flat&logoColor=white" alt="Service Icon" />
        </p>
        <p align="center" style="font-size: 11px; color: #586069; margin-top: 5px; margin-bottom: 15px; min-height: 25px;">
          Gestão de manutenções preventivas e periódicas.
        </p>
        <img src="./screenshots/cadastrar_servico.png" width="100%" style="border-radius: 8px; border: 1px solid #f0f0f0;" alt="Cadastro de Serviço" />
      </div>
    </td>
  </tr>

  <tr>
    <td width="50%" valign="top" style="padding: 10px;">
      <div align="center" style="border: 1px solid #eaecef; border-radius: 12px; padding: 20px; height: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <p align="center">
          <img src="https://img.shields.io/badge/📋-Painel_de_Controle-darkblue?style=flat&logoColor=white" alt="Control Panel Icon" />
        </p>
        <p align="center" style="font-size: 11px; color: #586069; margin-top: 5px; margin-bottom: 15px; min-height: 25px;">
          Visualização consolidada de todas as manutenções e filtros.
        </p>
        <img src="./screenshots/servicos.png" width="100%" style="border-radius: 8px; border: 1px solid #f0f0f0;" alt="Tela de Controle de Serviços" />
      </div>
    </td>
    <td width="50%" valign="top" style="padding: 10px;">
      <div align="center" style="border: 1px solid #eaecef; border-radius: 12px; padding: 20px; height: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <p align="center">
          <img src="https://img.shields.io/badge/🛠️-Interface_de_Cadastro-blueviolet?style=flat&logoColor=white" alt="Modal Icon" />
        </p>
        <p align="center" style="font-size: 11px; color: #586069; margin-top: 5px; margin-bottom: 15px; min-height: 25px;">
          Janela flutuante (Modal) para inserção rápida de novos itens.
        </p>
        <img src="./screenshots/modal_cadastrar_servico.png" width="100%" style="border-radius: 8px; border: 1px solid #f0f0f0;" alt="Modal Cadastrar Serviço" />
      </div>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top" style="padding: 10px;">
      <div align="center" style="border: 1px solid #eaecef; border-radius: 12px; padding: 20px; height: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <p align="center">
          <img src="https://img.shields.io/badge/📩-Solicitações-blue?style=flat&logoColor=white" alt="Requests Icon" />
        </p>
        <p align="center" style="font-size: 11px; color: #586069; margin-top: 5px; margin-bottom: 15px; min-height: 25px;">
          Gerenciamento de chamados e ordens de serviço operacionais.
        </p>
        <img src="./screenshots/tela_solicitacoes.png" width="100%" style="border-radius: 8px; border: 1px solid #f0f0f0;" alt="Tela de Solicitações" />
      </div>
    </td>
    <td width="50%" valign="top" style="padding: 10px;">
      <div align="center" style="border: 1px solid #eaecef; border-radius: 12px; padding: 20px; height: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <p align="center">
          <img src="https://img.shields.io/badge/⚡-Novo_Chamado-cyan?style=flat&logoColor=white" alt="Modal Call Icon" />
        </p>
        <p align="center" style="font-size: 11px; color: #586069; margin-top: 5px; margin-bottom: 15px; min-height: 25px;">
          Modal de abertura rápida com vínculo direto à planilha master.
        </p>
        <img src="./screenshots/modal_abrir_chamado_tela_solicitacoes.png" width="100%" style="border-radius: 8px; border: 1px solid #f0f0f0;" alt="Modal de Novo Chamado" />
      </div>
    </td>
  </tr>
</table>

## 🏗️ Estratégia de Desenvolvimento (MVP)

O projeto adota uma metodologia **Frontend-First**, priorizando a validação da experiência do usuário e a arquitetura visual:

- **Foco em UI/UX:** Interface de alta fidelidade, desenvolvida para ser limpa, moderna e funcional.
- **Simulação de Dados (Mock Data):** Para validar a navegabilidade e as regras de negócio de forma ágil, o sistema utiliza dados simulados. Isso permite testar toda a jornada do usuário antes da integração definitiva com o banco de dados.
- **Prototipagem Funcional:** Estados de clique, fluxos de navegação e transições já estão totalmente operacionais.

---

## 🚀 Status do Desenvolvimento

### ✅ Já Implementado
* **Módulo de Acesso:** Telas de Login e Cadastro com validação de formulários.
* **Navegação Inteligente:** Menu lateral dinâmico com reconhecimento de página ativa.
* **Design System v2:** Padronização de componentes via Tailwind CSS (v4) com suporte a gradientes lineares.
* **Gestão de Usuários & Serviços:** Interface unificada para cadastro de efetivo e itens de manutenção.
* **Painel de Indicadores:** Visualização de métricas e estatísticas em tempo real (Dashboard).
* **Central de Serviços:** Tabela dinâmica para gerenciamento de solicitações e prazos de manutenção.
* **Central de Solicitações:** Tabela dinâmica para gerenciamento de chamados operacionais e ordens de serviço.
* **UX Polida:** Feedback visual de sucesso (Toasts), transições de entrada e cursor interativo em toda a aplicação.
* **Gestão de Sessão:** Fluxo de saída (Logout) com transições suaves.

### 📈 Roadmap (Próximas Etapas)
1. **👥 Níveis de Permissão:** Lógica de controle de acesso baseada no perfil do usuário (Operador/Gestor/Adm).
2. **📄 Relatórios Gerenciais:** Exportação de dados consolidados em PDF e Excel para o 17º BPM.
3. **🔗 Conexão de Banco de Dados:** Implementação da persistência real dos dados de manutenção.
## 🛠️ Stack Tecnológica

| Ferramenta | Aplicação |
| :--- | :--- |
| **Next.js 15** | Framework Estrutural (App Router) |
| **React 19** | Componentização e Lógica de Interface |
| **Tailwind CSS** | Estilização Modernas e Responsividade |
| **Lucide React** | Biblioteca de Ícones |
| **Git/GitHub** | Versionamento e Organização de Código |

---

## 👤 Desenvolvedor

**Hildo Costa** *Software Developer*

<p align="left">
  <a href="https://www.linkedin.com/in/hildo-costa-b83812231/">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
  <a href="mailto:hyldo.costa@gmail.com">
    <img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Gmail" />
  </a>
</p>

---

## ⚙️ Instalação Local

```bash
# 1. Clone o repositório
git clone [https://github.com/SEU_USUARIO/NOME_DO_REPO.git](https://github.com/SEU_USUARIO/NOME_DO_REPO.git)

# 2. Acesse o diretório
cd nome-do-projeto

# 3. Instale as dependências
npm install

# 4. Inicie o projeto
npm run dev
