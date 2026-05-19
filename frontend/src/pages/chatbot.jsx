import React, { useState } from 'react';
import Layout from '../components/Layout';
import { sendChatMessage } from '../services/chatApi';
import './chatbot.css';

const QUICK_PROMPTS = [
  'Como está o consumo de energia?',
  'Explique as emissões de CO2',
  'O que monitoramos na OpenAQ?',
  'Como funciona o score ESG?',
  'Quais sugestões de otimização?',
];

function Chatbot() {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Olá! Sou o EcoBot. Como posso ajudar com suas dúvidas sobre sustentabilidade e ESG?', sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const submitMessage = async (text) => {
    const trimmed = String(text || '').trim();
    if (!trimmed || loading) return;

    const userMessage = { id: Date.now(), text: trimmed, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { response } = await sendChatMessage(trimmed);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: response,
        sender: 'bot',
      }]);
    } catch (requestError) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: requestError?.response?.data?.message || 'Não foi possível responder agora. Tente novamente.',
        sender: 'bot',
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitMessage(input);
  };

  return (
    <Layout title="Chatbot ESG">
      <div className="chatbot-container">
        <p className="chatbot-pitch-intro">
          Assistente ESG integrado ao painel — ideal para demonstrar suporte à decisão em tempo real.
        </p>
        <div className="chat-quick-prompts">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              className="chat-quick-btn"
              onClick={() => submitMessage(prompt)}
              disabled={loading}
            >
              {prompt}
            </button>
          ))}
        </div>
        <div className="chat-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`chat-message ${msg.sender}`}>
              <div className="chat-bubble">{msg.text}</div>
            </div>
          ))}
          {loading && (
            <div className="chat-message bot">
              <div className="chat-bubble loading">Digitando...</div>
            </div>
          )}
        </div>

        <form className="chat-input-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Digite sua pergunta sobre sustentabilidade..."
            className="chat-input"
          />
          <button type="submit" className="chat-send-button" disabled={loading}>
            Enviar
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default Chatbot;
