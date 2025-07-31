/*
 * Controller für das Quest-Modul.  Hier werden CRUD‑Operationen für
 * Quests und Etappenziele implementiert.  Die Quests werden im
 * In‑Memory‑Store des Modells gespeichert.  In einer realen Anwendung
 * sollte hier eine Datenbank verwendet werden.
 */
import questModel from '../models/questModel.js';

// Hilfsfunktion: extrahiere userId aus dem Request-Body.  In einer realen
// Anwendung sollte diese Information aus dem Token stammen.
function getUserId(req) {
  return req.userId || (req.body && req.body.userId) || 1; // fallback Benutzer
}

export function createQuest(req, res) {
  const userId = getUserId(req);
  const { type, title, description, startDate, endDate, rewardId } = req.body;
  if (!type || !title) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Typ und Titel sind erforderlich.' }));
  }
  const quest = questModel.createQuest({ userId, type, title, description, startDate, endDate, rewardId });
  if (!quest) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Limit für Quests dieses Typs erreicht.' }));
  }
  res.writeHead(201, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify(quest));
}

export function listQuests(req, res) {
  const userId = getUserId(req);
  const quests = questModel.getUserQuests(userId);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify(quests));
}

export function getQuest(req, res, id) {
  const quest = questModel.findById(id);
  if (!quest) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Quest nicht gefunden.' }));
  }
  res.writeHead(200, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify(quest));
}

export function updateQuest(req, res, id) {
  const data = req.body;
  const quest = questModel.updateQuest(id, data);
  if (!quest) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Quest nicht gefunden.' }));
  }
  res.writeHead(200, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify(quest));
}

export function deleteQuest(req, res, id) {
  const success = questModel.deleteQuest(id);
  if (!success) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Quest nicht gefunden.' }));
  }
  res.writeHead(204);
  return res.end();
}

// Stage-Endpunkte
export function createStage(req, res, questId) {
  const { title, description, startDate, endDate, rewardId } = req.body;
  if (!title) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Titel ist erforderlich.' }));
  }
  const stage = questModel.addStage(questId, { title, description, startDate, endDate, rewardId });
  if (!stage) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Quest nicht gefunden.' }));
  }
  res.writeHead(201, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify(stage));
}

export function updateStage(req, res, questId, stageId) {
  const stage = questModel.updateStage(questId, stageId, req.body);
  if (!stage) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Etappenziel oder Quest nicht gefunden.' }));
  }
  res.writeHead(200, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify(stage));
}

export function deleteStage(req, res, questId, stageId) {
  const success = questModel.deleteStage(questId, stageId);
  if (!success) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Etappenziel oder Quest nicht gefunden.' }));
  }
  res.writeHead(204);
  return res.end();
}