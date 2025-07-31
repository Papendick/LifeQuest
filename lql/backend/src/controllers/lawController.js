/*
 * Controller für das Gesetzes‑Modul.  Erlaubt das Anlegen mehrerer Regeln
 * gleichzeitig und das Abrufen der bestehenden Regeln eines Nutzers.
 */
import lawModel from '../models/lawModel.js';

function getUserId(req) {
  return req.userId || (req.body && req.body.userId) || 1;
}

export function createLaws(req, res) {
  const userId = getUserId(req);
  const items = req.body;
  const created = lawModel.createBatch(userId, items);
  if (!created) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Gesetze müssen 10–50 gültige Einträge enthalten.' }));
  }
  res.writeHead(201, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify(created));
}

export function listLaws(req, res) {
  const userId = getUserId(req);
  const laws = lawModel.listLaws(userId);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify(laws));
}