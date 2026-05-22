const metrics = require('../data/metrics.data');
const suggestions = require('../data/suggestions.data');
const { generateChatResponse, SYSTEM_INSTRUCTION } = require('./gemini.service');

function buildContextBlock() {
  const suggestionList = suggestions
    .map((item) => `- ${item.title}: ${item.description} (${item.impact})`)
    .join('\n');

  return `
Métricas atuais do sistema:
- Consumo de energia: ${metrics.energyConsumption.current} kWh (redução de ${metrics.energyConsumption.reduction}% vs período anterior)
- Armazenamento digital: ${metrics.digitalStorage.current} GB (redução de ${metrics.digitalStorage.reduction}%)
- Emissões de carbono: ${metrics.carbonEmissions.current} tCO2e (redução de ${metrics.carbonEmissions.reduction}%)

Sugestões cadastradas:
${suggestionList}
`.trim();
}

async function processChatMessage(message = '', history = []) {
  const userMessage = String(message).trim();

  if (!userMessage) {
    return 'Envie uma mensagem para que eu possa ajudar com sua gestão sustentável.';
  }

  const contextBlock = buildContextBlock();
  const prompt = `${contextBlock}\n\nPergunta do usuário: ${userMessage}`;

  return generateChatResponse(prompt, {
    history,
    systemInstruction: `${SYSTEM_INSTRUCTION}\n\nContexto atual do EcoBot:\n${contextBlock}`
  });
}

module.exports = {
  processChatMessage,
  buildContextBlock
};
