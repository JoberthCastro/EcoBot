import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';
import './settings.css';

function Settings() {
  const navigate = useNavigate();
  const {
    theme,
    notifications,
    language,
    user,
    saveProfile,
    saveSettings,
    logout,
  } = useApp();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || '',
    avatar: user?.avatar || '/logo.png'
  });
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');

  useEffect(() => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || '',
      avatar: user?.avatar || '/logo.png'
    });
  }, [user]);

  const handleProfileSave = async () => {
    setProfileMessage('');
    setProfileError('');
    try {
      await saveProfile(profileData);
      setProfileMessage('Perfil atualizado com sucesso.');
    } catch (error) {
      setProfileError(error?.response?.data?.message || 'Falha ao salvar perfil.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleThemeToggle = async () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    await saveSettings({
      nextTheme,
      nextNotifications: notifications,
      nextLanguage: language
    });
  };

  const handleNotificationsToggle = async () => {
    await saveSettings({
      nextTheme: theme,
      nextNotifications: !notifications,
      nextLanguage: language
    });
  };

  const handleLanguageChange = async (nextLanguage) => {
    await saveSettings({
      nextTheme: theme,
      nextNotifications: notifications,
      nextLanguage
    });
  };

  const clearData = () => {
    if (confirm('Tem certeza que deseja limpar todos os dados locais?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <Layout title="Configurações">
      <div className="settings-container">
        <div className="settings-card profile-settings-card">
          <h3 className="card-title">Perfil da Conta</h3>

          <div className="profile-grid">
            <div className="form-group">
              <label className="form-label">Nome</label>
              <input
                className="form-input"
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Função</label>
              <input
                className="form-input"
                value={profileData.role}
                onChange={(e) => setProfileData(prev => ({ ...prev, role: e.target.value }))}
              />
            </div>
          </div>

          {profileMessage && <p className="profile-feedback success">{profileMessage}</p>}
          {profileError && <p className="profile-feedback error">{profileError}</p>}

          <div className="profile-actions-row">
            <button className="profile-save-btn" onClick={handleProfileSave}>
              Salvar Perfil
            </button>
            <button className="profile-logout-btn" onClick={handleLogout}>
              Sair da Conta
            </button>
          </div>
        </div>

        <div className="settings-card">
          <h3 className="card-title">Aparência</h3>
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Tema Escuro</span>
              <span className="setting-desc">Alternar entre claro e escuro</span>
            </div>
            <button
              className={`toggle-btn ${theme === 'dark' ? 'active' : ''}`}
              onClick={handleThemeToggle}
            >
              <span className="toggle-slider"></span>
            </button>
          </div>
        </div>

        <div className="settings-card">
          <h3 className="card-title">Notificações</h3>
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Ativar Notificações</span>
              <span className="setting-desc">Receber alertas sobre métricas ESG</span>
            </div>
            <button
              className={`toggle-btn ${notifications ? 'active' : ''}`}
              onClick={handleNotificationsToggle}
            >
              <span className="toggle-slider"></span>
            </button>
          </div>
        </div>

        <div className="settings-card">
          <h3 className="card-title">Idioma</h3>
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Idioma do Sistema</span>
              <span className="setting-desc">Selecione o idioma preferido</span>
            </div>
            <select
              className="setting-select"
              value={language}
              onChange={e => handleLanguageChange(e.target.value)}
            >
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US">English (US)</option>
              <option value="es-ES">Español</option>
            </select>
          </div>
        </div>

        <div className="settings-card danger-zone">
          <h3 className="card-title danger-title">Zona de Perigo</h3>
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Limpar Dados Locais</span>
              <span className="setting-desc">Remove todas as preferências salvas</span>
            </div>
            <button className="danger-btn" onClick={clearData}>
              Limpar
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Settings;
