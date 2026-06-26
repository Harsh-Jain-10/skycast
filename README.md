# 🌦️ SkyCast — AI Weather Intelligence Platform

<div align="center">

<!-- Gradient Line Spacer -->
<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/gradient.png" width="100%" height="4px" />

<br />

<!-- Animated Project Logo/Title -->
<h1><code>SKYCAST</code></h1>
<h3>Cinematic AI Weather Intelligence Platform</h3>
<p><i>An award-winning, premium meteorological dashboard featuring live canvas-based atmospheric physics and LLM-powered insights.</i></p>

<br />

<!-- Row of Animated Weather SVGs representing atmospheric conditions -->
<div align="center">
  <img src="https://raw.githubusercontent.com/basmilius/meteocons/master/production/svg/fill/all/clear-day.svg" width="75" alt="Clear Day" />
  <img src="https://raw.githubusercontent.com/basmilius/meteocons/master/production/svg/fill/all/cloudy.svg" width="75" alt="Cloudy" />
  <img src="https://raw.githubusercontent.com/basmilius/meteocons/master/production/svg/fill/all/rain.svg" width="75" alt="Rain" />
  <img src="https://raw.githubusercontent.com/basmilius/meteocons/master/production/svg/fill/all/thunderstorms.svg" width="75" alt="Thunderstorms" />
  <img src="https://raw.githubusercontent.com/basmilius/meteocons/master/production/svg/fill/all/snow.svg" width="75" alt="Snow" />
  <img src="https://raw.githubusercontent.com/basmilius/meteocons/master/production/svg/fill/all/wind.svg" width="75" alt="Wind" />
</div>

<br />

<!-- Badges Grid -->
[![GitHub Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge&logo=git&logoColor=white)](https://github.com/Harsh-Jain-10/skycast)
[![License](https://img.shields.io/badge/License-MIT-success?style=for-the-badge&logo=open-source-initiative&logoColor=white)](https://github.com/Harsh-Jain-10/skycast/blob/main/LICENSE)
[![Stars](https://img.shields.io/github/stars/Harsh-Jain-10/skycast?style=for-the-badge&color=gold&logo=github)](https://github.com/Harsh-Jain-10/skycast/stargazers)
[![Issues](https://img.shields.io/github/issues/Harsh-Jain-10/skycast?style=for-the-badge&color=red&logo=git-lfs)](https://github.com/Harsh-Jain-10/skycast/issues)
[![Last Commit](https://img.shields.io/github/last-commit/Harsh-Jain-10/skycast?style=for-the-badge&logo=gitkraken&logoColor=white)](https://github.com/Harsh-Jain-10/skycast/commits/main)

<br />

[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-8E44AD?style=for-the-badge&logo=google-gemini&logoColor=white)](https://ai.google.dev)

<br />

<!-- Feature Badges -->
<img src="https://img.shields.io/badge/AI--Powered-Yes-FF69B4?style=flat-square" alt="AI Powered" /> • <img src="https://img.shields.io/badge/Responsive-Yes-blueviolet?style=flat-square" alt="Responsive" /> • <img src="https://img.shields.io/badge/Physics--Engine-60FPS%20Canvas-orange?style=flat-square" alt="Physics Engine" /> • <img src="https://img.shields.io/badge/Cache--Database-SQLite-lightgrey?style=flat-square" alt="SQLite Cache" />

<br />
<br />

</div>

---

## 📖 Introduction

SkyCast is a flagship **AI Weather Intelligence Platform** designed to offer a cinematic, editorial, and highly immersive weather tracking experience. Moving far beyond generic grid dashboards, SkyCast adapts its entire user interface—including colors, layouts, typography, micro-shadows, and a 60fps canvas particle system—to match the real-time weather of any queried city. 

By integrating a dual-engine AI pipeline (Gemini / Groq) with caching mechanisms, SkyCast translates complex meteorological telemetry into readable, conversational summaries and daily recommendations (wardrobe suggestions, sports conditions, agricultural advice, and travel warnings).

---

## ⚡ Feature Showcase

| Category | Feature Description | Visually Represented By |
| :--- | :--- | :--- |
| **Atmospheric Physics** | Live HTML5 Canvas physics engine rendering rain, wind drift, snow, lightning, and sun glow | 60FPS fluid particle simulations |
| **AI Intelligence** | Dual Gemini 1.5/3 & Groq LLM fallback producing natural language summaries | Word-by-word streaming typewriter card |
| **Editorial Layout** | Typography scale combining Google Font *Outfit* (temperatures) and *Inter* (data grids) | Premium editorial feel |
| **Interactive Gauges** | Bespoke dials for wind direction, humidity waves, UV progress, and moon phase crescents | SVG animated indicators |
| **Sleek Analytics** | 24h bezier lines, rain likelihood probability bars, and year-over-year historical climate | Highly transparent area charts |
| **Local Cache DB** | Database caching logic storing coordinate results and histories for 15 minutes | Zero API limits exhaustion |
| **Comparison Matrix** | Parallel coordinate querying to compare stats side-by-side without layout shifts | 3-Column comparing grids |

---

## 🚀 Live Demo & Links

*   **Live Dashboard Web Interface**: `http://localhost:5173` *(Local)*
*   **FastAPI Documentation**: [Swagger Web Interface](http://localhost:8000/docs)
*   **Weather Provider**: [Open-Meteo API](https://open-meteo.com)
*   **Source Code Repository**: [GitHub Repository Link](https://github.com/Harsh-Jain-10/skycast)

---

## 🛠️ Technology Stack

### Frontend Architecture
*   **Core Library**: React 19 (TypeScript)
*   **Bundler**: Vite + SWC
*   **Design Framework**: Tailwind CSS v4 (CSS-first config)
*   **Charting Suite**: Recharts (Custom smooth gradients, custom tooltips)
*   **Icons**: Lucide React
*   **Routing**: React Router DOM v7

### Backend Architecture
*   **Framework**: FastAPI (Asynchronous framework)
*   **ASGI Server**: Uvicorn
*   **Database Engine**: SQLAlchemy (SQLite dialect)
*   **AI Orchestration**: Google GenAI SDK & Groq API
*   **HTTP Clients**: Requests

---

## 📁 Project Structure

```
Skycast/
├── backend/                   # FastAPI Backend Application
│   ├── app/
│   │   ├── api/routes/        # REST Endpoints (weather, favorites, history, ai)
│   │   ├── core/              # Config settings, SQLite database configurations
│   │   ├── services/          # API Services (Open-Meteo integrations, Gemini AI Client)
│   │   ├── database.py        # SQLAlchemy Session Engine initialization
│   │   ├── models.py          # SQLite database schema models
│   │   ├── schemas.py         # Pydantic validation structures
│   │   └── main.py            # API gateway entrypoint
│   ├── requirements.txt       # Python package list
│   └── venv/                  # Python Virtual environment (Local only)
│
└── frontend/                  # Vite React Frontend Application
    ├── src/
    │   ├── components/        # WeatherBackground, MetricCard, WeatherCharts, Navbar
    │   ├── pages/             # Home, Favorites, Compare
    │   ├── types/             # Common TypeScript interfaces
    │   ├── App.tsx            # Main Application entry and theme variables manager
    │   ├── index.css          # Styling variables, custom scrolls, responsive grids
    │   └── main.tsx           # React DOM root renderer
    ├── package.json           # Frontend package descriptors
    └── vite.config.ts         # Vite bundler rules & aliases
```

---

## ⚙️ Installation & Running Locally

### Prerequisites
*   Node.js (v18+)
*   Python (3.10+)

### 1. Configure the Backend Server

1.  Navigate into the `backend/` folder:
    ```bash
    cd backend
    ```
2.  Set up a virtual environment and activate it:
    ```bash
    python -m venv venv
    # Windows:
    .\venv\Scripts\activate
    # macOS/Linux:
    source venv/bin/activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Configure Environment Variables:
    Create a `.env` file inside the `backend/` directory:
    ```env
    GEMINI_API_KEY=your_gemini_api_key
    GROQ_API_KEY=your_groq_api_key
    ```
    *Note: If no API keys are supplied, SkyCast will automatically fall back to its local, rule-based inference generator to keep all metrics active.*
5.  Start the FastAPI server:
    ```bash
    uvicorn app.main:app --port 8000
    ```

### 2. Configure the Frontend client

1.  Open a new terminal window and navigate to the `frontend/` folder:
    ```bash
    cd frontend
    ```
2.  Install npm packages:
    ```bash
    npm install
    ```
3.  Start the Vite dev server:
    ```bash
    npm run dev
    ```
4.  Access the interface at `http://localhost:5173` on your browser.

---

## 🏆 Premium Highlights vs. Traditional Dashboards

| Attribute | Traditional Dashboards | SkyCast Platform |
| :--- | :--- | :--- |
| **Visual Immersion** | Strict grid boxes, basic blue themes | Adaptive ambient themes, 60fps canvas particles |
| **Typographical Polish** | Single-font generic styling | Outfit & Inter hierarchy, editorial numbers |
| **Information Depth** | Raw numeric metrics only | LLM recommendations, activity, wardrobe guidelines |
| **Network Efficiency** | Excessive queries on every interaction | 15-minute SQLite local cache layer |
| **Comparative Engine** | Open multiple tabs to view statistics | Side-by-side matrices, instant updates |

---

## 🗺️ Project Roadmap

- [x] Adaptive Weather Thematic Color Engine
- [x] 60FPS Canvas Physics Simulation (Rain, Snow, Lightning, Stars)
- [x] Autocomplete Suggestions Geocoding Integration
- [x] Dual Gemini/Groq Fallback Summary Pipeline
- [x] SQLite Cache DB layer for Weather Telemetry
- [ ] Live Weather Radar Maps overlay (precipitation radar)
- [ ] PWA Support (Progressive Web App installation)
- [ ] Offline Mode (Cache storage persistence)
- [ ] Audio Voice Assistant (Typewriter read-aloud options)

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [LICENSE](https://github.com/Harsh-Jain-10/skycast/blob/main/LICENSE) for more information.

---

<div align="center">

## 🌟 Crafted with Precision by Harsh Jain

Thank you for exploring **SkyCast**! This project represents my dedication to engineering high-performance, visually stunning software interfaces and integrating modern generative AI models into elegant user workflows.

<br />

<!-- Interactive Contact Badges -->
[![GitHub Profile](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Harsh-Jain-10)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/harsh-jain-10/)
[![Email Contact](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:harsh.jainm1003@gmail.com)

<br />

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/gradient.png" width="100%" height="4px" />

<br />
<p align="center" style="font-size: 11px; color: #64748b;">
Built with passion for modern software engineering, artificial intelligence, and beautiful user experiences.<br />
<a href="#-skycast--ai-weather-intelligence-platform">Back to Top</a>
</p>

</div>
