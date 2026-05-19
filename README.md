# EcoBot

**Demo:** [ecobotti.vercel.app](https://ecobotti.vercel.app) · **Pitch / roteiro de apresentação:** [PITCH.md](./PITCH.md)

O EcoBot é uma plataforma de **monitoramento ESG** que unifica qualidade do ar (OpenAQ v3), métricas ambientais (CO₂, energia, água, resíduos), score de sustentabilidade, histórico mensal e assistente inteligente — em uma única interface web.

Stack: React no frontend, Node.js com Express no backend, MongoDB para persistência e Jest para testes.

### Destaques para apresentação

- Dashboard com **painel executivo**, insights automáticos e roteiro de demo (5 min)
- Integração **OpenAQ API v3** com dados reais por cidade (BR)
- **Chatbot ESG** com prompts rápidos para demonstração ao vivo
- **Sugestões de otimização** priorizadas por impacto

## Arquitetura do Projeto

### Frontend

Responsável pela interface do usuário.

Tecnologias previstas:

- React
- Material-UI
- React Router
- Recharts
- Context API
- Local Storage

### Backend / API

Responsável pelas regras de negócio e comunicação com o banco de dados.

Tecnologias:

- Node.js
- Express
- API REST
- JWT

### Banco de Dados

Responsável pela persistência dos dados.

Tecnologia:

- MongoDB com Mongoose

### Testes

Responsável pela validação da aplicação.

Ferramentas previstas:

- Jest
- React Testing Library
- Supertest

### Comunicação

- Frontend → Backend → Banco de Dados
- API em JSON
- URL padrão local: `http://localhost:3001/api`

### Integrações Externas

- **OpenAQ API**
  - Fonte de dados de qualidade do ar
  - Versão: v3 (requer API key)
  - Documentação: https://docs.openaq.org/
  - Base da API: https://api.openaq.org/v3
  - Poluentes monitorados: PM2.5, PM10, NO2, O3, CO, SO2, AQI
  - Status: integração implementada com fallback para dados simulados
  - Métricas ESG enriquecidas: CO2, energia, água, resíduos, energia renovável, taxa de reciclagem, pontuação de sustentabilidade

## Estrutura de Pastas

```text
EcoBot/
├── backend/
│   └── src/
│       ├── config/
│       │   ├── database.js
│       │   └── env.js
│       ├── controllers/
│       │   ├── airQuality.controller.js
│       │   ├── chat.controller.js
│       │   ├── metrics.controller.js
│       │   ├── suggestions.controller.js
│       │   └── userController.js
│       ├── data/
│       │   ├── metrics.data.js
│       │   └── suggestions.data.js
│       ├── middlewares/
│       │   └── errorHandler.js
│       ├── models/
│       │   ├── AirQuality.js
│       │   ├── Log.js
│       │   ├── Metric.js
│       │   └── User.js
│       ├── routes/
│       │   ├── airQuality.routes.js
│       │   ├── chat.routes.js
│       │   ├── index.js
│       │   ├── metrics.routes.js
│       │   ├── suggestions.routes.js
│       │   └── userRoutes.js
│       ├── services/
│       │   ├── chatbot.service.js
│       │   └── openaq.service.js
│       ├── utils/
│       ├── app.js
│       └── server.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   └── charts/
│       ├── context/
│       ├── pages/
│       ├── routes/
│       └── services/
├── tests/
│   ├── backend/
│   ├── frontend/
│   ├── integration/
│   └── unit/
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── vercel.json
```

## Status da Estrutura

- O backend já foi reorganizado para uma separação mais clara entre configuração, rotas, controllers e services.
- A conexão com MongoDB foi implementada com Mongoose (com opção de rodar sem conexão para desenvolvimento).
- Schemas Mongoose foram criados (User, Metric, Log, AirQuality com métricas ESG).
- CRUD de usuários foi implementado (controller + rotas).
- Integração com OpenAQ v3 foi implementada para dados de qualidade do ar com fallback para dados simulados.
- Dados simulados enriquecidos com métricas ESG completas (CO2, energia, água, resíduos, energia renovável, taxa de reciclagem, pontuação de sustentabilidade).
- Integração real com OpenAQ v3 implementada usando endpoint /locations/{id}/latest.
- Middleware global de tratamento de erros foi adicionado.
- O frontend foi preparado com a estrutura de diretórios para o restante do time implementar.
- A raiz do projeto foi ajustada para facilitar deploy na Vercel com `server.js` e `vercel.json`.

## Endpoints Disponíveis Hoje

### API unificada (dashboard)

- `GET /api/unified/cities` - cidades suportadas
- `GET /api/unified/months` - meses da série histórica
- `GET /api/unified/data?city=&month=` - dados ESG + qualidade do ar
- `GET /api/unified/metrics?city=&month=` - KPIs comparativos (mês vs anterior)

### Demais rotas

- `GET /api/health` - health check da API
- `GET /api/metrics` - métricas de sustentabilidade (mock)
- `GET /api/suggestions` - sugestões de otimização ESG (mock)
- `POST /api/chat` - chatbot para consultas ESG (mock)
- `GET /api/air-quality/location/:location` - busca dados de qualidade do ar e métricas ESG por localização
  - Retorna: qualidade do ar (PM2.5, PM10, NO2, O3, CO, SO2, AQI)
  - Inclui: métricas ESG (CO2, energia, água, resíduos, energia renovável, taxa de reciclagem)
  - Calcula: pontuação de sustentabilidade (0-100)
- `GET /api/air-quality/city?city=X&country=Y` - busca dados de qualidade do ar e métricas ESG por cidade
- `POST /api/air-quality` - salva dados de qualidade do ar e métricas ESG no MongoDB
- `GET /api/air-quality/stored/:location` - busca dados de qualidade do ar armazenados no MongoDB

## Executando Localmente

### Requisitos

- Node.js 20 ou superior
- npm

### Instalação

```bash
npm install
```

### Variáveis de ambiente

Crie um arquivo `.env` com base em `.env.example`.

Exemplo:

```env
PORT=3001
CORS_ORIGIN=http://localhost:3000
MONGODB_URI=
```

### Rodando a API

```bash
npm run dev
```

API local:

```text
http://localhost:3001/api
```

## Deploy na Vercel

- A entrada de deploy está configurada na raiz com `server.js`.
- O arquivo `vercel.json` direciona as rotas para a API Express.
- Para usar MongoDB em produção, configure `MONGODB_URI` nas variáveis de ambiente da Vercel.

## Divisão de Responsabilidades

### Tech Lead / API

- Organizar a arquitetura do projeto
- Padronizar estrutura de pastas
- Preparar backend para deploy
- Definir base da API e integração com banco

### Time Frontend

- Implementar telas, componentes e rotas React
- Aplicar Material-UI, Recharts e Context API
- Integrar frontend com a API REST

### Time Backend

- Evoluir controllers, services, models e autenticação JWT
- Integrar MongoDB com Mongoose
- Criar validações e regras de negócio

### Time QA

- Estruturar testes unitários e de integração
- Validar fluxos principais da aplicação
- Apoiar a qualidade do deploy

## Padrão de Commits

Sugestão para manter commits limpos:

- `chore: reorganize backend structure for deployment`
- `chore: add frontend and test folder scaffolding`
- `docs: update readme with architecture and repository structure`
- `chore: add vercel and environment configuration`

## Branch de Trabalho

Branch criada para esta organização:

```text
projeto-estrutura-vercel
```
