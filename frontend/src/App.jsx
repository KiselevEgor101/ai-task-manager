import { useEffect, useState } from 'react'
import './App.css'

const API_URL = '/api/tasks'

const STATUS_LABELS = {
  new: 'Новая',
  in_progress: 'В работе',
  done: 'Выполнена',
}

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadTasks = async () => {
    const response = await fetch(API_URL)
    if (!response.ok) {
      throw new Error('Не удалось загрузить задачи')
    }
    return response.json()
  }

  useEffect(() => {
    loadTasks()
      .then(setTasks)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async (event) => {
    event.preventDefault()
    setError('')

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Не удалось создать задачу')
      }

      setTitle('')
      setDescription('')
      setTasks(await loadTasks())
    } catch (err) {
      setError(err.message)
    }
  }

  const handleStatusChange = async (id, status) => {
    setError('')

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Не удалось обновить статус')
      }

      setTasks(await loadTasks())
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    setError('')

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Не удалось удалить задачу')
      }

      setTasks(await loadTasks())
    } catch (err) {
      setError(err.message)
    }
  }

  const formatDate = (value) => {
    return new Date(value).toLocaleString('ru-RU')
  }

  return (
    <div className="app">
      <header className="header">
        <h1>AI Task Manager</h1>
        <p>Управление задачами — уровень Junior</p>
      </header>

      <section className="card">
        <h2>Создать задачу</h2>
        <form className="task-form" onSubmit={handleCreate}>
          <label>
            Название
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Изучить React"
              required
            />
          </label>
          <label>
            Описание
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Пройти базовый курс"
              rows={3}
            />
          </label>
          <button type="submit">Создать задачу</button>
        </form>
      </section>

      {error && <div className="error">{error}</div>}

      <section className="card">
        <h2>Список задач</h2>
        {loading ? (
          <p className="muted">Загрузка...</p>
        ) : tasks.length === 0 ? (
          <p className="muted">Задач пока нет. Создайте первую!</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Название</th>
                  <th>Описание</th>
                  <th>Статус</th>
                  <th>Создана</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.id}</td>
                    <td>{task.title}</td>
                    <td>{task.description || '—'}</td>
                    <td>
                      <select
                        value={task.status}
                        onChange={(event) =>
                          handleStatusChange(task.id, event.target.value)
                        }
                      >
                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{formatDate(task.created_at)}</td>
                    <td>
                      <button
                        type="button"
                        className="danger"
                        onClick={() => handleDelete(task.id)}
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

export default App
