import React, { useState } from 'react';

const QUESTION_TYPES = [
  { value: 'single', label: 'Один вариант' },
  { value: 'multiple', label: 'Несколько вариантов' },
  { value: 'open', label: 'Открытый вопрос' },
];

function TestEditor() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: '',
        type: 'single',
        options: [''],
      },
    ]);
  };

  const handleRemoveQuestion = (idx) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleQuestionChange = (idx, field, value) => {
    setQuestions(
      questions.map((q, i) =>
        i === idx ? { ...q, [field]: value } : q
      )
    );
  };

  const handleOptionChange = (qIdx, oIdx, value) => {
    setQuestions(
      questions.map((q, i) =>
        i === qIdx
          ? { ...q, options: q.options.map((opt, j) => (j === oIdx ? value : opt)) }
          : q
      )
    );
  };

  const handleAddOption = (qIdx) => {
    setQuestions(
      questions.map((q, i) =>
        i === qIdx ? { ...q, options: [...q.options, ''] } : q
      )
    );
  };

  const handleRemoveOption = (qIdx, oIdx) => {
    setQuestions(
      questions.map((q, i) =>
        i === qIdx
          ? { ...q, options: q.options.filter((_, j) => j !== oIdx) }
          : q
      )
    );
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Пока просто выводим результат в консоль
    console.log({ title, description, questions });
    alert('Тест сохранён! (смотрите консоль)');
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h2>Создание/редактирование теста</h2>
      <form onSubmit={handleSave}>
        <div>
          <label>Название теста:</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            style={{ width: '100%', marginBottom: 8 }}
          />
        </div>
        <div>
          <label>Описание:</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{ width: '100%', marginBottom: 16 }}
          />
        </div>
        <h3>Вопросы</h3>
        {questions.map((q, idx) => (
          <div key={idx} style={{ border: '1px solid #ccc', padding: 12, marginBottom: 12 }}>
            <div>
              <label>Текст вопроса:</label>
              <input
                type="text"
                value={q.text}
                onChange={e => handleQuestionChange(idx, 'text', e.target.value)}
                required
                style={{ width: '100%', marginBottom: 8 }}
              />
            </div>
            <div>
              <label>Тип вопроса:</label>
              <select
                value={q.type}
                onChange={e => handleQuestionChange(idx, 'type', e.target.value)}
                style={{ marginBottom: 8 }}
              >
                {QUESTION_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            {(q.type === 'single' || q.type === 'multiple') && (
              <div>
                <label>Варианты ответов:</label>
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                    <input
                      type="text"
                      value={opt}
                      onChange={e => handleOptionChange(idx, oIdx, e.target.value)}
                      required
                      style={{ flex: 1 }}
                    />
                    <button type="button" onClick={() => handleRemoveOption(idx, oIdx)} style={{ marginLeft: 4 }}>Удалить</button>
                  </div>
                ))}
                <button type="button" onClick={() => handleAddOption(idx)}>Добавить вариант</button>
              </div>
            )}
            <button type="button" onClick={() => handleRemoveQuestion(idx)} style={{ marginTop: 8, color: 'red' }}>Удалить вопрос</button>
          </div>
        ))}
        <button type="button" onClick={handleAddQuestion} style={{ marginBottom: 16 }}>Добавить вопрос</button>
        <br />
        <button type="submit">Сохранить тест</button>
      </form>
    </div>
  );
}

export default TestEditor; 