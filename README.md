# AI Task Manager

Веб-приложение для управления задачами. Практическое задание уровня Junior.

**Стек:** React + Node.js (Express) + PostgreSQL + Python

## Структура проекта

| Файл / папка | Назначение |
|--------------|------------|
| `backend/server.js` | Точка входа Express-сервера, подключение маршрутов |
| `backend/routes/tasks.js` | REST API: CRUD-операции с задачами |
| `backend/db/db.js` | Подключение к PostgreSQL через пул соединений |
| `backend/.env.example` | Пример переменных окружения для backend |
| `database/schema.sql` | SQL-скрипт создания таблицы `tasks` |
| `frontend/src/App.jsx` | React-интерфейс: форма, таблица, статусы, удаление |
| `frontend/vite.config.js` | Настройка Vite и прокси к API |
| `python/export_tasks.py` | Экспорт всех задач из БД в CSV |
| `python/requirements.txt` | Python-зависимости |

## Требования

- Node.js 18+
- PostgreSQL 14+
- Python 3.10+
- Git

## 1. База данных

Создайте базу и таблицу:

```powershell
psql -U postgres -c "CREATE DATABASE task_manager;"
psql -U postgres -d task_manager -f database/schema.sql
```

Таблица `tasks`:

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | SERIAL PRIMARY KEY | Уникальный идентификатор |
| `title` | VARCHAR(255) | Название задачи |
| `description` | TEXT | Описание |
| `status` | VARCHAR(20) | `new`, `in_progress`, `done` |
| `created_at` | TIMESTAMP | Дата создания |

## 2. Backend

```powershell
cd backend
copy .env.example .env
```

Отредактируйте `.env` — укажите пароль PostgreSQL:

```env
DB_PASSWORD=ваш_пароль
DB_NAME=task_manager
```

Запуск:

```powershell
npm install
npm run dev
```

Сервер: `http://localhost:5000`

### API

| Метод | URL | Описание |
|-------|-----|----------|
| `GET` | `/tasks` | Список задач |
| `POST` | `/tasks` | Создать задачу `{ "title": "...", "description": "..." }` |
| `PUT` | `/tasks/:id` | Изменить статус `{ "status": "in_progress" }` |
| `DELETE` | `/tasks/:id` | Удалить задачу |

## 3. Frontend

В **отдельном** терминале:

```powershell
cd frontend
npm install
npm run dev
```

Откройте в браузере: `http://localhost:5173`

На странице доступны:

- форма создания задачи;
- таблица со списком задач;
- изменение статуса через `<select>`;
- кнопка удаления.

## 4. Python-экспорт

```powershell
cd python
pip install -r requirements.txt
python export_tasks.py
```

Скрипт читает настройки из `backend/.env`, выгружает все задачи и сохраняет CSV в папку `python/`.

## Проверка работоспособности

1. Запустите PostgreSQL.
2. Запустите backend — в консоли должно быть: `PostgreSQL подключен`.
3. Запустите frontend — откройте `http://localhost:5173`.
4. Создайте задачу через форму — она появится в таблице.
5. Смените статус в select — значение обновится.
6. Нажмите «Удалить» — задача исчезнет.
7. Запустите `python export_tasks.py` — появится CSV-файл.

### Проверка API через curl

```powershell
curl http://localhost:5000/tasks

curl -X POST http://localhost:5000/tasks -H "Content-Type: application/json" -d "{\"title\":\"Изучить React\",\"description\":\"Пройти базовый курс\"}"

curl -X PUT http://localhost:5000/tasks/1 -H "Content-Type: application/json" -d "{\"status\":\"in_progress\"}"

curl -X DELETE http://localhost:5000/tasks/1
```

## Git

```powershell
git init
git add .
git commit -m "Initial commit: AI Task Manager"
```

Загрузите репозиторий на GitHub и приложите README + отчёт со скриншотами.
