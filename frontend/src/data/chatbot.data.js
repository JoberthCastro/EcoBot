const chatResponses = {
  'energia': 'Para reduzir o consumo de energia, recomendo: instalar painéis solares, usar iluminação LED, e otimizar o uso de ar-condicionado. Pequenas mudanças podem reduzir o consumo em até 30%.',
  'sustentabilidade': 'A sustentabilidade envolve práticas que atendem às necessidades atuais sem comprometer as gerações futuras. No contexto ESG, isso inclui gestão ambiental, responsabilidade social e governança corporativa.',
  'esg': 'ESG significa Environmental, Social e Governance. É um conjunto de critérios para avaliar o desempenho de empresas em sustentabilidade ambiental, responsabilidade social e governança corporativa.',
  'co2': 'Para reduzir emissões de CO2, considere: transição para energia renovável, otimização de processos industriais, uso de transporte público ou veículos elétricos, e compensação de carbono.',
  'água': 'Para economizar água: instale sensores de vazamento, use torneiras automáticas, reutilize água da chuva para irrigação, e promova conscientização sobre consumo.',
  'reciclagem': 'A reciclagem reduz o impacto ambiental dos resíduos. Implemente coleta seletiva, eduque funcionários, e parceire com empresas especializadas em reciclagem.',
  'resíduos': 'Para gestão de resíduos: reduza na fonte, reutilize materiais, recicle o máximo possível, e descarte corretamente o que não pode ser reciclado.',
  'renovável': 'Energias renováveis incluem solar, eólica, hidrelétrica, biomassa e geotérmica. São fontes inesgotáveis e causam menos impacto ambiental que combustíveis fósseis.',
  'score': 'O Score de Sustentabilidade é calculado com base em métricas de CO2, energia, água, resíduos, uso de energia renovável e taxa de reciclagem. Quanto maior o score, melhor o desempenho ESG.',
  'default': 'Sou o EcoBot, especialista em sustentabilidade e ESG. Posso ajudar com dúvidas sobre energia, água, resíduos, reciclagem, emissões de CO2 e muito mais. Como posso ajudar?'
};

function getChatResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  for (const [key, response] of Object.entries(chatResponses)) {
    if (key !== 'default' && lowerMessage.includes(key)) {
      return response;
    }
  }
  
  return chatResponses.default;
}

export { getChatResponse };
