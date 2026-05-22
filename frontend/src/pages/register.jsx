import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './register.css';

function Register() {
  const navigate = useNavigate();
  const { registerUser } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      const registerResult = await registerUser({ name, email, password });

      if (!registerResult.success) {
        setError(registerResult.message || 'Falha ao registrar usuário.');
        return;
      }

      setSuccess('Cadastro realizado com sucesso! Redirecionando para login...');
      setTimeout(() => navigate('/login'), 1200);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Falha ao registrar usuário.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-header">
          <img
            src="/logo.png"
            alt="EcoBot Logo"
            className="register-logo"
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirmar Senha</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="form-input"
            />
          </div>

          <button type="submit" className="register-button">
            Cadastrar
          </button>

          {error && <p className="register-error">{error}</p>}
          {success && <p className="register-success">{success}</p>}
        </form>

        <div className="register-footer">
          Já tem conta?{' '}
          <Link to="/login" className="register-link">
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
