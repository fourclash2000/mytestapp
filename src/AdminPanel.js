import React, { useState, useEffect } from 'react';

const QUESTION_TYPES = [
  { value: 'single', label: 'Один вариант' },
  { value: 'multiple', label: 'Несколько вариантов' },
  { value: 'open', label: 'Открытый вопрос' },
];

function AdminPanel({ user }) {
  const [view, setView] = useState('tests'); // 'tests' | 'stats' | 'history'
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([
    { text: '', type: 'single', options: [''] }
  ]);

  // Автоматический расчёт максимального количества баллов
  const getMaxScore = (qs) =>
    qs.reduce((sum, q) => sum + (q.type === 'open' ? 20 : q.type === 'multiple' ? 10 : 5), 0);
  const maxScore = getMaxScore(questions);

  // Сохраняем тест в localStorage
  const handleSaveTest = (e) => {
    e.preventDefault();
    const tests = JSON.parse(localStorage.getItem('tests') || '[]');
    const newTest = {
      id: Date.now(),
      author: user.login,
      shop: user.shop,
      title,
      description,
      questions,
      maxScore,
      createdAt: new Date().toISOString(),
    };
    tests.push(newTest);
    localStorage.setItem('tests', JSON.stringify(tests));
    setCreating(false);
    setTitle('');
    setDescription('');
    setQuestions([{ text: '', type: 'single', options: [''] }]);
    alert('Тест сохранён!');
  };

  // Обработка изменения вопроса
  const handleQuestionChange = (idx, field, value) => {
    setQuestions(
      questions.map((q, i) =>
        i === idx ? { ...q, [field]: value } : q
      )
    );
  };

  // Загрузка изображения для вопроса
  const handleImageChange = (idx, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      setQuestions(
        questions.map((q, i) =>
          i === idx ? { ...q, image: e.target.result } : q
        )
      );
    };
    reader.readAsDataURL(file);
  };

  // Обработка изменения варианта ответа
  const handleOptionChange = (qIdx, oIdx, value) => {
    setQuestions(
      questions.map((q, i) =>
        i === qIdx
          ? { ...q, options: q.options.map((opt, j) => (j === oIdx ? value : opt)) }
          : q
      )
    );
  };

  // Добавить вариант ответа
  const handleAddOption = (qIdx) => {
    setQuestions(
      questions.map((q, i) =>
        i === qIdx ? { ...q, options: [...q.options, ''] } : q
      )
    );
  };

  // Удалить вариант ответа
  const handleRemoveOption = (qIdx, oIdx) => {
    setQuestions(
      questions.map((q, i) =>
        i === qIdx
          ? { ...q, options: q.options.filter((_, j) => j !== oIdx) }
          : q
      )
    );
  };

  // Добавить новый вопрос (после заполнения текущего)
  const handleAddQuestion = () => {
    setQuestions([...questions, { text: '', type: 'single', options: [''] }]);
  };

  // Удалить вопрос
  const handleRemoveQuestion = (idx) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => { setView('tests'); setCreating(false); }} style={{ marginRight: 8 }}>
          Управление тестами
        </button>
        <button onClick={() => { setView('stats'); setCreating(false); }} style={{ marginRight: 8 }}>
          Статистика и баллы
        </button>
        <button onClick={() => { setView('history'); setCreating(false); }}>
          История
        </button>
      </div>
      {view === 'tests' ? (
        <div>
          <h2>Тесты (создание, редактирование, удаление)</h2>
          {!creating ? (
            <div>
              {/* Иллюстрация создания тестов */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2910/2910791.png"
                  alt="Создание тестов"
                  style={{ width: 120, height: 120, objectFit: 'contain', borderRadius: 18, boxShadow: '0 2px 8px 0 rgba(60,72,88,0.10)' }}
                />
              </div>
              <button onClick={() => setCreating(true)} style={{ marginBottom: 16, background: '#43a047', color: '#fff' }}>Создать тест</button>
              {/* Список тестов администратора */}
              <TestList user={user} setCreating={setCreating} setTitle={setTitle} setDescription={setDescription} setQuestions={setQuestions} />
            </div>
          ) : (
            <form onSubmit={handleSaveTest} className="create-test-form">
              {/* Тематическая картинка */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135765.png"
                  alt="Создание теста"
                  style={{ width: 90, height: 90, objectFit: 'contain', borderRadius: 18, boxShadow: '0 2px 8px 0 rgba(60,72,88,0.10)' }}
                />
              </div>
              <h3 style={{ color: '#1a237e', marginBottom: 8 }}>Создание теста</h3>
              <div style={{ marginBottom: 12, color: '#1976d2', fontWeight: 600, fontSize: 18 }}>
                Макс баллов за тест: {maxScore}
              </div>
              <div>
                <label>Название теста:</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="answer-input" style={{ marginBottom: 14 }} />
              </div>
              <div>
                <label>Описание:</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} className="comment-textarea" style={{ marginBottom: 18 }} />
              </div>
              <h4 style={{ color: '#1976d2', marginTop: 18 }}>Вопросы</h4>
              {questions.map((q, idx) => (
                <div key={idx} className="question-card" style={{ background: '#f5faff', border: '1px solid #e3eaf1', borderRadius: 18, marginBottom: 18, boxShadow: '0 1px 4px 0 rgba(60,72,88,0.04)', padding: 18 }}>
                  <b style={{ color: '#1a237e' }}>Вопрос {idx + 1}</b>
                  <div>
                    <label>Текст вопроса:</label>
                    <input type="text" value={q.text} onChange={e => handleQuestionChange(idx, 'text', e.target.value)} required className="answer-input" />
                  </div>
                  <div>
                    <label>Тип вопроса:</label>
                    <select value={q.type} onChange={e => handleQuestionChange(idx, 'type', e.target.value)} className="answer-input" style={{ minHeight: 44 }}>
                      {QUESTION_TYPES.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <label>Картинка к вопросу:</label>
                    <input type="file" accept="image/*" onChange={e => handleImageChange(idx, e.target.files[0])} />
                    {q.image && (
                      <div style={{ marginTop: 6 }}>
                        <img src={q.image} alt="Вопрос" style={{ width: 360, height: 240, objectFit: 'cover', border: '1px solid #ccc', borderRadius: 14 }} />
                      </div>
                    )}
                  </div>
                  {(q.type === 'single' || q.type === 'multiple') && (
                    <div>
                      <label>Варианты ответов:</label>
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                          <input type="text" value={opt} onChange={e => handleOptionChange(idx, oIdx, e.target.value)} required className="answer-input" style={{ marginBottom: 0, flex: 1 }} />
                          <button type="button" onClick={() => handleRemoveOption(idx, oIdx)} style={{ marginLeft: 4 }}>Удалить</button>
                        </div>
                      ))}
                      <button type="button" onClick={() => handleAddOption(idx)}>Добавить вариант</button>
                    </div>
                  )}
                  {questions.length > 1 && (
                    <button type="button" onClick={() => handleRemoveQuestion(idx)} style={{ marginTop: 8, color: 'red' }}>Удалить вопрос</button>
                  )}
                </div>
              ))}
              {/* Кнопка добавить вопрос появляется только если последний вопрос заполнен */}
              {questions[questions.length - 1].text.trim() && (
                <button type="button" onClick={handleAddQuestion} style={{ marginBottom: 16 }}>Добавить вопрос</button>
              )}
              <br />
              <button type="submit" style={{ width: 220, fontSize: '1.15rem', borderRadius: 22 }}>Сохранить тест</button>
              <button type="button" onClick={() => setCreating(false)} style={{ marginLeft: 8 }}>Отмена</button>
            </form>
          )}
        </div>
      ) : view === 'stats' ? (
        <div>
          <h2>Статистика и выставление баллов</h2>
          <ResultsTable />
        </div>
      ) : (
        <div>
          <h2>История прохождения тестов</h2>
          <HistoryTable />
        </div>
      )}
    </div>
  );
}

// Компонент для просмотра и проверки результатов
function ResultsTable() {
  const [results, setResults] = useState([]);
  const [tests, setTests] = useState([]);
  const [editing, setEditing] = useState(null); // id результата для редактирования
  const [questionScores, setQuestionScores] = useState([]); // массив баллов по вопросам
  const [showTest, setShowTest] = useState(null); // {result, test, idx, editMode}
  const [questionComments, setQuestionComments] = useState([]); // массив комментариев по вопросам

  useEffect(() => {
    setResults(JSON.parse(localStorage.getItem('results') || '[]'));
    setTests(JSON.parse(localStorage.getItem('tests') || '[]'));
  }, []);

  const handleSetScore = (resultId, questionCount, commentsArr) => {
    const total = questionScores.slice(0, questionCount).reduce((sum, s) => sum + (Number(s) || 0), 0);
    const newResults = results.map((r, idx) =>
      idx === resultId ? { ...r, score: total, questionScores: questionScores.slice(0, questionCount), questionComments: commentsArr.slice(0, questionCount), checked: true } : r
    );
    setResults(newResults);
    localStorage.setItem('results', JSON.stringify(newResults));
    setEditing(null);
    setQuestionScores([]);
    setShowTest(null);
    setQuestionComments([]);
  };

  // Удаление проверенного результата
  const handleDelete = (idx) => {
    if (!window.confirm('Удалить этот проверенный результат?')) return;
    const newResults = results.filter((_, i) => i !== idx);
    setResults(newResults);
    localStorage.setItem('results', JSON.stringify(newResults));
  };

  if (!results.length) return <div>Нет отправленных тестов</div>;

  if (showTest) {
    const { result, test, idx, editMode } = showTest;
    const getMaxForType = (type) => type === 'open' ? 20 : type === 'multiple' ? 10 : 5;
    return (
      <div style={{ maxWidth: 700, margin: '0 auto', background: '#fff', border: '1px solid #ccc', borderRadius: 8, padding: 24 }}>
        <div style={{ color: '#1976d2', fontWeight: 600, fontSize: 18, marginBottom: 8 }}>
          Макс баллов за тест: {test.maxScore || test.questions.reduce((sum, q) => sum + getMaxForType(q.type), 0)}
        </div>
        <h3>{editMode ? 'Редактирование результата' : 'Проверка теста'}: <span style={{ color: '#555' }}>{test.title}</span></h3>
        <div style={{ marginBottom: 16 }}><b>Сотрудник:</b> {result.user}</div>
        <ol>
          {test.questions.map((q, qIdx) => (
            <li key={qIdx} style={{ marginBottom: 18 }}>
              <div><b>{q.text}</b></div>
              {q.image && (
                <div style={{ margin: '8px 0' }}>
                  <img src={q.image} alt="Вопрос" style={{ width: 360, height: 240, objectFit: 'cover', border: '1px solid #ccc', borderRadius: 14 }} />
                </div>
              )}
              <div style={{ margin: '6px 0 8px 0' }}>
                <span style={{ color: '#555' }}>Ответ: </span>
                <span>{q.type === 'multiple'
                  ? (Array.isArray(result.answers[qIdx]) ? result.answers[qIdx].join(', ') : '')
                  : result.answers[qIdx]}</span>
              </div>
              <div>
                <label>Баллы за вопрос (макс. {getMaxForType(q.type)}): </label>
                <input
                  type="number"
                  min="0"
                  max={getMaxForType(q.type)}
                  className="score-input"
                  value={questionScores[qIdx] || ''}
                  onChange={e => {
                    let val = e.target.value;
                    const max = getMaxForType(q.type);
                    if (val !== '' && Number(val) > max) val = max;
                    const arr = [...questionScores];
                    arr[qIdx] = val;
                    setQuestionScores(arr);
                  }}
                />
              </div>
              <div style={{ marginTop: 8 }}>
                <label>Пояснение/Комментарий:</label>
                <textarea
                  className="comment-textarea"
                  value={questionComments[qIdx] || ''}
                  onChange={e => {
                    const arr = [...questionComments];
                    arr[qIdx] = e.target.value;
                    setQuestionComments(arr);
                  }}
                  placeholder="Пояснение по этому вопросу..."
                  style={{ minHeight: 40 }}
                />
              </div>
            </li>
          ))}
        </ol>
        <div style={{ margin: '16px 0' }}>
          <b>Сумма баллов: </b>
          {questionScores.slice(0, test.questions.length).reduce((sum, s) => sum + (Number(s) || 0), 0)}
        </div>
        <button onClick={() => handleSetScore(idx, test.questions.length, questionComments)} disabled={questionScores.slice(0, test.questions.length).some(s => s === undefined || s === '')}>Сохранить</button>
        <button onClick={() => { setShowTest(null); setEditing(null); setQuestionScores([]); setQuestionComments([]); }} style={{ marginLeft: 12 }}>Отмена</button>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table border="1" cellPadding={6} style={{ width: '100%', marginTop: 16, borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Сотрудник</th>
            <th>Тест</th>
            <th>Баллы</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, idx) => {
            const test = tests.find(t => t.id === r.testId);
            return (
              <tr key={idx} style={{ background: r.checked ? '#eaffea' : '#fff' }}>
                <td>{r.user}</td>
                <td>{test ? test.title : 'Тест удалён'}</td>
                <td style={{ textAlign: 'center' }}>{r.checked ? r.score : '—'}</td>
                <td>
                  <span style={{
                    color: r.checked ? '#2e7d32' : '#d32f2f',
                    fontWeight: 600
                  }}>
                    {r.checked ? 'Проверено' : 'Ожидает проверки'}
                  </span>
                </td>
                <td>
                  {r.checked ? (
                    <>
                      <button style={{ background: '#1976d2', color: '#fff' }} onClick={() => {
                        setShowTest({ result: r, test, idx, editMode: true });
                        setQuestionScores(r.questionScores || Array(test ? test.questions.length : 0).fill(''));
                        setQuestionComments(r.questionComments || Array(test ? test.questions.length : 0).fill(''));
                      }}>Редактировать</button>
                      <button style={{ marginLeft: 8, background: '#e53935', color: '#fff' }} onClick={() => handleDelete(idx)}>Удалить</button>
                    </>
                  ) : (
                    <button onClick={() => { setShowTest({ result: r, test, idx, editMode: false }); setQuestionScores(Array(test ? test.questions.length : 0).fill('')); setQuestionComments(Array(test ? test.questions.length : 0).fill('')); }}>Проверить</button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ margin: '32px 0 0 0', textAlign: 'right' }}>
        <button style={{ background: '#b71c1c', color: '#fff', fontWeight: 700, padding: '12px 32px', borderRadius: '22px' }}
          onClick={() => {
            if (window.confirm('Удалить все результаты тестов? Это действие необратимо!')) {
              setResults([]);
              localStorage.removeItem('results');
            }
          }}>
          Удалить все тесты
        </button>
      </div>
    </div>
  );
}

// Таблица истории прохождения тестов
function HistoryTable() {
  const [results, setResults] = useState([]);
  const [tests, setTests] = useState([]);
  const [showDetail, setShowDetail] = useState(null); // результат для подробного просмотра

  useEffect(() => {
    setResults(JSON.parse(localStorage.getItem('results') || '[]'));
    setTests(JSON.parse(localStorage.getItem('tests') || '[]'));
  }, []);

  const handleClear = () => {
    if (window.confirm('Вы уверены, что хотите очистить всю историю?')) {
      localStorage.removeItem('results');
      setResults([]);
    }
  };

  if (!results.length) return <div style={{ color: '#888', marginTop: 12 }}>Нет пройденных тестов</div>;

  return (
    <div style={{ overflowX: 'auto' }}>
      <button onClick={handleClear} style={{ marginBottom: 16, background: '#e53935', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}>
        Очистить историю
      </button>
      <table border="1" cellPadding={6} style={{ width: '100%', marginTop: 0, borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Сотрудник</th>
            <th>Тест</th>
            <th>Дата</th>
            <th>Баллы</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, idx) => {
            const test = tests.find(t => t.id === r.testId);
            return (
              <tr key={idx}>
                <td>{r.user}</td>
                <td>{test ? test.title : 'Тест удалён'}</td>
                <td>{test ? new Date(test.createdAt).toLocaleString() : ''}</td>
                <td>{typeof r.score === 'number' ? `${r.score} из ${test && test.maxScore ? test.maxScore : ''}` : '—'}</td>
                <td>
                  <button onClick={() => setShowDetail({ result: r, test })}>Подробнее</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {showDetail && (
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px 0 rgba(60,72,88,0.10)', padding: 28, margin: '32px auto', maxWidth: 700 }}>
          <h3>Ответы сотрудника: {showDetail.result.user}</h3>
          <div style={{ marginBottom: 12, color: '#1976d2', fontWeight: 600 }}>
            Тест: {showDetail.test ? showDetail.test.title : 'Тест удалён'}
          </div>
          <div style={{ marginBottom: 12 }}>
            Баллы: <b>{showDetail.result.score}</b> из <b>{showDetail.test && showDetail.test.maxScore ? showDetail.test.maxScore : ''}</b>
          </div>
          <ol style={{ margin: '0 auto', maxWidth: 500 }}>
            {showDetail.test && showDetail.test.questions.map((q, i) => (
              <li key={i} style={{ marginBottom: 18 }}>
                <div style={{ fontWeight: 600, color: '#222' }}>{q.text}</div>
                <div style={{ margin: '4px 0 0 0' }}><b>Ответ:</b> {typeof showDetail.result.answers[i] === 'string' ? showDetail.result.answers[i] : Array.isArray(showDetail.result.answers[i]) ? showDetail.result.answers[i].join(', ') : JSON.stringify(showDetail.result.answers[i])}</div>
                {showDetail.result.questionComments && showDetail.result.questionComments[i] && (
                  <div style={{ margin: '4px 0 0 0', color: '#b71c1c', fontStyle: 'italic', fontSize: '1em' }}><b>Пояснение:</b> {showDetail.result.questionComments[i]}</div>
                )}
              </li>
            ))}
          </ol>
          <button onClick={() => setShowDetail(null)} style={{ marginTop: 18 }}>Закрыть</button>
        </div>
      )}
    </div>
  );
}

// Список тестов с кнопками редактирования и повторной отправки
function TestList({ user, setCreating, setTitle, setDescription, setQuestions }) {
  const [tests, setTests] = useState([]);
  useEffect(() => {
    setTests((JSON.parse(localStorage.getItem('tests') || '[]')).filter(t => t.author === user.login && t.shop === user.shop));
  }, [user.login, user.shop]);

  const handleEdit = (test) => {
    setTitle(test.title);
    setDescription(test.description);
    setQuestions(test.questions);
    setCreating(true);
    // При сохранении будет создан новый тест, если нужно редактировать именно этот — потребуется доработать
  };

  const handleResend = (test) => {
    if (!window.confirm('Сделать этот тест новым для сотрудников?')) return;
    // Новый id и дата
    const newId = Date.now();
    const updatedTest = { ...test, id: newId, createdAt: new Date().toISOString() };
    // Заменяем тест в базе
    const allTests = JSON.parse(localStorage.getItem('tests') || '[]');
    const newTests = allTests.map(t => t.id === test.id ? updatedTest : t);
    localStorage.setItem('tests', JSON.stringify(newTests));
    // Удаляем все результаты по этому тесту
    const results = JSON.parse(localStorage.getItem('results') || '[]');
    const newResults = results.filter(r => r.testId !== test.id);
    localStorage.setItem('results', JSON.stringify(newResults));
    setTests(newTests.filter(t => t.author === user.login && t.shop === user.shop));
    alert('Тест отправлен сотрудникам повторно!');
  };

  const handleDeleteTest = (test) => {
    if (!window.confirm('Удалить этот тест и все связанные с ним результаты?')) return;
    // Удаляем тест из базы
    const allTests = JSON.parse(localStorage.getItem('tests') || '[]');
    const newTests = allTests.filter(t => t.id !== test.id);
    localStorage.setItem('tests', JSON.stringify(newTests));
    // Удаляем все результаты по этому тесту
    const results = JSON.parse(localStorage.getItem('results') || '[]');
    const newResults = results.filter(r => r.testId !== test.id);
    localStorage.setItem('results', JSON.stringify(newResults));
    setTests(newTests.filter(t => t.author === user.login && t.shop === user.shop));
    alert('Тест и все связанные результаты удалены!');
  };

  if (!tests.length) return <div style={{ color: '#888', marginTop: 12 }}>Нет созданных тестов</div>;

  return (
    <div style={{ marginTop: 18 }}>
      <h4 style={{ textAlign: 'left', color: '#1976d2' }}>Ваши тесты:</h4>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tests.sort((a, b) => b.id - a.id).map(test => (
          <li key={test.id} style={{ background: '#f5faff', borderRadius: 14, boxShadow: '0 1px 4px 0 rgba(60,72,88,0.04)', padding: '16px 12px', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <b>{test.title}</b>
              <div style={{ fontSize: 13, color: '#888' }}>Создан: {new Date(test.createdAt).toLocaleString()}</div>
            </div>
            <div>
              <button style={{ marginRight: 8 }} onClick={() => handleEdit(test)}>Редактировать</button>
              <button style={{ marginRight: 8, background: '#ff9800', color: '#fff' }} onClick={() => handleResend(test)}>Отправить всем</button>
              <button style={{ background: '#e53935', color: '#fff' }} onClick={() => handleDeleteTest(test)}>Удалить</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPanel; 