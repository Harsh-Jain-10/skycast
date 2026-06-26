# Skycast 🌦️ - AI Weather Intelligence Platform

Skycast is a sleek, modern, dashboard-style **AI Weather Intelligence Platform** built using FastAPI, React 19, TypeScript, Tailwind CSS v4, and the Google Gemini API. Inspired by the designs of Apple Weather, Linear, and Stripe, it features glassmorphism, responsive cards, interactive data graphs, and LLM-powered insights.

---

## 🚀 Key Features

*   **Real-Time Dashboard**: Sleek widgets detailing current temperature, feels-like temperatures, humidity, barometric pressure, visibility, dew point, wind details, UV index, sunrise/sunset, and moon phases.
*   **Dynamic Weather Canvas**: Beautiful background shaders and particle systems simulating weather states (rain drops, snowfall, lightning flashes, drifting clouds, sun glow).
*   **AI Weather Intelligence**: Tabbed AI center powered by **Gemini 3 Flash** offering natural-language summaries, virtual wardrobe suggestions, travel safety advisories, agricultural tips, and running/cycling conditions.
*   **Hourly & 7-Day Forecasts**: Interactive 24-hour carousels and 7-day projection grids with mini range meters.
*   **Interactive Analytics**: Data graphs plotting 24-hour temperature, precipitation probability, wind gust profiles, UV levels, and year-over-year historical climate averages.
*   **Favorites Tracker**: Side-by-side weather indicator cards for bookmarked locations.
*   **City Comparison Matrix**: Compare coordinates, current metrics, and short-term forecasts for up to three cities side-by-side.
*   **Smart Autocomplete**: Debounced city autocomplete search suggestions querying the Open-Meteo Geocoding database.
*   **Geolocation Routing**: Automatic browser-based GPS lookup to instantly query local weather.
*   **Persistent Caching & Caching DB**: Weather queries are cached locally in SQLite for 15 minutes to reduce API latency.

---

## 🛠️ Architecture & Tech Stack

```
Skycast/
├── backend/                  # FastAPI Application
│   ├── app/
│   │   ├── api/routes/       # Endpoints (weather, favorites, history, ai)
│   │   ├── core/             # Configuration & Settings
│   │   ├── services/         # Integrations (Open-Meteo, Gemini AI)
│   │   ├── models.py         # SQLAlchemy Tables (SQLite database)
│   │   ├── schemas.py        # Pydantic schemas
│   │   └── main.py           # Server Entrypoint
│   └── requirements.txt
│
└── frontend/                 # Vite + React + TypeScript + Tailwind v4
    ├── src/
    │   ├── components/       # MetricCard, WeatherBackground, WeatherCharts, Navbar
    │   ├── pages/            # Home, Favorites, Compare
    │   └── App.tsx           # Router and state management
    └── package.json
```

---

## ⚙️ Installation & Running Locally

### 1. Run the FastAPI Backend

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Create and activate a virtual environment:
    ```bash
    python -m venv venv
    # Windows PowerShell:
    .\venv\Scripts\activate
    # macOS/Linux:
    source venv/bin/activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  *(Optional)* Set up API Keys:
    Create a `.env` file in the `backend/` directory:
    ```env
    GEMINI_API_KEY=your_gemini_api_key_here
    ```
    *If no key is provided, Skycast will gracefully fall back to a rule-based smart intelligence generator so all cards remain functional.*
5.  Start the development server:
    ```bash
    uvicorn app.main:app --reload
    ```
    *The API will be available at `http://localhost:8000` (docs: `/docs`).*

### 2. Run the React Frontend

1.  Navigate to the frontend directory:
    ```bash
    cd ../frontend
    ```
2.  Install packages:
    ```bash
    npm install
    ```
3.  Start the Vite dev server:
    ```bash
    npm run dev
    ```
    *The dashboard will be available at `http://localhost:5173`.*

---

## 🧪 Testing

To run the backend test suite:
```bash
cd backend
.\venv\Scripts\activate
pytest
```
