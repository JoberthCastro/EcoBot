# EcoBot — Guia de Apresentação (Pitch)

**Demo ao vivo:** https://ecobotti.vercel.app  
**Repositório:** https://github.com/WesDevss/EcoBot

---

## O que é o EcoBot?

Plataforma web de **monitoramento ESG** que combina:

- **Qualidade do ar em tempo real** (OpenAQ API v3 — PM2.5, PM10, NO2, O3, CO, SO2)
- **Métricas ambientais derivadas** (CO₂, energia, água, resíduos, renovável, reciclagem)
- **Score de sustentabilidade** (0–100)
- **Histórico mensal** (Jan–Jun) por cidade brasileira
- **Assistente ESG** (chatbot com respostas contextualizadas)
- **Sugestões de otimização** priorizadas por impacto

**Stack:** React + Vite · Node.js + Express · MongoDB · Deploy Vercel

---

## Problema que resolve

Empresas e equipes de sustentabilidade precisam **unificar** dados ambientais dispersos (ar, energia, emissões) em um único painel acionável — sem planilhas manuais nem múltiplas ferramentas.

---

## Proposta de valor (30 segundos)

> "O EcoBot integra dados públicos de qualidade do ar com indicadores ESG operacionais, mostra evolução mensal por cidade e sugere ações de redução de impacto — tudo em uma interface pronta para gestores e apresentações."

---

## Roteiro da demo (5 minutos)

| Tempo | Tela | O que mostrar |
|-------|------|----------------|
| 0:00 | **Login** | Acesso simples; perfil do usuário |
| 0:30 | **Dashboard** | Painel executivo, KPIs, filtros cidade/mês, score ESG |
| 1:30 | **Qualidade do Ar** | AQI, radar, fonte OpenAQ (dados reais) |
| 2:30 | **Histórico ESG** | Tendências Jan–Jun, tabela completa |
| 3:30 | **Chatbot ESG** | Clique nos **prompts rápidos** (energia, CO₂, OpenAQ) |
| 4:30 | **Sugestões** | Ações priorizadas (alta/média) com impacto % |
| 5:00 | **Fechamento** | Botão **Copiar resumo para pitch** no dashboard |

### Cidades sugeridas na demo

- **São Paulo** — maior volume de dados
- **Rio de Janeiro** — boa variação visual no AQI
- **Belo Horizonte** — comparar meses Jan vs Jun

---

## Diferenciais técnicos (para jurados / professores)

1. **API unificada** (`/api/unified/*`) — uma camada que agrega OpenAQ + série temporal ESG
2. **Busca geoespacial** OpenAQ v3 (coordenadas + raio 25 km)
3. **Fallback inteligente** — dados simulados determinísticos se API indisponível
4. **Deploy serverless** na Vercel com MongoDB para usuários e persistência
5. **Frontend reativo** — filtros sincronizados entre KPIs, gráficos e histórico

---

## Arquitetura (slide opcional)

```text
[React Dashboard] → [Express API /api] → [OpenAQ v3] + [MongoDB]
                         ↓
              unified.controller
              openaq.service
```

---

## Requisitos atendidos (README)

| Requisito | Status |
|-----------|--------|
| React + Recharts | ✅ |
| API REST Express | ✅ |
| MongoDB / Mongoose | ✅ |
| OpenAQ v3 + API key | ✅ |
| Testes Jest | ✅ (parcial) |
| JWT autenticação | ⏳ planejado |
| Material-UI | ⏳ CSS customizado |

---

## Frases de impacto para encerrar

- "Transformamos dados ambientais públicos em decisões ESG mensuráveis."
- "De poluente a indicador: PM2.5 vira insight de energia e carbono."
- "Pronto para escalar: novas cidades, alertas e relatórios PDF."

---

## Checklist antes de apresentar

- [ ] `OPENAQ_API_KEY` configurada na Vercel (dados reais)
- [ ] `MONGODB_URI` configurada (login e sugestões)
- [ ] Testar filtro **São Paulo + Jun** no dashboard
- [ ] Abrir **Roteiro da demo** no painel executivo
- [ ] Testar **Copiar resumo para pitch**
- [ ] Ensaiar chatbot com 2 prompts rápidos

---

## Próximos passos (roadmap para slide "futuro")

- Exportação PDF do dashboard
- Alertas por e-mail quando AQI > limite
- JWT e perfis por empresa
- Comparativo entre cidades lado a lado
