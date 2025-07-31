/*
 * Dieser Service kapselt die Kommunikation mit der Google Gemini‑API.
 * Die Implementierung ist derzeit nur ein Platzhalter.  In späteren
 * Entwicklungsphasen sollen hier Funktionen wie `improveDiaryEntry`,
 * `checkLaws` oder `summarizeEntries` umgesetzt werden.
 */
import fetch from "node-fetch";
import dotenv from "dotenv";

// Lade Umgebungsvariablen (API‑Key, Modell, Basis‑URL)
dotenv.config({ path: new URL("../../backend/.env", import.meta.url).pathname });

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL;
const BASE_URL = process.env.GEMINI_BASE_URL;

/**
 * Generischer Aufruf der Gemini‑API.
 * @param {string} prompt Die Eingabeaufforderung
 * @param {object} options Zusätzliche Parameter (z. B. response_schema)
 */
export async function callGemini(prompt, options = {}) {
  if (!API_KEY) {
    throw new Error("Gemini‑API‑Key fehlt in der .env-Datei.");
  }
  const url = `${BASE_URL}/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    ...options,
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini‑API‑Fehler: ${res.status} – ${errorText}`);
  }
  const data = await res.json();
  return data;
}

// Platzhalterfunktionen für zukünftige Features
export async function improveDiaryEntry(content) {
  // TODO: Implementierung mit passender Prompt und response_schema
  return null;
}

export async function checkLaws(content, laws) {
  // TODO: Implementierung mit Funktion zum Prüfen von Gesetzen
  return null;
}

export async function summarizeEntries(entries) {
  // TODO: Implementierung für Zusammenfassungen über langes Kontextfenster
  return null;
}