import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';
import './profile.css';

function Profile() {
  const navigate = useNavigate();
  const { user, saveProfile, logout } = useApp();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleSave = async () => {
    setError('');
    try {
      await saveProfile({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        avatar: formData.avatar
      });
      setEditing(false);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Falha ao salvar perfil.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const stats = [
    { label: 'Dashboards Visualizados', value: '156' },
    { label: 'Análises Realizadas', value: '42' },
    { label: 'Score Médio ESG', value: '78.5' },
    { label: 'Dias de Uso', value: '30' },
  ];

  return (
    <Layout title="Perfil">
      <div className="profile-container">
        <div className="profile-card profile-header">
          <div className="profile-avatar-section">
            <img src={user.avatar} alt="Avatar" className="profile-avatar" />
            <div className="profile-info">
              <h2 className="profile-name">{user.name}</h2>
              <p className="profile-role">{user.role}</p>
              <p className="profile-email">{user.email}</p>
              <p className="profile-date">Membro desde {user.joinedDate}</p>
            </div>
          </div>
          <div className="profile-actions">
            <button
              className="profile-edit-btn"
              onClick={() => editing ? handleSave() : setEditing(true)}
            >
              {editing ? 'Salvar' : 'Editar'}
            </button>
            <button
              className="profile-logout-btn"
              onClick={handleLogout}
            >
              Deslogar
            </button>
          </div>
        </div>

        {editing && (
          <div className="profile-card profile-edit-form">
            <h3 className="card-title">Editar Perfil</h3>
            {error && <p className="register-error">{error}</p>}
            <div className="form-group">
              <label className="form-label">Nome</label>
              <input
                className="form-input"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Função</label>
              <input
                className="form-input"
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
              />
            </div>
          </div>
        )}

        <div className="profile-card">
          <h3 className="card-title">Estatísticas</h3>
          <div className="profile-stats">
            {stats.map(stat => (
              <div key={stat.label} className="stat-item">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-card">
          <h3 className="card-title">Atividade Recente</h3>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-dot" style={{ background: '#22c55e' }}></span>
              <span className="activity-text">Visualizou Dashboard - hoje, 14:30</span>
            </div>
            <div className="activity-item">
              <span className="activity-dot" style={{ background: '#3b82f6' }}></span>
              <span className="activity-text">Consultou Qualidade do Ar - ontem, 10:15</span>
            </div>
            <div className="activity-item">
              <span className="activity-dot" style={{ background: '#f97316' }}></span>
              <span className="activity-text">Usou Chatbot ESG - 2 dias atrás</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;
