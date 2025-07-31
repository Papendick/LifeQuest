/*
 * Controller für das Tagebuch‑Modul.  Erstellt Einträge, verbessert diese
 * optional über die KI und prüft sie gegen die Gesetze.  Punktelogik
 * wird über das ToDo-Modell verwaltet.
 */
import diaryModel from '../models/diaryModel.js';
import lawModel from '../models/lawModel.js';
import { improveDiaryEntry, checkLaws } from '../../services/ai/geminiService.js';

function getUserId(req) {
  return req.userId || (req.body && req.body.userId) || 1;
}

export async function createEntry(req, res) {
  const userId = getUserId(req);
  const { content, date, improve } = req.body;
  if (!content || !date) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Inhalt und Datum sind erforderlich.' }));
  }
  // KI‑Verbesserung
  let improvedContent = null;
  let tags = [];
  try {
    if (improve) {
      const aiResult = await improveDiaryEntry(content);
      improvedContent = aiResult?.improved || null;
      tags = aiResult?.tags || [];
    }
  } catch (e) {
    // Bei Fehler bleibt improvedContent null
  }
  // Gesetzesprüfung (optional, simuliert Strafe)
  let penalties = 0;
  try {
    const laws = lawModel.listLaws(userId);
    if (laws.length > 0) {
      const violations = await checkLaws(content, laws);
      if (Array.isArray(violations)) {
        penalties = violations.reduce((sum, v) => sum + (v.penaltyPoints || 0), 0);
      }
    }
  } catch (e) {
    // Bei Fehler keine Strafpunkte
  }
  const entry = diaryModel.createEntry({ userId, date, content, improvedContent, tags, penalties, points: 0 });
  res.writeHead(201, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify(entry));
}

export function listEntries(req, res) {
  const userId = getUserId(req);
  const entries = diaryModel.listEntries(userId);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify(entries));
}

export function listByDate(req, res, date) {
  const userId = getUserId(req);
  const entries = diaryModel.findByDate(userId, date);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify(entries));
}