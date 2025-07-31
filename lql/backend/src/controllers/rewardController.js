/*
 * Controller für Belohnungen und Punktelogik.  Erlaubt das Anlegen von
 * Belohnungen, das Anzeigen aller Belohnungen und das Einlösen einer
 * Belohnung (Kauf), sofern genügend Punkte vorhanden sind.
 */
import rewardModel from '../models/rewardModel.js';
import ledgerModel from '../models/pointLedgerModel.js';
import todoModel from '../models/todoModel.js';

function getUserId(req) {
  return req.userId || (req.body && req.body.userId) || 1;
}

export function createReward(req, res) {
  const userId = getUserId(req);
  const { title, description, imageUrl, amazonLink, pointsRequired } = req.body;
  if (!title || typeof pointsRequired !== 'number') {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Titel und Punkte sind erforderlich.' }));
  }
  const reward = rewardModel.createReward(userId, { title, description, imageUrl, amazonLink, pointsRequired });
  res.writeHead(201, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify(reward));
}

export function listRewards(req, res) {
  const userId = getUserId(req);
  const rewards = rewardModel.listRewards(userId);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify(rewards));
}

export function buyReward(req, res, rewardId) {
  const userId = getUserId(req);
  const reward = rewardModel.listRewards(userId).find((r) => r.id === rewardId);
  if (!reward) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Belohnung nicht gefunden.' }));
  }
  const currentPoints = todoModel.getPoints(userId);
  if (currentPoints < reward.pointsRequired) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Nicht genügend Punkte.' }));
  }
  // Punkte abziehen und Ledger aktualisieren
  todoModel.points.set(userId, currentPoints - reward.pointsRequired);
  ledgerModel.addEntry(userId, -reward.pointsRequired, `Belohnung gekauft: ${reward.title}`);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify({ message: 'Belohnung eingelöst.', remainingPoints: todoModel.getPoints(userId) }));
}