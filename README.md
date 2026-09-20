# ATELIER — сайт ресторана с онлайн-бронированием

Одностраничный сайт ресторана авторской кухни с рабочим бэкендом: тёмная тема,
акценты тёплого золота, микроанимации, интерактивное меню с табами, форма
бронирования с валидацией, уведомления в Telegram.

## Стек

**Фронтенд:** чистые HTML / CSS / JavaScript, Google Fonts (Cormorant Garamond + Manrope), Unsplash, OpenStreetMap.
**Бэкенд:** Python + FastAPI, SQLite, Telegram Bot API, pydantic-валидация, python-dotenv.

## Запуск

### Бэкенд (раздаёт и сайт, и API)

```bash
cd backend
python -m venv .venv                 # опционально
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000
```

Открыть http://127.0.0.1:8000

API:

- `POST /api/bookings` — создать бронь. JSON: `name`, `phone`, `guests`, `date` (YYYY-MM-DD), `time` (HH:MM), `comment` (опционально)
- `GET /api/health` — проверка живости

Заявки сохраняются в `backend/data/bookings.db` (SQLite).

### Telegram-уведомления

1. Создайте бота у [@BotFather](https://t.me/BotFather), скопируйте токен.
2. Напишите боту любое сообщение, откройте `https://api.telegram.org/bot<ТОКЕН>/getUpdates` и возьмите `chat.id`.
3. Впишите значения в `backend/.env` (есть шаблон `backend/.env.example`).

Если ключи не заданы — бронь всё равно сохраняется, уведомление просто пропускается.

### Только фронтенд (статика)

```bash
python -m http.server 8080
```

## Структура

```
index.html            — разметка всех секций
css/style.css         — тема, компоненты, адаптив
js/main.js            — табы, бургер, форма, маска телефона, модалка, reveal
backend/main.py       — FastAPI: POST /api/bookings, SQLite, Telegram
backend/.env          — секреты (в .gitignore, не коммитится)
backend/.env.example  — шаблон секретов
```

