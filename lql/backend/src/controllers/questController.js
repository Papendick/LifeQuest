/*
 * Controller für das Quest-Modul.  Hier werden CRUD‑Operationen für
 * Quests und Etappenziele implementiert.  Die Quests werden im
 * In‑Memory‑Store des Modells gespeichert.  In einer realen Anwendung
 * sollte hier eine Datenbank verwendet werden.
 */
import questModel from '../models/questModel.js';

// In einer echten Anwendung würde die userId aus dem JWT ausgelesen.
// Für diesen Prototyp kann sie optional im Body mitgeschickt werden.

// Hilfsfunktion: extrahiere userId aus dem Request-Body.  In einer realen
// Anwendung sollte diese Information aus dem Token stammen.
function getUserId(req) {
  return req.userId || (req.body && req.body.userId) || 1; // fallback Benutzer
}

export function createQuest(req, res) {
  const userId = getUserId(req);
  const { type, title, description, startDate, endDate, rewardId } = req.body;
  if (!type || !title) {
    return res.status(400).json({ message: 'Typ und Titel sind erforderlich.' });
  }
  const quest = questModel.createQuest({ userId, type, title, description, startDate, endDate, rewardId });
  if (!quest) {
    return res.status(400).json({ message: 'Limit für Quests dieses Typs erreicht.' });
  }
  return res.status(201).json(quest);
}

export function listQuests(req, res) {
  const userId = getUserId(req);
  const quests = questModel.getUserQuests(userId).map((q) => ({
    ...q,
    progress: questModel.calculateProgress(q),
  }));
  return res.json(quests);
}

export function getQuest(req, res) {
  const id = parseInt(req.params.id);
  const quest = questModel.findById(id);
  if (!quest) {
    return res.status(404).json({ message: 'Quest nicht gefunden.' });
  }
  const result = { ...quest, progress: questModel.calculateProgress(quest) };
  return res.json(result);
}

export function updateQuest(req, res) {
  const id = parseInt(req.params.id);
  const data = req.body;
  const quest = questModel.updateQuest(id, data);
  if (!quest) {
    return res.status(404).json({ message: 'Quest nicht gefunden.' });
  }
  return res.json(quest);
}

export function deleteQuest(req, res) {
  const id = parseInt(req.params.id);
  const success = questModel.deleteQuest(id);
  if (!success) {
    return res.status(404).json({ message: 'Quest nicht gefunden.' });
  }
  return res.status(204).end();
}

// Stage-Endpunkte
export function createStage(req, res) {
  const questId = parseInt(req.params.id);
  const { title, description, startDate, endDate, rewardId } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'Titel ist erforderlich.' });
  }
  const stage = questModel.addStage(questId, { title, description, startDate, endDate, rewardId });
  if (!stage) {
    return res.status(404).json({ message: 'Quest nicht gefunden.' });
  }
  return res.status(201).json(stage);
}

export function updateStage(req, res) {
  const questId = parseInt(req.params.id);
  const stageId = parseInt(req.params.stageId);
  const stage = questModel.updateStage(questId, stageId, req.body);
  if (!stage) {
    return res.status(404).json({ message: 'Etappenziel oder Quest nicht gefunden.' });
  }
  return res.json(stage);
}

export function deleteStage(req, res) {
  const questId = parseInt(req.params.id);
  const stageId = parseInt(req.params.stageId);
  const success = questModel.deleteStage(questId, stageId);
  if (!success) {
    return res.status(404).json({ message: 'Etappenziel oder Quest nicht gefunden.' });
  }
  return res.status(204).end();
}