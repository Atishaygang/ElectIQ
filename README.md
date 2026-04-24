# ElectIQ — India Election Education Assistant

ElectIQ is a comprehensive, production-grade web application to educate Indian citizens about the democratic process. It features a complete two-portal architecture (Citizen and Educator portals) built on a modern React 18, Vite, and Tailwind CSS v4 stack, completely integrated with Google Services.

## Features

**Citizen Portal** (`/citizen`)
- **AI Chatbot**: Powered by Gemini API to answer election-specific queries (in Hindi and English) under strict constraints, with fallback mechanisms.
- **Visual Timeline**: Interactive 12-step exploration of the ECI schedule.
- **Interactive Quiz**: Real-time evaluation spanning difficulty levels, scoring dynamically to Firebase.
- **Live Data**: Active polling on community queries linked via Firebase Realtime Database.

**Educator Portal** (`/educator`)
- **Dashboard Overview**: Macro analysis across active sessions and queries.
- **Quiz Builder**: Administration suite for deploying custom questions.
- **Classroom Mode**: Scaled formatting for timeline instruction.

## Integrated Google Services
1. **Google Cloud Run**: Pre-configured CI/CD deployment (`cloudbuild.yaml` & Dockerfile).
2. **Gemini API**: ElectIQ context-aware assistance.
3. **Firebase Realtime DB**: Used for chat routing, query caching, and dynamic quiz leadership tracking.
4. **Firebase Analytics**: User engagement polling.
5. **Google Fonts**: Cross-platform reliable text rendering using `Noto Sans`.
6. **Google Maps Embed API**: Integrated into the *Explore* section illustrating election centers.

## Installation & Setup
1. Clone this repository: `git clone https://github.com/Atishaygang/ElectIQ.git`
2. Change into the application directory: `cd ElectIQ-App`
3. Install dependencies: `npm install`
4. Duplicate `.env.example` as `.env` and fill in your API credentials. **Never commit `.env`!**
5. Start local server: `npm run dev`

## Development Scripts
- `npm run dev` - Start local Vite server
- `npm run build` - Create production bundle
- `npm run test:run` - Execute Vitest suite

*This repository guarantees that no sensitive API keys are exposed by strictly enforcing `.gitignore` rules down the directory tree.*