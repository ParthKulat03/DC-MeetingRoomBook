# Room Booker Backend

Backend for the internal company room booking system.

## Technology Stack

- FastAPI
- PostgreSQL
- SQLAlchemy
- Alembic
- Pydantic
- WebSockets

## Project Structure

```text
backend/
│
├── app/
│   ├── main.py
│   ├── core/
│   ├── models/
│   ├── schemas/
│   ├── repositories/
│   ├── services/
│   ├── api/
│   ├── websocket/
│   ├── utils/
│   └── migrations/
│
├── tests/
├── .env
├── .env.example
├── .gitignore
├── alembic.ini
├── requirements.txt
└── README.md