/**
 * Registry of Google Services used in the application.
 */
export const GOOGLE_SERVICES = {
  cloudRun: { name: 'Google Cloud Run', usage: 'Production hosting + auto-scaling', status: 'active' },
  geminiAPI: { name: 'Gemini API', usage: 'AI-powered election chatbot', status: 'active' },
  firebaseRealtimeDB: { name: 'Firebase Realtime DB', usage: 'Chat history + quiz scores persistence', status: 'active' },
  firebaseAnalytics: { name: 'Firebase Analytics', usage: 'Track most asked questions + user engagement', status: 'active' },
  googleFonts: { name: 'Google Fonts API', usage: 'Noto Sans — Hindi + English typography', status: 'active' },
  googleMaps: { name: 'Google Maps Embed API', usage: 'Election Commission office locations', status: 'active' }
}
