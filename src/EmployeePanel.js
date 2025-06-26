import React, { useState, useEffect } from 'react';

function EmployeePanel({ user }) {
  const [test, setTest] = useState(null); // текущий тест для прохождения
  const [answers, setAnswers] = useState([]); // ответы сотрудника
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null); // результат/балл
  const [showFirework, setShowFirework] = useState(false); // для салюта

  // При монтировании ищем только самый новый тест, который сотрудник не проходил
  useEffect(() => {
    setShowFirework(sessionStorage.getItem('showFirework') === 'true');
    sessionStorage.removeItem('showFirework');
    const tests = JSON.parse(localStorage.getItem('tests') || '[]').filter(t => t.shop === user.shop);
    const results = JSON.parse(localStorage.getItem('results') || '[]');
    if (tests.length === 0) {
      setTest(null);
      setAnswers([]);
      setResult(null);
      return;
    }
    // Находим самый новый тест (по максимальному id)
    const newestTest = tests.reduce((a, b) => (a.id > b.id ? a : b));
    const hasPassed = results.some(r => r.testId === newestTest.id && r.user === user.login);
    if (!hasPassed) {
      setTest(newestTest);
      setAnswers(Array(newestTest.questions.length).fill(''));
      setResult(null);
    } else {
      setTest(null);
      setAnswers([]);
      setResult(results.find(r => r.testId === newestTest.id && r.user === user.login) || null);
    }
    setSubmitted(false);
  }, [user.login, user.shop]);

  if (!test && !result) {
    return <div style={{ maxWidth: 600, margin: '40px auto', textAlign: 'center' }}><h2>Нет доступных тестов для прохождения</h2></div>;
  }

  if (result) {
    const test = JSON.parse(localStorage.getItem('tests') || '[]').find(t => t.id === result.testId);
    return (
      <div style={{ maxWidth: 600, margin: '40px auto', textAlign: 'center' }}>
        <div style={{ background: '#fff', borderRadius: 22, boxShadow: '0 2px 16px 0 rgba(60,72,88,0.10)', padding: '32px 24px', margin: '0 auto' }}>
          {/* Тематическая картинка */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
              alt="Результат теста"
              style={{ width: 90, height: 90, objectFit: 'contain', borderRadius: 18, boxShadow: '0 2px 8px 0 rgba(60,72,88,0.10)' }}
            />
          </div>
          {showFirework && (
            <div style={{ marginBottom: 18 }}>
              <img src="https://cdn-icons-png.flaticon.com/512/616/616490.png" alt="Салют" style={{ width: 90, height: 90, borderRadius: 18, boxShadow: '0 2px 8px 0 rgba(60,72,88,0.10)' }} />
            </div>
          )}
          <h2 style={{ color: '#1a237e', marginBottom: 8 }}>Ваш результат</h2>
          {typeof result.score === 'number' ? (
            <div style={{ fontSize: 26, margin: 16, color: '#1976d2' }}>Баллы: <b>{result.score}</b> из <b>{test && test.maxScore ? test.maxScore : ''}</b></div>
          ) : (
            <div style={{ fontSize: 18, margin: 16 }}>Ожидает проверки администратором</div>
          )}
          <div style={{ marginTop: 24, textAlign: 'left' }}>
            <ol style={{ margin: '0 auto', maxWidth: 500 }}>
              {test && test.questions.map((q, i) => (
                <li key={i} style={{ marginBottom: 18 }}>
                  <div style={{ fontWeight: 600, color: '#222' }}>{q.text}</div>
                  <div style={{ margin: '4px 0 0 0' }}><b>Ответ:</b> {typeof result.answers[i] === 'string' ? result.answers[i] : Array.isArray(result.answers[i]) ? result.answers[i].join(', ') : JSON.stringify(result.answers[i])}</div>
                  {result.questionComments && result.questionComments[i] && (
                    <div style={{ margin: '4px 0 0 0', color: '#b71c1c', fontStyle: 'italic', fontSize: '1em' }}><b>Пояснение:</b> {result.questionComments[i]}</div>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    );
  }

  // Обработка изменения ответа
  const handleAnswerChange = (idx, value) => {
    setAnswers(answers.map((a, i) => (i === idx ? value : a)));
  };
  const handleMultiAnswerChange = (idx, option) => {
    const arr = Array.isArray(answers[idx]) ? answers[idx] : [];
    setAnswers(answers.map((a, i) =>
      i === idx
        ? arr.includes(option)
          ? arr.filter(o => o !== option)
          : [...arr, option]
        : a
    ));
  };

  // Отправка теста
  const handleSubmit = (e) => {
    e.preventDefault();
    const results = JSON.parse(localStorage.getItem('results') || '[]');
    results.push({
      testId: test.id,
      user: user.login,
      answers,
      score: null, // выставит админ
      checked: false,
    });
    localStorage.setItem('results', JSON.stringify(results));
    setSubmitted(true);
    setTest(null);
    setResult({ answers, score: null });
    setShowFirework(true);
    sessionStorage.setItem('showFirework', 'true');
  };

  if (test && !submitted) {
    return (
      <div style={{ maxWidth: 700, margin: '40px auto' }}>
        {/* Тематическая картинка */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135765.png"
            alt="Прохождение теста"
            style={{ width: 90, height: 90, objectFit: 'contain', borderRadius: 18, boxShadow: '0 2px 8px 0 rgba(60,72,88,0.10)' }}
          />
        </div>
        <h2 style={{ color: '#1a237e', marginBottom: 8 }}>{test.title}</h2>
        {test.description && <div style={{ marginBottom: 16, color: '#444' }}>{test.description}</div>}
        <div style={{ marginBottom: 18, color: '#1976d2', fontWeight: 600 }}>Макс баллов {test.maxScore || 100}</div>
        <form onSubmit={handleSubmit}>
          {test.questions.map((q, idx) => (
            <div key={idx} className="question-card" style={{ border: '1px solid #e3eaf1', borderRadius: 18, marginBottom: 18, background: '#fff', boxShadow: '0 2px 8px 0 rgba(60,72,88,0.07)', padding: 18 }}>
              <b style={{ color: '#1a237e' }}>Вопрос {idx + 1}:</b> <span style={{ fontWeight: 500 }}>{q.text}</span>
              {q.image && (
                <div style={{ margin: '12px 0' }}>
                  <img src={q.image} alt="Вопрос" style={{ width: 360, height: 240, objectFit: 'cover', border: '1px solid #ccc', borderRadius: 14 }} />
                </div>
              )}
              <div style={{ marginTop: 12 }}>
                {q.type === 'single' && (
                  q.options.map((opt, oIdx) => (
                    <div key={oIdx} style={{ marginBottom: 8 }}>
                      <label style={{ fontSize: '1.08rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input
                          type="radio"
                          name={`q${idx}`}
                          value={opt}
                          checked={answers[idx] === opt}
                          onChange={() => handleAnswerChange(idx, opt)}
                          required
                          style={{ width: 22, height: 22, accentColor: '#1976d2', marginRight: 8 }}
                        /> {opt}
                      </label>
                    </div>
                  ))
                )}
                {q.type === 'multiple' && (
                  q.options.map((opt, oIdx) => (
                    <div key={oIdx} style={{ marginBottom: 8 }}>
                      <label style={{ fontSize: '1.08rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input
                          type="checkbox"
                          value={opt}
                          checked={Array.isArray(answers[idx]) && answers[idx].includes(opt)}
                          onChange={() => handleMultiAnswerChange(idx, opt)}
                          style={{ width: 22, height: 22, accentColor: '#1976d2', marginRight: 8 }}
                        /> {opt}
                      </label>
                    </div>
                  ))
                )}
                {q.type === 'open' && (
                  <input
                    type="text"
                    value={answers[idx] || ''}
                    onChange={e => handleAnswerChange(idx, e.target.value)}
                    required
                    className="answer-input"
                  />
                )}
              </div>
            </div>
          ))}
          <button type="submit" style={{ marginTop: 16, width: 220, fontSize: '1.15rem', borderRadius: 22 }}>Отправить ответы</button>
        </form>
      </div>
    );
  }

  if (!test && !result && submitted) {
    // После отправки теста, до обновления страницы
    return (
      <div style={{ maxWidth: 600, margin: '40px auto', textAlign: 'center' }}>
        <div className="card">
          {showFirework && (
            <div style={{ marginBottom: 18 }}>
              <img src="https://cdn-icons-png.flaticon.com/512/616/616490.png" alt="Салют" style={{ width: 90, height: 90, borderRadius: 18, boxShadow: '0 2px 8px 0 rgba(60,72,88,0.10)' }} />
            </div>
          )}
          <h2 style={{ color: '#1a237e', marginBottom: 8 }}>Ваш результат</h2>
          <div>Тест успешно отправлен!</div>
        </div>
      </div>
    );
  }

  return null;
}

export default EmployeePanel; 