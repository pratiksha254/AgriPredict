# SunGit - Basic Backend

This project now includes a minimal Node.js Express backend to serve the static frontend and proxy external APIs (to avoid exposing API keys in the browser and to bypass CORS).

## Prerequisites

- Node.js 18+

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables. Create a `.env` file in the project root with:

```
PORT=3000
OPENWEATHER_API_KEY=your_openweather_key
```

3. Start the server:

```bash
npm run start
```

Visit `http://localhost:3000`.

## Proxy Endpoints

- GET `/api/health` – health check
- GET `/api/weather?q=City` – proxies OpenWeather current weather
- GET `/api/forecast?q=City` – proxies OpenWeather forecast
- GET `/api/soil?lat=..&lon=..&property=phh2o&depth=0-5cm` – proxies SoilGrids

## Notes

- The backend serves all files in the project root as static assets.
- Update your frontend to call the proxy routes if needed (e.g., replace direct OpenWeather calls).


