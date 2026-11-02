# Rakshika

A women's safety web app: trigger an SOS, share live location with trusted contacts, and get AI-assisted help when you receive threatening or scam messages.

**Live demo:** https://rakshika-frontend.vercel.app


<img width="1279" height="593" alt="Screenshot 2026-10-31 233021" src="https://github.com/user-attachments/assets/d12914f4-391d-4ca0-9069-146e5843af38" />
<img width="1213" height="581" alt="Screenshot 2026-10-31 233052" src="https://github.com/user-attachments/assets/9cefc52f-775e-4b7a-ac8d-2b376e2552be" />




## Features

- **Auth:** register and login with hashed passwords, with per-user authorization (users can't touch other users' data)
- **Trusted contacts:** add, list and delete up to 5 contacts, with duplicate and phone validation
- **SOS alert:** one tap sends an email alert with your location to all trusted contacts
- **Live location:** contacts get a tracking link that updates until you mark yourself safe; the screen is kept awake via the Screen Wake Lock API
- **Cyber threat reports:** paste a suspicious message and an LLM classifies it (threat, harassment, scam, phishing), rates severity, suggests next steps, and saves the report

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | Next.js, TypeScript |
| Backend | FastAPI, SQLAlchemy, Uvicorn |
| Database | PostgreSQL (Neon) |
| AI | Google Gemini API |
| Email | [Brevo] |
| Hosting | Vercel (frontend), Render (backend) |

## Architecture

<img width="849" height="495" alt="image" src="https://github.com/user-attachments/assets/ec76547f-5b95-416d-8407-6eae2460d08b" />


## Run locally

**Backend**
```bash
cd rakshika-backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
cp .env.example .env         # fill in your values
uvicorn main:app --reload
```

**Frontend**
```bash
cd rakshika-frontend
npm install
# .env.local -> NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

**Environment variables (backend)**

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `GEMINI_API_KEY` / `GEMINI_MODEL` | Threat report classifier |
| `[EMAIL_API_KEY]` | SOS email alerts |
| `SECRET_KEY` | JWT signing |


## limitations

- It's a web app, so browsers restrict background execution. Live tracking only works reliably while the page stays open (hence the wake lock).
- Emergency contact emails aren't verified, so an alert can go to an address that doesn't exist.

## Future improvements

- Evidence vault
- SMS alerts
- Contact email verification

## Author

Muskan
