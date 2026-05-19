function processChatMessage(message = '') {
  const normalizedMessage = String(message).toLowerCase().trim();

  if (/consumo|energia|kwh/.test(normalizedMessage)) {
    return 'O consumo de energia é derivado do índice de qualidade do ar e das métricas ESG da cidade. No dashboard, compare o mês atual com o anterior para ver se houve redução ou aumento percentual.';
  }

  if (/co2|carbono|emiss/.test(normalizedMessage)) {
    return 'As emissões de CO₂ são calculadas com base no AQI e nos poluentes monitorados (OpenAQ). Valores menores indicam melhor desempenho ambiental — acompanhe o card de emissões e o histórico ESG.';
  }

  if (/openaq|qualidade|ar|aqi|poluente/.test(normalizedMessage)) {
    return 'Integramos a OpenAQ API v3 para PM2.5, PM10, NO2, O3, CO e SO2. Na tela Qualidade do Ar você vê o AQI, radar de poluentes e a fonte dos dados (real ou simulado).';
  }

  if (/sugest|otimiz|melhoria|reduz/.test(normalizedMessage)) {
    return 'Na seção de Sugestões de Otimização ESG listamos ações priorizadas (alta, média, baixa) com impacto estimado em energia, CO₂ e operação digital.';
  }

  if (/score|sustentab|esg|índice|indice/.test(normalizedMessage)) {
    return 'O score de sustentabilidade (0–100) combina qualidade do ar, energia renovável, reciclagem e penalidade de CO₂. Quanto maior, melhor o posicionamento ESG da operação na cidade selecionada.';
  }

  if (/histórico|historico|evolu|tendência|tendencia/.test(normalizedMessage)) {
    return 'O Histórico ESG mostra a evolução de Jan a Jun para CO₂, energia, água, resíduos, renovável e reciclagem — ideal para demonstrar tendência em apresentações.';
  }

  if (/olá|ola|oi|ajuda|help/.test(normalizedMessage)) {
    return 'Olá! Sou o EcoBot. Pergunte sobre consumo de energia, emissões de CO₂, qualidade do ar (OpenAQ), score ESG ou sugestões de melhoria.';
  }

  return 'Posso ajudar com métricas ESG, qualidade do ar (OpenAQ), score de sustentabilidade e sugestões de otimização. Experimente: "Como está o consumo de energia?" ou "O que é o score ESG?"';
}

module.exports = {
  processChatMessage,
};
