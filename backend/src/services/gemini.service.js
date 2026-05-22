const { GoogleGenerativeAI } = require('@google/generative-ai');
const AppError = require('../utils/AppError');
const { geminiApiKey, geminiModel } = require('../config/env');

const SYSTEM_INSTRUCTION = `Você é o EcoBot, assistente virtual de um sistema de gestão sustentável e ESG.
Ajude usuários com consumo de energia, emissões de carbono, qualidade do ar, métricas ESG, sugestões de otimização e boas práticas ambientais.
Responda sempre em português do Brasil, de forma clara, objetiva e amigável.
Se não souber algo com certeza, diga isso em vez de inventar dados.
Quando citar números do contexto fornecido, use apenas os valores presentes nesse contexto.`;

let client;

function getClient() {
  if (!geminiApiKey) {
    return null;
  }

  if (!client) {
    client = new GoogleGenerativeAI(geminiApiKey);
  }

  return client;
}

function toGeminiHistory(history = []) {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter((entry) => entry?.role && entry?.content)
    .map((entry) => ({
      role: entry.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(entry.content) }]
    }));
}

async function generateChatResponse(userMessage, options = {}) {
  const genAI = getClient();

  if (!genAI) {
    throw new AppError(
      'Serviço de IA não configurado. Defina GEMINI_API_KEY no arquivo .env.',
      503
    );
  }

  const model = genAI.getGenerativeModel({
    model: geminiModel,
    systemInstruction: options.systemInstruction || SYSTEM_INSTRUCTION
  });

  const chat = model.startChat({
    history: toGeminiHistory(options.history)
  });

  try {
    const result = await chat.sendMessage(String(userMessage));
    const text = result?.response?.text();

    if (!text?.trim()) {
      throw new AppError('A IA não retornou uma resposta válida.', 502);
    }

    return text.trim();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    const status = error?.status || error?.statusCode;
    const apiMessage = error?.message || 'Erro ao comunicar com o Gemini';

    if (status === 429) {
      throw new AppError('Limite de requisições da API Gemini atingido. Tente novamente em instantes.', 429);
    }

    if (status === 401 || status === 403) {
      throw new AppError('Chave da API Gemini inválida ou sem permissão.', 502);
    }

    throw new AppError(apiMessage, 502);
  }
}

module.exports = {
  generateChatResponse,
  SYSTEM_INSTRUCTION
};
