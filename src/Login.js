import React, { useState } from 'react';

function Login({ onLogin, onSwitchToRegister }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.login === login && u.password === password);
    if (!user) {
      setError('Неверный логин или пароль');
      return;
    }
    onLogin(user);
  };

  return (
    <div className="auth-container">
      <h2>Вход</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <div>
          <label>Логин:</label>
          <input type="text" value={login} onChange={e => setLogin(e.target.value)} style={{ width: '100%', marginBottom: 8 }} />
        </div>
        <div>
          <label>Пароль:</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', marginBottom: 16 }} />
        </div>
        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
        <button type="submit" style={{ width: '100%' }}>Войти</button>
      </form>
      <div style={{ marginTop: 12 }}>
        Нет аккаунта?{' '}
        <button type="button" onClick={onSwitchToRegister} style={{ color: 'blue', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Зарегистрироваться</button>
      </div>
    </div>
  );
}

export default Login; 