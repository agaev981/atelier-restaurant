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

## Публичный деплой (бесплатно, Render)

GitHub Pages отдаёт только статику, поэтому для рабочей формы брони бэкенд
деплоится на [render.com](https://render.com) (free-план).

Самый быстрый путь — кнопка автодеплоя:

**[→ Deploy to Render (один клик)](https://render.com/deploy?repo=https://github.com/agaev981/atelier-restaurant)**

1. Войдите через GitHub.
2. На шаге переменных вставьте секреты из `backend/.env`:
   `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID`.
3. Нажмите **Apply** — Render создаст сервис из `render.yaml`
   (адрес вида `https://atelier-restaurant.onrender.com`).
4. Адрес сервиса нужно вписать в `index.html` → `window.ATELIER_API_BASE`.

Либо вручную: **New → Blueprint** → выберите репозиторий — настройки
подхватятся из `render.yaml`.

Нюанс free-плана Render: диск эфемерный, при перезапусках сервиса база SQLite
сбрасывается. Для демо этого достаточно; для продакшена подключите Postgres.

## Структура

```
index.html            — разметка всех секций
css/style.css         — тема, компоненты, адаптив
js/main.js            — табы, бургер, форма, маска телефона, модалка, reveal
backend/main.py       — FastAPI: POST /api/bookings, SQLite, Telegram
backend/.env          — секреты (в .gitignore, не коммитится)
backend/.env.example  — шаблон секретов
```

