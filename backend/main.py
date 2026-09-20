"""ATELIER — backend of the restaurant booking app.

FastAPI + SQLite + Telegram notifications.
Secrets are stored in backend/.env (excluded from git).
"""

import html
import logging
import os
import re
import sqlite3
from contextlib import asynccontextmanager
from datetime import date, datetime
from pathlib import Path

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field, field_validator
from starlette.exceptions import HTTPException as StarletteHTTPException

BACKEND_DIR = Path(__file__).resolve().parent
ROOT_DIR = BACKEND_DIR.parent
DB_PATH = BACKEND_DIR / "data" / "bookings.db"

load_dotenv(BACKEND_DIR / ".env")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "").strip()
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "").strip()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)
log = logging.getLogger("atelier")


def get_connection() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with get_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS bookings (
                id             INTEGER PRIMARY KEY AUTOINCREMENT,
                name           TEXT    NOT NULL,
                phone          TEXT    NOT NULL,
                guests         INTEGER NOT NULL,
                date           TEXT    NOT NULL,
                time           TEXT    NOT NULL,
                comment        TEXT,
                telegram_sent  INTEGER NOT NULL DEFAULT 0,
                created_at     TEXT    NOT NULL
            )
            """
        )
    log.info("SQLite готова: %s", DB_PATH)


# ---------------- models ----------------


class BookingIn(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    phone: str = Field(min_length=6, max_length=20)
    guests: int = Field(ge=1, le=8)
    date: str = Field(pattern=r"^\d{4}-\d{2}-\d{2}$")
    time: str = Field(pattern=r"^([01]\d|2[0-3]):[0-5]\d$")
    comment: str | None = Field(default=None, max_length=500)

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if not re.fullmatch(r"[А-Яа-яЁёA-Za-z\s-]+", v):
            raise ValueError("Имя может содержать только буквы")
        return v

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        digits = re.sub(r"\D", "", v)
        if digits.startswith("8"):
            digits = "7" + digits[1:]
        if len(digits) != 11 or not digits.startswith("7"):
            raise ValueError("Некорректный номер телефона")
        return "+7" + digits[1:]

    @field_validator("date")
    @classmethod
    def validate_date(cls, v: str) -> str:
        try:
            d = date.fromisoformat(v)
        except ValueError as exc:
            raise ValueError("Некорректная дата") from exc
        if d < date.today():
            raise ValueError("Дата не может быть в прошлом")
        return v

    @field_validator("time")
    @classmethod
    def validate_time(cls, v: str) -> str:
        if not ("12:00" <= v <= "23:00"):
            raise ValueError("Ресторан работает с 12:00 до 23:00")
        return v

    @field_validator("comment")
    @classmethod
    def clean_comment(cls, v: str | None) -> str | None:
        if v is None:
            return None
        v = v.strip()
        return v or None


# ---------------- telegram ----------------


async def send_telegram_notification(booking_id: int, b: BookingIn) -> bool:
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        log.warning("Telegram не настроен (backend/.env) — уведомление пропущено")
        return False

    text = (
        "🍽 <b>Новая бронь — ATELIER</b>\n"
        f"🆔 Заявка №{booking_id}\n"
        f"👤 Имя: {html.escape(b.name)}\n"
        f"📞 Телефон: {html.escape(b.phone)}\n"
        f"👥 Гостей: {b.guests}\n"
        f"📅 Дата: {b.date}\n"
        f"🕗 Время: {b.time}"
    )
    if b.comment:
        text += f"\n💬 Пожелания: {html.escape(b.comment)}"

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage",
                json={"chat_id": TELEGRAM_CHAT_ID, "text": text, "parse_mode": "HTML"},
            )
            resp.raise_for_status()
        return True
    except Exception:
        log.exception("Не удалось отправить уведомление в Telegram (заявка №%d)", booking_id)
        return False


# ---------------- app ----------------


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    yield


app = FastAPI(title="ATELIER — Booking API", lifespan=lifespan)

# allow the public frontend (GitHub Pages etc.) to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health():
    return {"ok": True}


@app.post("/api/bookings")
async def create_booking(booking: BookingIn):
    now = datetime.now().isoformat(timespec="seconds")

    with get_connection() as conn:
        cur = conn.execute(
            """
            INSERT INTO bookings (name, phone, guests, date, time, comment, telegram_sent, created_at)
            VALUES (?, ?, ?, ?, ?, ?, 0, ?)
            """,
            (booking.name, booking.phone, booking.guests, booking.date, booking.time, booking.comment, now),
        )
        booking_id = cur.lastrowid
        conn.commit()

    log.info("Заявка №%d сохранена: %s, %s, гостей: %s, %s %s", booking_id, booking.name, booking.phone, booking.guests, booking.date, booking.time)

    telegram_sent = await send_telegram_notification(booking_id, booking)
    if telegram_sent:
        with get_connection() as conn:
            conn.execute("UPDATE bookings SET telegram_sent = 1 WHERE id = ?", (booking_id,))
            conn.commit()

    return {"ok": True, "id": booking_id, "telegram_sent": telegram_sent}


# static site (frontend) — mounted last, API routes take priority


class SafeStaticFiles(StaticFiles):
    """Serves only public site files: blocks backend/ and all dotfiles (.env, .git, .kilo)."""

    async def get_response(self, path: str, scope):
        # on Windows Starlette hands over paths with backslashes — normalize first
        parts = [p for p in path.replace("\\", "/").split("/") if p and p not in (".", "..")]
        if parts and (any(p.startswith(".") for p in parts) or parts[0].lower() == "backend"):
            raise StarletteHTTPException(status_code=404)
        return await super().get_response(path, scope)


app.mount("/", SafeStaticFiles(directory=ROOT_DIR, html=True), name="site")
