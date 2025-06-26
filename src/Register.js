import React, { useState } from 'react';

function Register({ onSwitchToLogin }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [error, setError] = useState('');
  const [shop, setShop] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    if (!login || !password || !shop) {
      setError('Заполните все поля');
      return;
    }
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.login === login)) {
      setError('Пользователь с таким логином уже существует');
      return;
    }
    users.push({ login, password, role, shop });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Регистрация успешна! Теперь войдите.');
    onSwitchToLogin();
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', border: '1px solid #ccc', padding: 24, borderRadius: 8 }}>
      <h2>Регистрация</h2>
      <form className="register-form" onSubmit={handleRegister}>
        <div>
          <label>Логин:</label>
          <input type="text" value={login} onChange={e => setLogin(e.target.value)} style={{ width: '100%', marginBottom: 8 }} />
        </div>
        <div>
          <label>Пароль:</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', marginBottom: 8 }} />
        </div>
        <div>
          <label>Название магазина:</label>
          <input type="text" value={shop} onChange={e => setShop(e.target.value)} style={{ width: '100%', marginBottom: 8 }} required />
        </div>
        <div>
          <label>Роль:</label>
          <select value={role} onChange={e => setRole(e.target.value)} style={{ width: '100%', marginBottom: 16 }}>
            <option value="employee">Сотрудник</option>
            <option value="admin">Администратор</option>
          </select>
        </div>
        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
        <button type="submit" style={{ width: '100%' }}>Зарегистрироваться</button>
      </form>
      <div style={{ marginTop: 12 }}>
        Уже есть аккаунт?{' '}
        <button type="button" onClick={onSwitchToLogin} style={{ color: 'blue', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Войти</button>
      </div>
    </div>
  );
}

export default Register; 