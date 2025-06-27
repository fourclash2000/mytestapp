import React, { useState, useEffect } from 'react';
import './App.css';
import './index.css';
import Login from './Login';
import Register from './Register';
import AdminPanel from './AdminPanel';
import EmployeePanel from './EmployeePanel';

function App() {
  // При инициализации пробуем взять user из localStorage
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [page, setPage] = useState(() => (localStorage.getItem('user') ? 'main' : 'login'));

  useEffect(() => {
    // Если user меняется, обновляем localStorage
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const handleLogin = (user) => {
    setUser(user);
    setPage('main');
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setUser(null);
    setPage('login');
    localStorage.removeItem('user');
  };

  return (
    <div className="App">
      {user && page === 'main' ? (
        <div>
          <div style={{ textAlign: 'right', margin: 8 }}>
            {user.role === 'admin' ? 'Администратор' : 'Сотрудник'}: <b>{user.login}</b>
            <span style={{ marginLeft: 18, color: '#1976d2', fontWeight: 500 }}>Магазин: <b>{user.shop}</b></span>
            <button onClick={handleLogout} style={{ marginLeft: 12 }}>Выйти</button>
          </div>
          {user.role === 'admin' ? (
            <AdminPanel user={user} />
          ) : (
            <EmployeePanel user={user} />
          )}
        </div>
      ) : page === 'register' ? (
        <Register onSwitchToLogin={() => setPage('login')} />
      ) : (
        <Login onLogin={handleLogin} onSwitchToRegister={() => setPage('register')} />
      )}
    </div>
  );
}

export default App;
