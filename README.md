# 🛡️ Sistema de Checklist Digital - 17º BPM

<p align="center">
  <img src="https://img.shields.io/badge/Next.js%2015-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Nodemailer-007ACC?style=for-the-badge&logo=nodemailer&logoColor=white" alt="Nodemailer" />
  <img src="https://img.shields.io/badge/jsPDF-E43937?style=for-the-badge&logo=adobeacrobatreader&logoColor=white" alt="jsPDF" />
  <img src="https://img.shields.io/badge/Lucide_Icons-FF69B4?style=for-the-badge&logo=lucide&logoColor=white" alt="Lucide" />
  <img src="https://img.shields.io/badge/Security-Level_4-green?style=for-the-badge&logo=dependabot&logoColor=white" alt="Security" />
</p>

<p align="center">
  <strong>Otimização de fluxos de conferência e logística da Furrielação do 17º Batalhão de Polícia Militar.</strong>
</p>

---

## 📖 Sobre o Projeto: Do Papel para Performance Digital

O **Sistema de Checklist Digital** foi idealizado para sanar um gargalo operacional na **Furrielação do 17º BPM**. Atualmente, a conferência de itens é realizada através de formulários físicos impressos, o que gera um fluxo burocrático e oneroso.

### 📉 O Processo Atual

* **Consumo de Papel:** São impressas 02 cópias por turno (Diurno e Noturno) para conferência de carga.
* **Logística Física:** Após o preenchimento manual, as cópias devem ser entregues fisicamente ao almoxarifado.
* **Gestão de Arquivo:** O armazenamento físico dificulta a consulta rápida de históricos de avarias ou responsabilidades.

### 🚀 A Transformação Digital
Este projeto substitui o checklist físico por uma interface digital responsiva. O Furriel realiza a conferência em tempo real e, ao concluir, os dados são disponibilizados instantaneamente para o almoxarifado, eliminando o papel e agilizando a conferência de carga.

---

## 🏗️ Arquitetura e Design Sênior

O sistema adota uma metodologia **Frontend-First** baseada em uma robusta **Arquitetura de Componentes Reutilizáveis**, garantindo escalabilidade e rigor visual.

### 🧩 Destaques Técnicos
* **Dashboard Analítico:** Painel com indicadores de prontidão operacional e alertas de avarias.
* **Checklist Mobile-First:** Interface otimizada para web, tablets e smartphones, facilitando a conferência no pátio ou reserva de armas.
* **Navegação Fluida (Back to Top):** Botão inteligente de retorno rápido ao topo, garantindo agilidade na alternância entre categorias em listas extensas.
* **Relatórios Inteligentes:** Conversão automática de checklists finalizados em documentos oficiais.

---

## 📸 Demonstração da Transição Operacional

### 🚩 Processo (Baseado em Papel/Planilha)
<p align="center">
  <img src="./screenshots/relatorio_ilustrativo.png" width="25%" style="border-radius: 8px; border: 1px solid #eaecef;" />
  <br>
  <em style="font-size: 11px; color: #586069;">Representação da dependência de fluxos manuais e descentralizados (imagem meramente ilustrativa).</em>
</p>

### 🚀 Nova Interface Digital

<table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td width="50%" valign="top" style="padding: 10px;">
      <div align="center" style="border: 1px solid #eaecef; border-radius: 12px; padding: 20px; height: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <p align="center"><img src="https://img.shields.io/badge/🔐-Login-blue?style=flat" /></p>
        <p align="center" style="font-size: 11px; color: #586069; margin-bottom: 15px; min-height: 25px;">Autenticação segura para militares cadastrados.</p>
        <img src="./screenshots/login.png" width="100%" style="border-radius: 8px; border: 1px solid #f0f0f0;" />
      </div>
    </td>
    <td width="50%" valign="top" style="padding: 10px;">
      <div align="center" style="border: 1px solid #eaecef; border-radius: 12px; padding: 20px; height: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <p align="center"><img src="https://img.shields.io/badge/📝-Criar_Conta-darkblue?style=flat" /></p>
        <p align="center" style="font-size: 11px; color: #586069; margin-bottom: 15px; min-height: 25px;">Interface de auto-cadastro para novos operadores.</p>
        <img src="./screenshots/tela de cadastro de usuario.png" width="100%" style="border-radius: 8px; border: 1px solid #f0f0f0;" />
      </div>
    </td>
  </tr>

  <tr>
    <td width="50%" valign="top" style="padding: 10px;">
      <div align="center" style="border: 1px solid #eaecef; border-radius: 12px; padding: 20px; height: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <p align="center"><img src="https://img.shields.io/badge/🔑-Esqueceu_Senha-orange?style=flat" /></p>
        <p align="center" style="font-size: 11px; color: #586069; margin-bottom: 15px; min-height: 25px;">Solicitação de recuperação via e-mail institucional.</p>
        <img src="./screenshots/esquece_senha.png" width="100%" style="border-radius: 8px; border: 1px solid #f0f0f0;" />
      </div>
    </td>
    <td width="50%" valign="top" style="padding: 10px;">
      <div align="center" style="border: 1px solid #eaecef; border-radius: 12px; padding: 20px; height: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <p align="center"><img src="https://img.shields.io/badge/📧-Link_Enviado-green?style=flat" /></p>
        <p align="center" style="font-size: 11px; color: #586069; margin-bottom: 15px; min-height: 25px;">Feedback de confirmação e orientações de segurança.</p>
        <img src="./screenshots/tela de link enviado para senha.png" width="100%" style="border-radius: 8px; border: 1px solid #f0f0f0;" />
      </div>
    </td>
  </tr>

  <tr>
    <td width="50%" valign="top" style="padding: 10px;">
      <div align="center" style="border: 1px solid #eaecef; border-radius: 12px; padding: 20px; height: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <p align="center"><img src="https://img.shields.io/badge/🔒-Nova_Senha-blue?style=flat" /></p>
        <p align="center" style="font-size: 11px; color: #586069; margin-bottom: 15px; min-height: 25px;">Finalização do fluxo com criação de nova credencial.</p>
        <img src="./screenshots/reset_senha.png" width="100%" style="border-radius: 8px; border: 1px solid #f0f0f0;" />
      </div>
    </td>
    <td width="50%" valign="top" style="padding: 10px;">
      <div align="center" style="border: 1px solid #eaecef; border-radius: 12px; padding: 20px; height: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <p align="center"><img src="https://img.shields.io/badge/📊-Dashboard-orange?style=flat" /></p>
        <p align="center" style="font-size: 11px; color: #586069; margin-bottom: 15px; min-height: 25px;">Visão geral com indicadores de prontidão operacional e alertas (StatCards).</p>
        <img src="./screenshots/dashboard-checklist.png" width="100%" style="border-radius: 8px; border: 1px solid #f0f0f0;" />
      </div>
    </td>
  </tr>

  <tr>
    <td width="50%" valign="top" style="padding: 10px;">
      <div align="center" style="border: 1px solid #eaecef; border-radius: 12px; padding: 20px; height: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <p align="center"><img src="https://img.shields.io/badge/⚙️-Novo_Checklist-amber?style=flat" /></p>
        <p align="center" style="font-size: 11px; color: #586069; margin-bottom: 15px; min-height: 25px;">Interface de conferência rápida de itens.</p>
        <img src="./screenshots/tela-checklist.png" width="100%" style="border-radius: 8px; border: 1px solid #f0f0f0;" />
      </div>
    </td>
    <td width="50%" valign="top" style="padding: 10px;">
      <div align="center" style="border: 1px solid #eaecef; border-radius: 12px; padding: 20px; height: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <p align="center"><img src="https://img.shields.io/badge/📈-Relatórios-darkblue?style=flat" /></p>
        <p align="center" style="font-size: 11px; color: #586069; margin-bottom: 15px; min-height: 25px;">Painel de exportação de dados para PDF e Excel.</p>
        <img src="./screenshots/tela relatorio-checklist.png" width="100%" style="border-radius: 8px; border: 1px solid #f0f0f0;" />
      </div>
    </td>
  </tr>

  <tr>
      <td width="50%" valign="top" style="padding: 10px;">
      <div align="center" style="border: 1px solid #eaecef; border-radius: 12px; padding: 20px; height: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <p align="center"><img src="https://img.shields.io/badge/📄-Impressão-red?style=flat" /></p>
        <p align="center" style="font-size: 11px; color: #586069; margin-bottom: 15px; min-height: 25px;">Documento timbrado pronto para arquivo oficial PDF ou Impressão.</p>
        <img src="./screenshots/impressao-checklist.png" width="100%" style="border-radius: 8px; border: 1px solid #f0f0f0;" />
      </div>
    </td>
   <td width="50%" valign="top" style="padding: 10px;">
      <div align="center" style="border: 1px solid #eaecef; border-radius: 12px; padding: 20px; height: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <p align="center"><img src="https://img.shields.io/badge/👥-Efetivo-indigo?style=flat" /></p>
        <p align="center" style="font-size: 11px; color: #586069; margin-bottom: 15px; min-height: 25px;">Listagem de militares com PermissionBadges.</p>
        <img src="./screenshots/tela_usuario_total.png" width="100%" style="border-radius: 8px; border: 1px solid #f0f0f0;" />
      </div>
    </td>
  </tr>

  <tr>
     <td width="50%" valign="top" style="padding: 10px;">
      <div align="center" style="border: 1px solid #eaecef; border-radius: 12px; padding: 20px; height: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <p align="center"><img src="https://img.shields.io/badge/🛠️-Interface_Modal-blueviolet?style=flat" /></p>
        <p align="center" style="font-size: 11px; color: #586069; margin-bottom: 15px; min-height: 25px;">Componente Modal unificado para inserção de dados (Cadastrar Usuário).</p>
        <img src="./screenshots/tela_modal_novo_usuario_tela_usuarios.png" width="100%" style="border-radius: 8px; border: 1px solid #f0f0f0;" />
      </div>
    </td>
     <td width="50%" valign="top" style="padding: 10px;">
      <div align="center" style="border: 1px solid #eaecef; border-radius: 12px; padding: 20px; height: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <p align="center"><img src="https://img.shields.io/badge/👥-Perfil-blueviolet?style=flat" /></p>
        <p align="center" style="font-size: 11px; color: #586069; margin-bottom: 15px; min-height: 25px;">Interface Perfil do Usuário.</p>
        <img src="./screenshots/perfil-checklist.png" width="100%" style="border-radius: 8px; border: 1px solid #f0f0f0;" />
      </div>
    </td>
  </tr>

  <tr>
    <td width="50%" valign="top" style="padding: 10px;">
      <div align="center" style="border: 1px solid #eaecef; border-radius: 12px; padding: 20px; height: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <p align="center"><img src="https://img.shields.io/badge/📄-Cadastro Usuários-red?style=flat" /></p>
        <p align="center" style="font-size: 11px; color: #586069; margin-bottom: 15px; min-height: 25px;">Interface para Cadastro de Novo Usuário</p>
        <img src="./screenshots/tela-cadastro-checklist.png" width="100%" style="border-radius: 8px; border: 1px solid #f0f0f0;" />
      </div>
    </td>
    <td width="50%" valign="top" style="padding: 10px;">
      <div align="center" style="border: 1px solid #eaecef; border-radius: 12px; padding: 20px; height: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <p align="center"><img src="https://img.shields.io/badge/📄-Cadastro Equipamentos-red?style=flat" /></p>
        <p align="center" style="font-size: 11px; color: #586069; margin-bottom: 15px; min-height: 25px;">Interface para Cadastro de Novo Equipamento</p>
        <img src="./screenshots/tela-cadastro-equipamento-checklist.png" width="100%" style="border-radius: 8px; border: 1px solid #f0f0f0;" />
      </div>
    </td>
    <td width="50%" valign="top" style="padding: 10px;">
      </td>
  </tr>
</table>

---

---

## 📩 Automação de Relatórios e Fluxo de E-mail

O sistema foi equipado com um **motor de envio automático**, eliminando a necessidade de anexar arquivos manualmente ou salvar PDFs em pastas locais para envio posterior.

### ⚙️ Implementação do Backend (Next.js API Routes)
Diferente de um frontend estático, este projeto utiliza **Serverless Functions** da Vercel para processar o envio de documentos de forma segura e performática:

* **NodeMailer Integration:** Utilização da biblioteca `nodemailer` para comunicação via protocolo SMTP.
* **Conversão Base64:** O PDF gerado no cliente é convertido em um fluxo de dados binários no servidor para garantir a integridade do anexo.
* **Segurança com Variáveis de Ambiente:** As credenciais de acesso (usuário e senha) não ficam expostas no código. Elas são gerenciadas via **Environment Variables** na Vercel, utilizando criptografia de ponta a ponta.

### 🛡️ Segurança e Autenticação (Gmail App Passwords)
Para garantir a confiabilidade do envio e evitar bloqueios de segurança, o sistema utiliza:
* **Senhas de Aplicativo:** Camada de segurança do Google que permite que o sistema envie e-mails institucionalmente sem expor a senha principal da conta.
* **Criptografia TLS/SSL:** Garantia de que os dados do relatório trafegam de forma segura entre a Vercel e os servidores de e-mail.

  ---

## 🛡️ Arquitetura de Segurança (Blindagem de Dados)

Dada a natureza sensível dos dados militares, o sistema implementa 4 níveis de proteção para garantir que apenas operadores autorizados gerenciem a logística.

### 🔐 Níveis de Proteção:
1. **Nível 1 - Middleware de Rota:** Bloqueio de acesso a checklists e dashboards para usuários não autenticados via servidor.
2. **Nível 2 - HttpOnly Cookies:** Proteção das credenciais contra ataques de script (XSS), mantendo a sessão segura no navegador.
3. **Nível 3 - Rate Limit (Upstash Redis):** Camada de proteção que impede o abuso do sistema de envio de e-mails e tentativas de força bruta no login.
4. **Nível 4 - Validação Zod:** Rigorosa filtragem de dados de entrada, garantindo que nenhum código malicioso seja inserido nos campos de conferência ou cadastro.

---

### 🔄 Fluxo Operacional Automatizado e Feedback
1.  **Validação:** O sistema verifica se todos os itens da carga (Armas, Munições, Viaturas) foram conferidos.
2.  **Geração:** O PDF é gerado em memória (lado do cliente) com o layout oficial do 17º BPM.
3.  **Disparo:** Ao clicar em **"Finalizar Conferência Geral"**, o sistema faz o download do arquivo para o operador e, simultaneamente, dispara uma cópia oficial para o e-mail da Seção de Logística via integração SMTP.
4.  **Confirmação:** O sistema exibe um feedback visual de sucesso e o e-mail chega na caixa de entrada com o PDF anexo.

### 📸 Feedback Visual do Envio (E-mail Recebido)

<p align="center">
  <img src="./screenshots/tela-recebimento-relatorio-pdf.png" width="80%" style="border-radius: 8px; border: 1px solid #eaecef;" />
  <br>
  <em style="font-size: 11px; color: #586069;">Demonstração do e-mail de relatório recebido na caixa de entrada com o PDF anexo.</em>
</p>

---

## 🛠️ Stack Tecnológica

| Ferramenta | Aplicação |
| :--- | :--- |
| **Next.js 15** | Framework Estrutural (App Router) |
| **React 19** | Biblioteca de Interface |
| **Upstash Redis** | Rate Limit e Segurança de Infraestrutura |
| **Tailwind CSS** | Design System e Estilização Sênior |
| **Nodemailer** | Automação de E-mail e Integração SMTP |
| **jsPDF** | Geração Dinâmica de Relatórios PDF |
| **Zod** | Validação de Esquemas e Proteção de Inputs |
| **Lucide React** | Iconografia Vetorial |
---

## 👤 Desenvolvedor

**Hildo Costa** - *Software Developer*

<p align="left">
  <a href="https://www.linkedin.com/in/hildo-costa-b83812231/">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" />
  </a>
  <a href="mailto:hyldo.costa@gmail.com">
    <img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" />
  </a>
</p>
